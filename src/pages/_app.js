import { useRouter } from "next/router";
import "@/styles/globals.css";
import "@/styles/base.css";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import NavbarMain from "@/components/NavbarMain";
import Footer from "@/components/Footer";
import { MerryLikeProvider } from "@/context/MerryLikeContext";
import { MerryLimitProvider } from "@/context/MerryLimitContext";
import { NavbarProvider } from "@/context/NavbarContext";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/styles/theme";
import { LottieProvider } from "@/context/LottieContext";
import LottieContainer from "@/components/LottieContainer";
import { NotificationContextProvider } from "@/context/NotificationContext";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;

  const noFooterRoutes = ["/login", "/register", "/matching", "/chat", "/admin", "/admin/createPackage"];
  const noNavbarRoutes = ["/admin", "/admin/createPackage"];

  const hideFooter = noFooterRoutes.includes(pathname);
  const hideNavbar = noNavbarRoutes.includes(pathname);
  const isAdminPage = pathname.startsWith("/admin");

  // Single Layout definition
  const Layout = (
    <div className={`${nunito.className} min-h-screen flex flex-col`}>
      {!hideNavbar && <NavbarMain />}
      <ThemeProvider theme={theme}>
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
      {!hideFooter && <Footer />}
    </div>
  );

  return (
    <AuthProvider>
      <NavbarProvider>
        <NotificationContextProvider>
          {isAdminPage ? (
            // Admin pages: no Merry/Lottie wrappers
            Layout
          ) : (
            // Public pages: wrap with Merry contexts + Lottie
            <MerryLimitProvider>
              <MerryLikeProvider>
                <LottieProvider>
                  {Layout}
                  <LottieContainer />
                </LottieProvider>
              </MerryLikeProvider>
            </MerryLimitProvider>
          )}
        </NotificationContextProvider>
      </NavbarProvider>
    </AuthProvider>
  );
}
