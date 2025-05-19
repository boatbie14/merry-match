import React from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/context/AuthContext";
import { useNavbar } from "@/context/NavbarContext";
import { IoIosMenu } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { BsFillBoxFill } from "react-icons/bs";
import { GoAlertFill } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";
import Link from "next/link";


export const DesktopAlertMenuItems = () => {
  return (
    <div className=" desktop-alert-menu-items flex flex-col space-y-5 px-4 py-3">
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

export const DesktopUserMenuItems = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/logout");
  };

  return (
    <div className="flex flex-col w-[198px] h-[258px] ">
      <button className="bg-gradient-to-r from-[#742138] to-[#A878BF] p-2.5 rounded-4xl mx-3 my-2 text-white flex items-center justify-center cursor-pointer">
        <span className="text-xs font-bold">✨ More limit Merry!</span>
      </button>
      <div className="profile-menu-items mt-2 space-y-6 px-5 text-xs text-[#646D89]  ">
        <div className="profile-button-mobile-menu-items ">
          <button className="flex flex-row space-x-5 cursor-pointer ">
            <FaUser color="pink" />
            <span>Profile</span>
          </button>
        </div>
        <div className="merrylist-button-mobile-menu-items">
          <Link
            href="merry/merrylist"
            className="flex flex-row space-x-5 cursor-pointer"
          >
            <FaHeart color="pink" />
            <span>Merry list</span>
          </Link>
        </div>
        <div className="merry-membership-button-mobile-menu-items">
          <button className="flex flex-row space-x-5 cursor-pointer">
            <BsFillBoxFill color="pink" />
            <span>Merry Membership</span>
          </button>
        </div>
        <div className="compliant-button-mobile-menu-items">
          <button className="flex flex-row space-x-5 cursor-pointer">
            <GoAlertFill color="pink" />
            <span>Compliant</span>
          </button>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="text-xs flex flex-row space-x-5  text-[#646D89] border-t border-[#E4E6ED] px-5 py-3 mt-5 cursor-pointer "
      >
        <IoLogOutOutline />
        <span>Log out</span>
      </button>
    </div>
  );
};

export const MobileMenuItems = () => {
  const router = useRouter();

  const { setIsOpen } = useNavbar();

  const handleLogout = () => {
    router.push("/logout-test");
  };

  return (
    <div className="flex flex-col ">
      <div className="bg-gradient-to-r from-[#742138] to-[#A878BF] p-4 rounded-4xl mx-4 my-6 text-white flex items-center justify-center">
        <span className="text-3xl font-bold">✨ More limit Merry!</span>
      </div>
      <div className="profile-menu-items space-y-10 px-10 mt-10 mb-10 text-3xl text-[#646D89] ">
        <div className="profile-button-mobile-menu-items ">
          <button className="flex flex-row space-x-10 ">
            <FaUser color="pink" />
            <span>Profile</span>
          </button>
        </div>
        <div className="merrylist-button-mobile-menu-items">
          <Link
            href="merry/merrylist"
            className="flex flex-row space-x-10"
            onClick={() => setIsOpen(false)}
          >
            <FaHeart color="pink" />
            <span>Merry list</span>
          </Link>
        </div>
        <div className="merry-membership-button-mobile-menu-items">
          <button className="flex flex-row space-x-10">
            <BsFillBoxFill color="pink" />
            <span>Merry Membership</span>
          </button>
        </div>
        <div className="compliant-button-mobile-menu-items">
          <button className="flex flex-row space-x-10">
            <GoAlertFill color="pink" />
            <span>Compliant</span>
          </button>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className=" md:hidden flex flex-row space-x-10 text-4xl text-[#646D89] border-t border-[#E4E6ED]-300 px-10 py-6 mt-5  "
      >
        <IoLogOutOutline />
        <span>Log out</span>
      </button>
    </div>
  );
};

