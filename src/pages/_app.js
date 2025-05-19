import "@/styles/globals.css";
import "@/styles/base.css";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import NavbarMain from "@/components/NavbarMain";
import Footer from "@/components/Footer";
import { MerryLikeProvider } from "../context/MerryLikeContext";
import { NavbarProvider } from "@/context/NavbarContext";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <NavbarProvider>
        <div className={nunito.className}>
          <NavbarMain />
          <MerryLikeProvider>
            <Component {...pageProps} />
          </MerryLikeProvider>
          <Footer />
        </div>
      </NavbarProvider>
    </AuthProvider>
  );
}
