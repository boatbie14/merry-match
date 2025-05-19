import { FaHeart } from "react-icons/fa";

import Image from "next/image";






export const DesktopAlertMenuItems = () => {
  return (
    <div className=" desktop-alert-menu-items flex flex-col space-y-5 px-4 py-3">
      <div className="flex flex-row space-x-2 relative">
        <Image
          src=""
          alt="Alert-noti"
          width={32}
          height={32}
          className=" w-[32px] h-[32px] rounded-full object-cover  "
        />
        <div className="heart-icon absolute top-[20px] left-[23px] ">
          <FaHeart size="10" color="#FF1659" />
        </div>
        <span className="text-start text-xs">
          &lsquo;Khal Drogo&rsquo; Just Merry you! Click here to see profile
        </span>
      </div>
    </div>
  );
};


export const MobileAlertMenuItems = () => {
  return (
    <div className="flex flex-col ">
      <div className="profile-menu-items space-y-10 px-10 mt-10 mb-10 text-3xl text-[#646D89] ">
        <div className=" desktop-alert-menu-items flex flex-col space-y-5 px-4 py-3">
          <div className="flex flex-row space-x-10 relative">
            <Image
              src="https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/8976/production/_94709153_kurt_getty.jpg"
              alt=""
              width={50}
              height={50}
              className=" w-[50px] h-[50px] rounded-full object-cover  "
            />
            <div className="heart-icon absolute top-[20px] left-[23px] ">
              <FaHeart size="10" color="#FF1659" />
            </div>
            <span className="text-start text-2xl">
              ‘Khal Drogo’ Just Merry you! <br /> Click here to see profile
            </span>
          </div>
          <div className="flex flex-row space-x-10 relative">
            <Image
              src="https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/8976/production/_94709153_kurt_getty.jpg"
              alt=""
              width={50}
              height={50}
              className=" w-[50px] h-[50px] rounded-full object-cover  "
            />
            <div className="heart-icon absolute top-[20px] left-[23px] ">
              <FaHeart size="10" color="#FF1659" />
            </div>
            <span className="text-start text-2xl">
              ‘khal Drogo’ Just Merry you! <br /> Click here to see profile
            </span>
          </div>
          <div className="flex flex-row space-x-10 relative">
            <img
              src="https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/8976/production/_94709153_kurt_getty.jpg"
              alt=""
              className=" w-[50px] h-[50px] rounded-full object-cover  "
            />
            <div className="heart-icon absolute top-[20px] left-[23px] ">
              <FaHeart size="10" color="#FF1659" />
            </div>
            <span className="text-start text-2xl">
              ‘Khal Drogo’ Just Merry you! <br /> Click here to see profile
            </span>
          </div>
          <div className="flex flex-row space-x-10 relative">
            <img
              src="https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/8976/production/_94709153_kurt_getty.jpg"
              alt=""
              className=" w-[50px] h-[50px] rounded-full object-cover "
            />
            <span className="text-start text-2xl">
              ‘Khal Drogo’ Just Merry you! <br /> Click here to see profile
            </span>
          </div>
          <div className="flex flex-row space-x-10 relative">
            <img
              src="https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/8976/production/_94709153_kurt_getty.jpg"
              alt=""
              className=" w-[50px] h-[50px] rounded-full object-cover "
            />
            <span className="text-start text-2xl">
              ‘Khal Drogo’ Just Merry you! <br /> Click here to see profile
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
