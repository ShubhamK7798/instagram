import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Post from "./Post";

const Feed = () => {
  const [post, setPost] = useState([]);

  useEffect(
    () =>
      onSnapshot(query(collection(db, "posts"), orderBy("post_time", "desc")), (snapshot) =>
        setPost(snapshot.docs.map((item) => ({ ...item.data(), id: item.id })))
      ),
    []
  );

  return (
    <main className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-3 ">
      {/* main section */}
      <section className="col-span-2  lg:col-span-2 flex flex-col  w-full  sm:max-w-md sm:mx-auto">
        {/* avatars */}
        <div className="flex mx-4 items-center space-x-2 justify-start p-4 border-2 overflow-x-scroll">
          {[...Array(12).keys()].map((item) => (
            <div
              key={item}
              className="overflow-hidden flex-shrink-0 relative h-12 w-12 transition-all duration-300 ease-in-out flex justify-center items-center  rounded-full border-2 hover:scale-125 border-black  cursor-pointer"
            >
              <Image
                src={`/${item + 1}.jpg`}
                layout="fill"
                alt="profile picture"
                objectFit="fill"
                priority
              />
            </div>
          ))}
        </div>

        {/* feed */}
        <div className="w-full">
          {post.map(({ id, caption, image, username, uid ,profilepicture ,post_time }) => {
            return (
              <Post
                key={id}
                id={id}
                caption={caption}
                uid={uid}
                image={image}
                profilepicture = {profilepicture}
                username={username}
                post_time ={post_time}
              />
            );
          })}
        </div>
      </section>

      {/* suggestions */}
      <aside className="hidden lg:grid mt-12"> working on suggestions </aside>
    </main>
  );
};

export default Feed;
