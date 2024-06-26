import { Rubik } from "next/font/google";
import { METADATA } from "~/consts";
import SessionWrapper from "./session";
import "~/styles/globals.css";
import "react-photo-view/dist/react-photo-view.css";
import Script from "next/script";

export const metadata = METADATA;
const rubik = Rubik({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="winter">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/defaults/seo/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/defaults/seo/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/defaults/seo/favicon-16x16.png"
        />
        <link rel="manifest" href="/assets/defaults/seo/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/assets/defaults/seo/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="apple-mobile-web-app-title" content="MeeFund" />
        <meta name="application-name" content="MeeFund" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="google-adsense-account" content="ca-pub-6374133597923635" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6374133597923635"
          crossOrigin="anonymous"
        ></Script>
      </head>
      <body className={rubik.className}>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
