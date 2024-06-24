"use client"

import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";

const SessionWrapper = ({ children }: any) => {
  return (
    <SessionProvider>
      <Providers>{children}</Providers>
    </SessionProvider>
  );
};

export default SessionWrapper;
