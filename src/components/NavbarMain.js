import NavbarUser from "../components/NavbarUser";
import NavbarNonUser from "../components/NavbarNonUser";

const NavbarMain = () => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = true;

  return <>{isAuthenticated ? <NavbarUser /> : <NavbarNonUser />}</>;
};
export default NavbarMain;
