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
import Loading from "./loading";

const queryClient = new QueryClient();
export const SystemContext = createContext({});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  splitbee.init();
  const { status } = useSession();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js");
    }
  }, []);

  if (status == "loading") return <Loading />;
  return (
    <>
      <NextTopLoader color="#0069FF" showSpinner={false} />
      <GoogleAnalytics gaId="G-W9E3FW4JKX" />
      <Analytics />
      <SpeedInsights />
      <SystemContext.Provider value={{}}>
        <QueryClientProvider client={queryClient}>
          <PhotoProvider>
            <main>{children}</main>
            <ModalsStore />
          </PhotoProvider>
        </QueryClientProvider>
      </SystemContext.Provider>
    </>
  );
};
