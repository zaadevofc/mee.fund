'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import splitbee from '@splitbee/web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useSession } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';
import { PrimeReactProvider } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';
import React, { createContext, useCallback, useState } from 'react';
import { CONTEXT_DATA } from '~/libs/hooks';
import Loading from './loading';

const queryClient = new QueryClient();
export const SystemContext = createContext(CONTEXT_DATA());

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const [showAuthModal, setAuthModal] = useState(false);
  const [showSubmitModal, setSubmitModal] = useState<any>({});
  const [isSubmitFinish, setSubmitFinish] = useState(false);

  const setActiveVideo = useCallback((id: string | null) => {
    setActiveVideoId(id);
  }, []);

  const { status } = useSession();
  splitbee.init();

  if (status == 'loading') return <Loading />;
  return (
    <>
      <NextTopLoader color="#C4495F" showSpinner={false} />
      <GoogleAnalytics gaId="G-W9E3FW4JKX" />
      <Analytics />
      <SpeedInsights />
      <SystemContext.Provider
        value={{
          ...CONTEXT_DATA({
            showSubmitModal,
            setSubmitModal,
            showAuthModal,
            setAuthModal,
            activeVideoId,
            setActiveVideo,
            isSubmitFinish,
            setSubmitFinish,
          }),
        }}
      >
        <QueryClientProvider client={queryClient}>
          <PrimeReactProvider value={{ unstyled: true, pt: Tailwind, ripple: true }}>
            <main>{children}</main>
          </PrimeReactProvider>
        </QueryClientProvider>
      </SystemContext.Provider>
    </>
  );
};