export const MobileAlertMenuItems = () => {
  return (
    <div className="flex flex-col ">
      <div className="profile-menu-items space-y-10 px-10 mt-10 mb-10 text-3xl text-[#646D89] ">
        <div className=" desktop-alert-menu-items flex flex-col space-y-5 px-4 py-3">
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

const NavbarUser = () => {
  const { userInfo } = useAuth();
  const {
    isOpen,
    setIsOpen,
    isUserMenuOpen,
    toggleUserMenu,
    isAlertDesktopMenuOpen,
    toggleAlertDesktopMenu,
    isAlertMobileMenuOpen,
    toggleAlertMobileMenu,
    toggleHamburgerBarMenu,
    userMenuRef,
    alertMenuRef,
  } = useNavbar();

  return (
    <nav className="fixed flex h-[88px] w-full mx-0 top-0 left-0  bg-white shadow-2xl/30 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="main-logo w-auto h-auto flex flex-row space-x-2 "
            onClick={() => setIsOpen(false)}
          >
            <h1 className="flex text-4xl ">Merry</h1>{" "}
            <h1 className="text-[#C70039] flex text-4xl font-bold">Match</h1>
          </Link>
          <div className="flex items-center space-x-10 ">
            <Link
              href="/matching"
              className="hidden md:flex  text-[#7D2262] font-bold "
            >
              Start Matching!
            </Link>
            <a href="#" className="hidden md:flex text-[#7D2262] font-bold">
              Merry Membership
            </a>
            <button className="talk-button md:hidden w-[40px] h-[40px] rounded-3xl bg-[#F6F7FC] flex justify-center items-center ">
              <svg
                width="30"
                height="30"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.80233 12.7267C3.03257 12.7682 3.26606 12.7889 3.5 12.7886C4.23936 12.7896 4.96392 12.5815 5.59008 12.1883C6.04158 12.2945 6.51408 12.3511 7 12.3511C10.1045 12.3511 12.6875 10.0352 12.6875 7.10107C12.6875 4.16691 10.1045 1.85107 7 1.85107C3.8955 1.85107 1.3125 4.16691 1.3125 7.10107C1.3125 8.50632 1.91042 9.77682 2.87233 10.7131C3.00767 10.8449 3.03392 10.9627 3.0205 11.0298C2.94841 11.3927 2.78498 11.7312 2.54567 12.0133C2.49598 12.072 2.46263 12.1427 2.44897 12.2183C2.4353 12.294 2.44181 12.3719 2.46783 12.4442C2.49385 12.5165 2.53847 12.5807 2.59719 12.6303C2.65592 12.6799 2.72667 12.7132 2.80233 12.7267ZM4.8125 6.44482C4.63845 6.44482 4.47153 6.51397 4.34846 6.63704C4.22539 6.76011 4.15625 6.92703 4.15625 7.10107C4.15625 7.27512 4.22539 7.44204 4.34846 7.56511C4.47153 7.68818 4.63845 7.75732 4.8125 7.75732C4.98655 7.75732 5.15347 7.68818 5.27654 7.56511C5.39961 7.44204 5.46875 7.27512 5.46875 7.10107C5.46875 6.92703 5.39961 6.76011 5.27654 6.63704C5.15347 6.51397 4.98655 6.44482 4.8125 6.44482ZM6.34375 7.10107C6.34375 6.92703 6.41289 6.76011 6.53596 6.63704C6.65903 6.51397 6.82595 6.44482 7 6.44482C7.17405 6.44482 7.34097 6.51397 7.46404 6.63704C7.58711 6.76011 7.65625 6.92703 7.65625 7.10107C7.65625 7.27512 7.58711 7.44204 7.46404 7.56511C7.34097 7.68818 7.17405 7.75732 7 7.75732C6.82595 7.75732 6.65903 7.68818 6.53596 7.56511C6.41289 7.44204 6.34375 7.27512 6.34375 7.10107ZM9.1875 6.44482C9.01345 6.44482 8.84653 6.51397 8.72346 6.63704C8.60039 6.76011 8.53125 6.92703 8.53125 7.10107C8.53125 7.27512 8.60039 7.44204 8.72346 7.56511C8.84653 7.68818 9.01345 7.75732 9.1875 7.75732C9.36155 7.75732 9.52847 7.68818 9.65154 7.56511C9.77461 7.44204 9.84375 7.27512 9.84375 7.10107C9.84375 6.92703 9.77461 6.76011 9.65154 6.63704C9.52847 6.51397 9.36155 6.44482 9.1875 6.44482Z"
                  fill="#FFB1C8"
                />
              </svg>
            </button>
            <button
              onClick={toggleAlertMobileMenu}
              className="alert-button-mobile w-[40px] h-[40px] md:hidden rounded-3xl bg-[#F6F7FC] flex justify-center items-center md:mr-6 cursor-pointer "
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.24973 9C5.24973 7.20979 5.96089 5.4929 7.22676 4.22703C8.49263 2.96116 10.2095 2.25 11.9997 2.25C13.7899 2.25 15.5068 2.96116 16.7727 4.22703C18.0386 5.4929 18.7497 7.20979 18.7497 9V9.75C18.7497 11.873 19.5497 13.807 20.8677 15.27C20.9498 15.361 21.0084 15.4707 21.0383 15.5896C21.0682 15.7084 21.0685 15.8328 21.0391 15.9518C21.0098 16.0708 20.9518 16.1808 20.8702 16.2722C20.7885 16.3636 20.6857 16.4335 20.5707 16.476C19.0267 17.046 17.4107 17.466 15.7397 17.719C15.7774 18.2331 15.7086 18.7495 15.5377 19.2359C15.3668 19.7222 15.0974 20.1681 14.7464 20.5457C14.3955 20.9233 13.9704 21.2245 13.4978 21.4304C13.0252 21.6364 12.5152 21.7427 11.9997 21.7427C11.4842 21.7427 10.9742 21.6364 10.5016 21.4304C10.029 21.2245 9.60399 20.9233 9.25302 20.5457C8.90205 20.1681 8.6327 19.7222 8.4618 19.2359C8.29089 18.7495 8.22211 18.2331 8.25973 17.719C6.61138 17.4692 4.99272 17.0524 3.42873 16.475C3.31386 16.4326 3.21113 16.3627 3.12949 16.2715C3.04786 16.1802 2.98981 16.0703 2.96041 15.9515C2.93101 15.8326 2.93117 15.7084 2.96086 15.5896C2.99055 15.4708 3.04887 15.3611 3.13073 15.27C4.49754 13.7567 5.25281 11.7892 5.24973 9.75V9ZM9.75173 17.9C9.73894 18.2032 9.78761 18.5058 9.89481 18.7897C10.002 19.0736 10.1655 19.3329 10.3756 19.5519C10.5856 19.771 10.8377 19.9453 11.1168 20.0644C11.3959 20.1835 11.6963 20.2448 11.9997 20.2448C12.3032 20.2448 12.6035 20.1835 12.8826 20.0644C13.1618 19.9453 13.4139 19.771 13.6239 19.5519C13.8339 19.3329 13.9974 19.0736 14.1046 18.7897C14.2119 18.5058 14.2605 18.2032 14.2477 17.9C12.7521 18.0347 11.2474 18.0347 9.75173 17.9Z"
                  fill="#FFB1C8"
                />
              </svg>
            </button>
            <div className="relative">
              <button
                onClick={toggleAlertDesktopMenu}
                className="alert-button-desktop hidden w-[40px] h-[40px] rounded-3xl bg-[#F6F7FC] md:flex justify-center items-center md:mr-6 cursor-pointer "
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.24973 9C5.24973 7.20979 5.96089 5.4929 7.22676 4.22703C8.49263 2.96116 10.2095 2.25 11.9997 2.25C13.7899 2.25 15.5068 2.96116 16.7727 4.22703C18.0386 5.4929 18.7497 7.20979 18.7497 9V9.75C18.7497 11.873 19.5497 13.807 20.8677 15.27C20.9498 15.361 21.0084 15.4707 21.0383 15.5896C21.0682 15.7084 21.0685 15.8328 21.0391 15.9518C21.0098 16.0708 20.9518 16.1808 20.8702 16.2722C20.7885 16.3636 20.6857 16.4335 20.5707 16.476C19.0267 17.046 17.4107 17.466 15.7397 17.719C15.7774 18.2331 15.7086 18.7495 15.5377 19.2359C15.3668 19.7222 15.0974 20.1681 14.7464 20.5457C14.3955 20.9233 13.9704 21.2245 13.4978 21.4304C13.0252 21.6364 12.5152 21.7427 11.9997 21.7427C11.4842 21.7427 10.9742 21.6364 10.5016 21.4304C10.029 21.2245 9.60399 20.9233 9.25302 20.5457C8.90205 20.1681 8.6327 19.7222 8.4618 19.2359C8.29089 18.7495 8.22211 18.2331 8.25973 17.719C6.61138 17.4692 4.99272 17.0524 3.42873 16.475C3.31386 16.4326 3.21113 16.3627 3.12949 16.2715C3.04786 16.1802 2.98981 16.0703 2.96041 15.9515C2.93101 15.8326 2.93117 15.7084 2.96086 15.5896C2.99055 15.4708 3.04887 15.3611 3.13073 15.27C4.49754 13.7567 5.25281 11.7892 5.24973 9.75V9ZM9.75173 17.9C9.73894 18.2032 9.78761 18.5058 9.89481 18.7897C10.002 19.0736 10.1655 19.3329 10.3756 19.5519C10.5856 19.771 10.8377 19.9453 11.1168 20.0644C11.3959 20.1835 11.6963 20.2448 11.9997 20.2448C12.3032 20.2448 12.6035 20.1835 12.8826 20.0644C13.1618 19.9453 13.4139 19.771 13.6239 19.5519C13.8339 19.3329 13.9974 19.0736 14.1046 18.7897C14.2119 18.5058 14.2605 18.2032 14.2477 17.9C12.7521 18.0347 11.2474 18.0347 9.75173 17.9Z"
                    fill="#FFB1C8"
                  />
                </svg>
              </button>
              {isAlertDesktopMenuOpen && (
                <div
                  ref={alertMenuRef}
                  className="absolute overflow-auto  md:top-[45px] md:right-[-70px]   mt-2 w-[251px] h-[214px] bg-white  rounded-lg shadow-xl/50 "
                >
                  <DesktopAlertMenuItems />
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="profile-logo hidden md:flex justify-center items-center w-[48px] h-[48px] bg-[#C70039] text-white py-3 rounded-full font-bold shadow-lg  "
              >
                <img
                  src={
                    userInfo?.profile_image_url ||
                    "https://pbs.twimg.com/media/FKWwGZFVUAY2lKN?format=jpg&name=small"
                  }
                  alt="profile-logo-image"
                  className="w-[48px] h-[48px] rounded-full  object-cover "
                />
              </button>
              {isUserMenuOpen && (
                <div
                  ref={userMenuRef}
                  className="absolute  md:top-[45px] md:right-[-70px]   mt-2 w-[198px] h-[258px] bg-white  rounded-lg shadow-xl/50 "
                >
                  <DesktopUserMenuItems setIsOpen={setIsOpen} />
                </div>
              )}
            </div>
            <button
              onClick={toggleHamburgerBarMenu}
              className="bg-white rounded mr-3 md:hidden  "
            >
              {isOpen ? (
                <IoIosMenu className="w-14 h-14 text-red-600 " />
              ) : (
                <IoIosMenu className="w-14 h-14 text-gray-600" />
              )}
            </button>
            <div
              className={`md:hidden fixed top-20 left-0 right-0 bottom-0 bg-white transform transition-all duration-300 ${
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0 pointer-events-none"
              } z-20`}
            >
              <div className="mobile-menu items md:hidden flex flex-col h-full overflow-y-auto px-6 py-5 inset-shadow-sm/20 ">
                <MobileMenuItems />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`md:hidden fixed top-22 left-0 right-0 bottom-0 bg-white transform transition-all duration-300 ${
            isAlertMobileMenuOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 pointer-events-none"
          } z-20`}
        >
          <div className="mobile-menu items md:hidden flex flex-col h-full overflow-y-auto px-6 py-5 inset-shadow-sm/20 ">
            <MobileAlertMenuItems />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarUser;
