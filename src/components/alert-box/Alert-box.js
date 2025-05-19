import { FaHeart } from "react-icons/fa";







export const DesktopAlertMenuItems = () => {
  return (
    /// Waiting for the alert menu items to be added by Array.map
    <div className=" desktop-alert-menu-items flex flex-col space-y-5 px-4 py-3">
      {/* Array.map here */}
      <div className="flex flex-row space-x-2 relative">
        <img
          src=""
          alt="Alert-noti"
          className=" w-[32px] h-[32px] rounded-full object-cover  "
        />
        <div className="heart-icon absolute top-[20px] left-[23px] ">
          <FaHeart size="10" color="#FF1659" />
        </div>
        <span className="text-start text-xs">
          ‘Khal Drogo’ Just Merry you! Click here to see profile
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
          {/* Array.map here */}
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
        
        </div>
      </div>
    </div>
  );
};
