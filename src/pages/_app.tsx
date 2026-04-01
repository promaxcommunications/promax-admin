import { useLogin } from "@/api/auth";
import useUserStore from "@/store/user";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Lato } from "next/font/google";
import Head from "next/head";
import { useEffect } from "react";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export default function App({ Component, pageProps }: AppProps) {
  const { user } = useUserStore();
  const { autoLogin } = useLogin();

  useEffect(() => {
    if (user) return;

    autoLogin();
  }, [user]);

  return (
    <div className={`${lato.className} bg-[#F7F7F7] flex`}>
      <Head>
        <title>Promax Admin</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>

      <div className="w-full">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
