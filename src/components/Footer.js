import React from "react";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaTwitter } from "react-icons/fa";




const Footer = () => {
  return (
    <footer className=" flex h-[371px] w-full mx-0  bg-[#F6F7FC] shadow-md">
      <div className="container flex flex-col mx-auto px-6 py-4 items-center justify-center space-y-4">
        <div className="main-logo w-auto h-auto flex flex-row space-x-2 ">
          <h1 className="flex text-4xl ">Merry</h1>{" "}
          <h1 className="text-[#C70039] flex text-4xl font-bold">Match</h1>
        </div>
        <div className="w-full  h-20 border-[#E4E6ED] border-b-[1px] flex text-center items-start justify-center mt-3">
          <span>New generation of online dating website for everyone</span>
        </div>
        <span className="text-[#9AA1B9] mt-3">
          copyright ©2022 merrymatch.com All rights reserved
        </span>
        <div className="flex flex-row w-[176px] space-x-4 mt-3">
          <div className="w-[48px] h-[48px] rounded-full bg-[#A62D82] flex justify-center items-center">
            <FaFacebook className="w-[24px] h-[24px] " color="white" />
            </div>
          <div className="w-[48px] h-[48px] rounded-full bg-[#A62D82] flex justify-center items-center">
            <RiInstagramFill className="w-[24px] h-[24px]" color="white" />
          </div>
          <div className="w-[48px] h-[48px] rounded-full bg-[#A62D82] flex justify-center items-center">
            <FaTwitter className="w-[24px] h-[24px]" color="white" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
