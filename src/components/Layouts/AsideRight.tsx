'use client';

import Link from 'next/link';
import Image from '~/components/Services/Image';
import { cn } from '~/libs/tools';

const AsideRight = () => {
  return (
    <>
      <aside className="hide-scroll sticky top-0 flex max-h-dvh min-w-[20rem] max-w-min flex-col gap-3 overflow-y-auto max-[1220px]:min-w-[17rem] max-[990px]:hidden">
        <div className="flex flex-col rounded-xl border bg-white py-3">
          <h1 className="border-b px-6 pb-3 text-lg font-bold">Yang ramai di bahas ✨</h1>
          {Array.from({ length: 5 }, (x, i) => (
            <Link href={'/'} className={cn(`group relative flex cursor-pointer items-center gap-3 px-6 py-3.5 font-medium`)}>
              <div className="flex flex-col text-[15px]">
                <h1 className="font-bold group-hover:text-primary-500">#medosbary</h1>
                <p className="text-sm">834k postingan</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-1 rounded-xl border bg-white">
          <h1 className="border-b px-5 py-3 text-lg font-bold">Disarankan</h1>
          {Array.from({ length: 5 }).map((_, i) => (
            <Link href={'/@zaadevofc'} className="group flex items-center gap-3 p-5 py-3.5">
              <Image className="size-10 rounded-full border group-hover:rounded-lg" src="https://avatars.githubusercontent.com/u/93970726?v=4" />
              <div className="flex flex-col text-[15px]">
                <h1 className="font-bold group-hover:text-primary-500">ZaaDev Official</h1>
                <p className="text-sm">Fullstack Developer</p>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
};

export default AsideRight;
