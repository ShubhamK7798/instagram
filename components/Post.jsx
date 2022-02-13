import Image from "next/image";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiMessageCircle } from "react-icons/fi";
import {  FaRegPaperPlane } from "react-icons/fa";
import {  GiCrossMark } from "react-icons/gi";
import { HiOutlineBookmark } from "react-icons/hi";
import Moment from 'react-moment';
import { useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { BsEmojiSmile } from "react-icons/bs";

const Post = ({ caption, username, image, id, uid ,profilepicture ,post_time}) => {
  const session = useSession();
  const user = session?.data?.user;
  const [getcomments, setGetComments] = useState([]);
  const [comment, setComment] = useState();
  const [like, setLike] = useState(false);
  const [picker,setPicker] = useState(false)

  

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts", id, "comments"), orderBy("comment_time", "desc")),
        (snapshot) =>
          setGetComments(snapshot.docs.map((item) => ({ ...item.data(), commentid: item.id })))
      ),
    []
  );



    




  const deletePost = async ()=> {
    const delPost = await deleteDoc(doc(db, "posts", id))
  }

  const uploadComments = async () => {
    setComment("");
    await addDoc(collection(db, `posts`, id, "comments"), {
      username: user.name,
      postid: id,
      profilepicture: user.image,
      comment,
      uid,
      comment_time: serverTimestamp(),
    });
  };

  

  return (
    <div className="bg-white w-full flex flex-col mt-8 py-4 ">
      <div className="flex justify-between p-4 items-center">
        <div className="flex items-center space-x-2">
          {profilepicture &&      <Image
            src={profilepicture}
            width={30}
            height={30}
            className="rounded-full object-cover border-2 cursor-pointer "
          />}
     
          <span className="text-md font-semibold">{username}</span>
        </div>
        <div className="text-sm italic"><Moment fromNow>{post_time?.toDate()}</Moment></div>
        
  {
    user?.uid === uid && <div className="icon text-red-500" onClick={deletePost}  ><GiCrossMark/></div>
  }
      </div>

      <div className="relative w-full h-80 bg-black text-white flex justify-center ">
      
      {image &&  <Image src={image} layout="fill" objectFit="contain" />}
      </div>

      <div className="flex justify-between items-center p-2">
        <div className="flex space-x-2">
          {like ? <AiFillHeart className='icon text-red-500' onClick={()=> setLike(!like)} /> : <AiOutlineHeart className='icon'  onClick={()=> setLike(!like)} />}
          <FiMessageCircle className="icon" />
          <FaRegPaperPlane className="icon" />
        </div>
        <HiOutlineBookmark className="icon" />
      </div>

      <div className="px-2">
        <div className="flex space-x-2">
          <span className="font-bold hover:underline">{username}</span>
          <p>{caption}</p>
        </div>
      </div>

      {/* comments section */}
      <div className="p-2 flex flex-col gap-y-2 overflow-y-auto  max-h-20">
        {getcomments.map((comm) => (
          <div key={comm.commentid} className="flex space-x-2 items-center justify-between">
            <div className="flex space-x-2 items-center justify-between">

            <div className="h-6 w-6 rounded-full relative overflow-hidden">
              <Image src={comm.profilepicture} layout="fill" objectFit="cover" />
            </div>

              <div className="flex space-x-2 items-center">
                <span className="font-semibold ">{comm.username}</span>
                <p className="italic">{comm.comment}</p>
            </div>
            </div>

           
            <div className="text-xs italic"><Moment fromNow>{comm.comment_time?.toDate()}</Moment></div>

          </div>
        ))}
      </div>

      <div className="flex justify-between px-2 space-x-4 items-center relative">
        <i><BsEmojiSmile className="text-xl" /> </i>
        <textarea
          type="text"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="comments"
          rows={1}
          className="flex-grow outline-none"
        />
        <button
          className="text-blue-600 font-bold disabled:opacity-50 "
          onClick={uploadComments}
          disabled={session.status === "unauthenticated"}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default Post;
