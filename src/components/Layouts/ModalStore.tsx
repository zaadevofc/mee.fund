'use client';

import { signIn } from 'next-auth/react';
import { useContext } from 'react';
import { SystemContext } from '~/app/providers';
import Image from '../Services/Image';
import { Dialog, DialogContent } from '../ui/dialog';

const ModalStore = () => {
  const { showAuthModal, setAuthModal } = useContext(SystemContext);

  const LIST_METHOD = [
    { icon: '/assets/defaults/icons/google.png', method: 'google' },
    { icon: '/assets/defaults/icons/github.png', method: 'github' },
    { icon: '/assets/defaults/icons/discord.png', method: 'discord' },
  ];

  return (
    <>
      <Dialog open={showAuthModal} onOpenChange={x => setAuthModal!(x)}>
        <DialogContent className='rounded-lg'>
          <div className="relative flex flex-col gap-3 py-3 text-center text-lg">
            <h1 className="mb-3 font-bold">Masuk untuk melanjutkan.</h1>
            {LIST_METHOD.map((x, i) => (
              <button
                onClick={e => {
                  e.preventDefault();
                  signIn(x.method);
                }}
                className="flex w-full items-center justify-center gap-4"
              >
                <Image className="w-4" src={x.icon} alt={x.method} />
                <h1 className="capitalize">Masuk dengan Akun {x.method}</h1>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalStore;
