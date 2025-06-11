//// this is 10/6
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";


const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
    const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAlertDesktopMenuOpen, setisAlertDesktopMenuOpen] = useState(false);
  const [isAlertMobileMenuOpen, setIsAlertMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const alertMenuRef = useRef(null);

   useEffect(() => {
    setIsUserMenuOpen(false);
    setIsOpen(false);
    setisAlertDesktopMenuOpen(false);
    setIsAlertMobileMenuOpen(false);
  }, [router.asPath]);

  const toggleAlertDesktopMenu = () => {
    setisAlertDesktopMenuOpen(!isAlertDesktopMenuOpen);
    if(isUserMenuOpen) {
      setIsUserMenuOpen(false);
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isAlertDesktopMenuOpen) {
      setisAlertDesktopMenuOpen(false);
    }
  };

  const toggleAlertMobileMenu = () => {
    setIsAlertMobileMenuOpen(!isAlertMobileMenuOpen);
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const toggleHamburgerBarMenu = () => {
    setIsOpen(!isOpen);
    if (isAlertMobileMenuOpen) {
      setIsAlertMobileMenuOpen(false);
    }
  };


  return (
    <NavbarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isUserMenuOpen,
        setIsUserMenuOpen,
        isAlertDesktopMenuOpen,
        setisAlertDesktopMenuOpen,
        isAlertMobileMenuOpen,
        setIsAlertMobileMenuOpen,
        userMenuRef,
        alertMenuRef,
        toggleAlertDesktopMenu,
        toggleUserMenu,
        toggleAlertMobileMenu,
        toggleHamburgerBarMenu,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => useContext(NavbarContext);
