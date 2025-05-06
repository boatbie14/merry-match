import "@/styles/globals.css";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <div className={nunito.className}>
      <Component {...pageProps} />
    </div>
  );
}
