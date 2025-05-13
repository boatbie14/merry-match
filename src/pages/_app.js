import "@/styles/globals.css";
import "@/styles/base.css";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { MerryLikeProvider } from "../../context/MerryLikeContext";
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
    <div className={nunito.className}>
      <MerryLikeProvider>
        <Component {...pageProps} />
      </MerryLikeProvider>
    </div>
    </AuthProvider>
  );
}
