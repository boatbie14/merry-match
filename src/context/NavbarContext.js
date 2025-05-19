import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAlertDesktopMenuOpen, setisAlertDesktopMenuOpen] = useState(false);
  const [isAlertMobileMenuOpen, setIsAlertMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const alertMenuRef = useRef(null);

  const toggleAlertDesktopMenu = () => {
    setisAlertDesktopMenuOpen(!isAlertDesktopMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (
        alertMenuRef.current &&
        !alertMenuRef.current.contains(event.target)
      ) {
        setisAlertDesktopMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
