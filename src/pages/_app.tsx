import Aside from "@/components/aside";
import Header from "@/components/header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Lato } from "next/font/google";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${lato.className} bg-[#F7F7F7] flex`}>
      <Aside />
      <Header />

      <div className="pt-[108px] pl-[340px] pr-5 w-full min-h-screen overflow-y-auto">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
