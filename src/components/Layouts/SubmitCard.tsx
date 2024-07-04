'use client';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';
import { LuBadgeCheck } from 'react-icons/lu';
import { SystemContext } from '~/app/providers';
import { CONTEXT_DATAType } from '~/libs/hooks';
import Image from '../Services/Image';

const SubmitCard = (props: CONTEXT_DATAType['initSubmitType']) => {
  const { data: user }: any = useSession();
  const { setInitSubmitType } = useContext(SystemContext);

  return (
    <>
      <label
        htmlFor="make_post_modal"
        onClick={() => setInitSubmitType!(props)}
        className="flex cursor-pointer flex-col rounded-lg border p-3.5 active:scale-[.97]"
      >
        <div className="relative flex items-start gap-3">
          <Image src={user?.picture} className="size-9 rounded-full" />
          <div className="flex w-full flex-col">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                <span className="font-bold">{user?.name ?? 'MeeFund'}</span>
                <LuBadgeCheck className={`${!user?.is_verified && 'hidden'} flex-shrink-0 fill-primary text-lg text-white`} />
              </div>
            </div>
            <h1 className="text-shade text-sm">Klik untuk membuat {props?.type == 'posts' ? 'postingan.' : 'komentar.'}</h1>
          </div>
        </div>
      </label>
    </>
  );
};

export default SubmitCard;
