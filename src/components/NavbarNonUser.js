import React from "react";
import { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import Link from "next/link";

const NavbarNonUser = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    /// desktop Navbar
    <nav className="fixed flex h-[88px] w-full mx-0 top-0 left-0  bg-white shadow-md z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* main logo */}
          <Link
            href="/"
            className="main-logo w-auto h-auto flex flex-row space-x-2 "
          >
            <h1 className="flex text-4xl ">Merry</h1>{" "}
            <h1 className="text-[#C70039] flex text-4xl font-bold">Match</h1>
          </Link>
          <div className="flex items-center space-x-10 ">
            {/* desktop menu list */}
            <Link
              href="/#WhyMerryMatch"
              className="hidden md:flex  text-[#7D2262] font-bold "
            >
              Why Merry Match?
            </Link>
            <Link
              href="/#HowtoMerry"
              className="hidden md:flex text-[#7D2262] font-bold"
            >
              How to Merry
            </Link>
            <Link
              href="/login"
              className="hidden md:flex  bg-[#C70039] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-[#950028] transition-colors"
            >
              Login
            </Link>
            {/* mobile menu list */}
            <button className="md:hidden w-[40px] h-[40px] rounded-3xl bg-[#F6F7FC] flex justify-center items-center mr- ml-40 ">
              <svg
                width="30"
                height="30"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.80233 12.7267C3.03257 12.7682 3.26606 12.7889 3.5 12.7886C4.23936 12.7896 4.96392 12.5815 5.59008 12.1883C6.04158 12.2945 6.51408 12.3511 7 12.3511C10.1045 12.3511 12.6875 10.0352 12.6875 7.10107C12.6875 4.16691 10.1045 1.85107 7 1.85107C3.8955 1.85107 1.3125 4.16691 1.3125 7.10107C1.3125 8.50632 1.91042 9.77682 2.87233 10.7131C3.00767 10.8449 3.03392 10.9627 3.0205 11.0298C2.94841 11.3927 2.78498 11.7312 2.54567 12.0133C2.49598 12.072 2.46263 12.1427 2.44897 12.2183C2.4353 12.294 2.44181 12.3719 2.46783 12.4442C2.49385 12.5165 2.53847 12.5807 2.59719 12.6303C2.65592 12.6799 2.72667 12.7132 2.80233 12.7267ZM4.8125 6.44482C4.63845 6.44482 4.47153 6.51397 4.34846 6.63704C4.22539 6.76011 4.15625 6.92703 4.15625 7.10107C4.15625 7.27512 4.22539 7.44204 4.34846 7.56511C4.47153 7.68818 4.63845 7.75732 4.8125 7.75732C4.98655 7.75732 5.15347 7.68818 5.27654 7.56511C5.39961 7.44204 5.46875 7.27512 5.46875 7.10107C5.46875 6.92703 5.39961 6.76011 5.27654 6.63704C5.15347 6.51397 4.98655 6.44482 4.8125 6.44482ZM6.34375 7.10107C6.34375 6.92703 6.41289 6.76011 6.53596 6.63704C6.65903 6.51397 6.82595 6.44482 7 6.44482C7.17405 6.44482 7.34097 6.51397 7.46404 6.63704C7.58711 6.76011 7.65625 6.92703 7.65625 7.10107C7.65625 7.27512 7.58711 7.44204 7.46404 7.56511C7.34097 7.68818 7.17405 7.75732 7 7.75732C6.82595 7.75732 6.65903 7.68818 6.53596 7.56511C6.41289 7.44204 6.34375 7.27512 6.34375 7.10107ZM9.1875 6.44482C9.01345 6.44482 8.84653 6.51397 8.72346 6.63704C8.60039 6.76011 8.53125 6.92703 8.53125 7.10107C8.53125 7.27512 8.60039 7.44204 8.72346 7.56511C8.84653 7.68818 9.01345 7.75732 9.1875 7.75732C9.36155 7.75732 9.52847 7.68818 9.65154 7.56511C9.77461 7.44204 9.84375 7.27512 9.84375 7.10107C9.84375 6.92703 9.77461 6.76011 9.65154 6.63704C9.52847 6.51397 9.36155 6.44482 9.1875 6.44482Z"
                  fill="#FFB1C8"
                />
              </svg>
            </button>
            {/* hamburger bar */}
            <button
              onClick={toggleMenu}
              className="bg-white rounded mr-3 md:hidden  "
            >
              {isOpen ? (
                <IoIosMenu className="w-14 h-14 text-red-600 " />
              ) : (
                <IoIosMenu className="w-14 h-14 text-gray-600" />
              )}
            </button>
            {/* Sidebar menu */}
            <div
              className={`md:hidden fixed top-16 left-0 right-0 bottom-0 bg-white transform transition-all duration-300 ${
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0 pointer-events-none"
              } z-20`}
            >
              <nav className="md:hidden flex flex-col h-full overflow-y-auto justify-center items-center">
                {/* Menu items */}
                <div className="flex flex-col m-auto space-y-14">
                  <Link
                    href="/#WhyMerryMatch"
                    className=" md:hidden  text-4xl text-[#7D2262] font-bold "
                    onClick={() => setIsOpen(false)}
                  >
                    Why Merry Match?
                  </Link>
                  <Link
                    href="/#HowtoMerry"
                    className=" md:hidden text-4xl text-[#7D2262] font-bold text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    How to Merry
                  </Link>
                  <Link
                    href="/login"
                    className=" md:hidden text-4xl bg-[#C70039] text-center text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-[#950028] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4 mx-6"></div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarNonUser;
