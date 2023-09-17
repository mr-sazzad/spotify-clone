"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logout");
  };
  return (
    <div
      className={twMerge(
        `h-fit 
         bg-gradient-to-b from-emerald-800
         p-6
        `,
        className
      )}
    >
      <div
        className="
            w-full
            md-4
            flex
            items-center
            justify-between
        "
      >
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="
                rounded-full
                bg-black
                flex
                justify-center
                items-center
                hover:opacity-75
                transition
            "
          >
            <RxCaretLeft size={35} className="text-white" />
          </button>
          {/* -------- */}
          <button
            onClick={() => router.forward()}
            className="
                rounded-full
                bg-black
                flex
                justify-center
                items-center
                hover:opacity-75
                transition
            "
          >
            <RxCaretRight size={35} className="text-white" />
          </button>
        </div>
        <div
          className="
            flex 
            md:hidden 
            gap-x-2
            items-center
          "
        >
          <button
            className="
                rounded-full
                p-2 
                bg-white
                flex 
                items-center
                justify-center
                hover:opacity-75
                transition
            "
          >
            <HiHome className="text-black" size={20} />
          </button>
          {/* ---- */}
          <button
            className="
                rounded-full
                p-2
                bg-white
                flex
                items-center 
                justify-center
                hover:opacity-75
                transition
          "
          >
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div className=""></div>
      </div>
    </div>
  );
};

export default Header;
