import { GrInstagram } from "react-icons/gr";
import { AiOutlineHeart, AiOutlineCompass, AiOutlineSearch } from "react-icons/ai";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { BsPlusSquare } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useDispatch} from "react-redux";
import { clicked } from "../redux/modalSlice";

const Header = () => {
  const dispatch = useDispatch();

  const session = useSession();
  let img;

  session.data?.user ? (img = session.data?.user.image) : (img = "/vercel.svg");

  return (
    <header className="bg-white px-4 sticky top-0 z-50">
      <nav className="flex justify-between p-4 max-w-5xl mx-auto items-center">
        {/* left */}

        <div>
          <GrInstagram className="icon" />
        </div>

        {/* right */}
        <div className="flex justify-between space-x-2 items-center">
          <div className="flex mr-4 items-center border-2 rounded-lg px-2 py-1">
            <input type="text" className="outline-none " placeholder="Search..." />
            <AiOutlineSearch className="text-2xl" />
          </div>
          {session.status === "authenticated" && (
            <BsPlusSquare className="icon" onClick={() => dispatch(clicked())} />
          )}

          <div className=" space-x-2 hidden md:flex items-center">
            <HiOutlinePaperAirplane className="icon" />
            <AiOutlineCompass className="icon" />
            <AiOutlineHeart className="icon" />
          </div>

          <FiMenu className="icon md:hidden" />
          <div
            className="flex items-center cursor-pointer"
            onClick={session.status === "authenticated" ? signOut : signIn}
          >
            <Image
              className="rounded-full p-2 m-2"
              src={img}
              width={30}
              height={30}
              objectFit="cover"
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
