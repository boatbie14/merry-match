import NavbarUser from "../components/NavbarUser";
import NavbarNonUser from "../components/NavbarNonUser";
import { useAuth } from "../context/AuthContext";
import { use, useEffect } from "react";

const NavbarMain = () => {
  const { userInfo, isLoggedIn } = useAuth();
  const isAuthenticated = userInfo !== null || isLoggedIn;
  // const { isLoggedIn } = useAuth();

  return (
    <div className="navbarmain">
      {isAuthenticated ? <NavbarUser /> : <NavbarNonUser />}
    </div>
  );
};
export default NavbarMain;

