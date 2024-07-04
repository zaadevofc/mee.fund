'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import splitbee from '@splitbee/web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useSession } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';
import React, { createContext, useState } from 'react';
import { PhotoProvider } from 'react-photo-view';
import { CONTEXT_DATA } from '~/libs/hooks';
import Loading from './loading';

const queryClient = new QueryClient();
export const SystemContext = createContext(CONTEXT_DATA());

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [makePlaceholder, setMakePlaceholder] = useState<any>();
  const [initSubmitType, setInitSubmitType] = useState<any>();
  const [initTempPosts, setInitTempPosts] = useState<any>();
  const [initTempComments, setInitTempComments] = useState<any>();
  const [showAsideLeft, setShowAsideLeft] = useState(false);

  const { status } = useSession();
  splitbee.init();

  if (status == 'loading') return <Loading />;
  return (
    <>
      <NextTopLoader color="#0069FF" showSpinner={false} />
      <GoogleAnalytics gaId="G-W9E3FW4JKX" />
      <Analytics />
      <SpeedInsights />
      <SystemContext.Provider
        value={{
          ...CONTEXT_DATA({
            makePlaceholder,
            setMakePlaceholder,
            initTempPosts,
            setInitTempPosts,
            initSubmitType,
            setInitSubmitType,
            initTempComments,
            setInitTempComments,
            showAsideLeft,
            setShowAsideLeft,
          }),
        }}
      >
        <QueryClientProvider client={queryClient}>
          <PhotoProvider>
            <main>{children}</main>
          </PhotoProvider>
        </QueryClientProvider>
      </SystemContext.Provider>
    </>
  );
};
