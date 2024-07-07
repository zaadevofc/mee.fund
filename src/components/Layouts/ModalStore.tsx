'use client';

import { signIn } from 'next-auth/react';
import { Dialog } from 'primereact/dialog';
import { useContext } from 'react';
import { SystemContext } from '~/app/providers';
import Image from '../Services/Image';
import { LuX } from 'react-icons/lu';

const ModalStore = () => {
  const { showAuthModal, setAuthModal } = useContext(SystemContext);

  const LIST_METHOD = [
    { icon: '/assets/defaults/icons/google.png', method: 'google' },
    { icon: '/assets/defaults/icons/github.png', method: 'github' },
    { icon: '/assets/defaults/icons/discord.png', method: 'discord' },
  ];

  return (
    <>
      <Dialog
        draggable={false}
        resizable={false}
        closable={false}
        visible={showAuthModal}
        className="dialog"
        onHide={() => showAuthModal && setAuthModal!(false)}
      >
        <div className="relative flex flex-col gap-3 py-3 text-center text-lg">
          <button onClick={() => setAuthModal!(false)} className="absolute -top-0 z-[999999] !px-1 -right-6">
            <LuX className='flex-shrink-0 text-xl' />
          </button>
          <h1 className="mb-3 font-bold">Masuk untuk melanjutkan.</h1>
          {LIST_METHOD.map((x, i) => (
            <button
              onClick={e => {
                e.preventDefault();
                signIn(x.method);
              }}
              className="flex items-center gap-4 justify-center w-full"
            >
              <Image className="w-4" src={x.icon} alt={x.method} />
              <h1 className="capitalize">Masuk dengan Akun {x.method}</h1>
            </button>
          ))}
        </div>
      </Dialog>
    </>
  );
};

export default ModalStore;
