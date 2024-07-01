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
import ModalsStore from '~/components/Layouts/ModalStore';
import { CONTEXT_DATA } from '~/libs/hooks';
import Loading from './loading';
import Toaster from '~/components/Services/Toaster';

const queryClient = new QueryClient();
export const SystemContext = createContext(CONTEXT_DATA());

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const [reqRefecth, setReqRefecth] = useState<any>('');
  splitbee.init();

  if (status == 'loading') return <Loading />;
  return (
    <>
      <NextTopLoader color="#0069FF" showSpinner={false} />
      <GoogleAnalytics gaId="G-W9E3FW4JKX" />
      <Analytics />
      <SpeedInsights />
      <SystemContext.Provider value={{ ...CONTEXT_DATA({ reqRefecth, setReqRefecth }) }}>
        <QueryClientProvider client={queryClient}>
          <PhotoProvider>
            <main>{children}</main>
            <Toaster />
            <ModalsStore />
          </PhotoProvider>
        </QueryClientProvider>
      </SystemContext.Provider>
    </>
  );
};
