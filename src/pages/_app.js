import { useRouter } from "next/router";
import "@/styles/globals.css";
import "@/styles/base.css";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import NavbarMain from "@/components/NavbarMain";
import Footer from "@/components/Footer";
import { MerryLikeProvider } from "../context/MerryLikeContext";
import { MerryLimitProvider } from "@/context/MerryLimitContext";
import { NavbarProvider } from "@/context/NavbarContext";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/styles/theme";
import { LottieProvider } from "@/context/LottieContext";
import LottieContainer from "@/components/LottieContainer";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // รายชื่อหน้าที่ "ไม่ต้องการ" แสดง Footer
  const noFooterRoutes = ["/login", "/register", "/matching", "/admin", "/chat"];
  const hideFooter = noFooterRoutes.includes(router.pathname);

  // รายชื่อหน้าที่ "ไม่ต้องการ" แสดง Navbar
  const noNavbarRoutes = ["/admin"];
  const hideNavbar = noNavbarRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      <NavbarProvider>
        <div className={`${nunito.className} min-h-screen flex flex-col`}>
          {!hideNavbar && <NavbarMain />}
          <ThemeProvider theme={theme}>
            <LottieProvider>
              <MerryLimitProvider>
                <MerryLikeProvider>
                  <main className="flex-grow">
                    <Component {...pageProps} />
                  </main>
                  <LottieContainer />
                </MerryLikeProvider>
              </MerryLimitProvider>
            </LottieProvider>
          </ThemeProvider>
          {!hideFooter && <Footer />}
        </div>
      </NavbarProvider>
    </AuthProvider>
  );
}
