import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Explore`,
};

export default function RootLayout({ children }: any) {
  return <>{children}</>;
}
