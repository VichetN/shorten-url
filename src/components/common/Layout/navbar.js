"use client";

import { openMenuSideBarAtom } from "@/recoils";
import { useSetRecoilState } from "recoil";
import { BiMenuAltLeft } from "react-icons/bi";

function Navbar() {
  const setOpenSideBar = useSetRecoilState(openMenuSideBarAtom);
  return (
    <div className="w-full p-4 block lg:hidden">
      <button
        className="bg-gray-500 text-white rounded-sm p-2"
        onClick={() => setOpenSideBar(true)}
      >
        <BiMenuAltLeft size={40} />
      </button>
    </div>
  );
}

export default Navbar;
