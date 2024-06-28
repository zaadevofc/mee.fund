"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import splitbee from "@splitbee/web";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useSession } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { createContext, useEffect } from "react";
import { PhotoProvider } from "react-photo-view";
import ModalsStore from "~/components/ModalsStore";
import { CONTEXT_DATA } from "~/libs/hooks";
import Loading from "./loading";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();
export const SystemContext = createContext(CONTEXT_DATA);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  splitbee.init();
  const { status } = useSession();

  if (status == "loading") return <Loading />;
  return (
    <>
      <NextTopLoader color="#0069FF" showSpinner={false} />
      <GoogleAnalytics gaId="G-W9E3FW4JKX" />
      <Analytics />
      <SpeedInsights />
      <SystemContext.Provider value={CONTEXT_DATA}>
        <QueryClientProvider client={queryClient}>
          <PhotoProvider>
            <main>{children}</main>
            <Toaster
              position="top-center"
              containerClassName="flex mx-auto w-full max-w-screen-xl"
              toastOptions={{
                className: "border border-neutral-content !py-1",
                error: { className: "border border-red-500 !py-1" },
                success: { className: "border border-green-500 !py-1" },
                loading: { className: "border border-blue-500 !py-1" },
                duration: 3000,
              }}
            />
            <ModalsStore />
          </PhotoProvider>
        </QueryClientProvider>
      </SystemContext.Provider>
    </>
  );
};
