import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Meme`,
};

export default function RootLayout({ children }: any) {
  return <>{children}</>;
}
