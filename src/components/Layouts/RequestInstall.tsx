'use client';

import { useEffect, useState } from 'react';
import { usePWAInstall } from 'react-use-pwa-install';
import useLocalStorage from 'use-local-storage';
import { cn } from '~/libs/utils';
import Markdown from '../Services/Markdown';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';

const RequestInstall = () => {
  const [storeRequest, setStoreRequest] = useLocalStorage('requestInstall', '-1');
  const [isShowModal, setShowModal] = useState(false);
  const requestInstall = usePWAInstall();

  useEffect(() => {
    if (storeRequest == '-1') {
      setStoreRequest('1');
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowModal(false);
    } else {
      if (storeRequest == '1') {
        setShowModal(true);
      }
    }
  }, []);

  if (!requestInstall) return;

  return (
    <>
      <Dialog open={isShowModal} onOpenChange={setShowModal}>
        <DialogContent className="rounded-lg">
          <div className="flex flex-col gap-3">
            <h1 className="text-lg font-semibold">Install Aplikasi MeeFund</h1>
            <Markdown
              text={
                'Menginstal Aplikasi **MeeFund** akan meningkatkan pengalaman scrolling mu!\n\nAplikasi ini merupakan **PWA (Progessive Web Application)** yang di sediakan secara resmi.\n\nJika terjadi masalah dan hal lainnya, silahkan hubungi **zaadevofc@‎gmail.com**'
              }
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Button
              onClick={() => {
                setStoreRequest('0');
                setShowModal(false);
              }}
              variant={'outline'}
              size={'sm'}
              className={cn(storeRequest == '0' && 'hidden')}
            >
              Jangan Tampilkan Lagi
            </Button>
            <Button variant={'outline'} className="ml-auto !bg-primary-500 !text-white" onClick={requestInstall!} size={'sm'}>
              Install
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className={cn('fixed bottom-4 right-4 z-50 max-[590px]:bottom-16', storeRequest !== '0' && 'hidden')}>
        <Button variant={'outline'} className="!bg-primary-500 !text-white" size={'sm'} onClick={() => setShowModal(true)}>
          Install MeeFund
        </Button>
      </div>
    </>
  );
};

export default RequestInstall;
