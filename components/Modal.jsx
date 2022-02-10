import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { db, storage } from "../firebase";
import { clicked } from "../redux/modalSlice";
import { BallTriangle } from "react-loading-icons";

const Modal = () => {
  const dispatch = useDispatch();
  const [select, setSelect] = useState();
  const [caption, setCaption] = useState();
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const user = session?.data?.user;

  const inputRef = useRef();

  const userinput = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = (e) => setSelect(e.target.result);
  };

  const uploadFirebase = async () => {
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      username: user.name,
      useremail: user.email,
      profilepicture: user.image,
      caption,
      post_time: serverTimestamp(),
      uid: user.uid,
    });

    const imageref = ref(storage, `Postimages/${docRef.id}/image`);

    await uploadString(imageref, select, "data_url").then(async (snapshot) => {
      const downloadurl = await getDownloadURL(imageref);

      await updateDoc(doc(db, "posts", `${docRef.id}`), {
        image: downloadurl,
      });
      setLoading(false);
      dispatch(clicked());
    });
  };

  return (
    <div>
      <div
        className="absolute top-0 right-4 h-full w-full bg-black/50 flex justify-center items-center z-50 "
        onClick={(e) => dispatch(clicked())}
      >
        <div
          className="w-2/3 md:w-1/3  flex flex-col items-center p-4  h-3/5 rounded-2xl shadow-xl bg-white   space-y-4 "
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="font-semibold">Create New Post</h1>

          <div className=" overflow-hidden w-full h-2/3  relative flex flex-col justify-center items-center ">
            {!select ? (
              <button
                className="bg-blue-500 rounded-lg p-2 text-white"
                onClick={() => inputRef.current.click()}
              >
                Choose Image
              </button>
            ) : (
              <Image src={select} alt="selected image" layout="fill" objectFit="cover" />
            )}
            {loading && <BallTriangle className="absolute z-50" fill="black" />}

            <input type="file" ref={inputRef} accept="image/*" onChange={userinput} hidden />
          </div>

          <div className="w-full">
            <textarea
              placeholder="Write a Caption..."
              rows={2}
              className="w-full "
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div>
            <button
              className="font-semibold text-blue-600 disabled:opacity-50"
              onClick={uploadFirebase}
              disabled={loading}
            >
              {loading ? "Uploading" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
