'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LuBarChart2,
  LuBell,
  LuFastForward,
  LuHelpCircle,
  LuHome,
  LuLaptop,
  LuPlusCircle,
  LuSearch,
  LuSettings2,
  LuShieldCheck,
  LuTrophy,
} from 'react-icons/lu';
import Image from '~/components/Services/Image';
import { cn } from '~/libs/tools';
import Markdown from '../Services/Markdown';
import { POST_CATEGORY } from '~/consts';

const DEFAULT_SIDE = [
  { icon: LuHome, label: 'Beranda', href: '/' },
  { icon: LuTrophy, label: 'Populer', href: '/populer' },
  { icon: LuBarChart2, label: 'Trending', href: '/trending' },
  { icon: LuSearch, label: 'Explore', href: '/explore' },
  { icon: LuBell, label: 'Aktifitas', href: '/activity' },
  { icon: LuSettings2, label: 'Settings', href: '/settings' },
];

const MORE_SIDE = [
  // { icon: LuFastForward, label: 'About', href: '/~/about' },
  // { icon: LuLaptop, label: 'Author', href: '/~/author' },
  // { icon: LuHelpCircle, label: 'Help', href: '/~/help' },
  { icon: LuShieldCheck, label: 'Privasi', href: '/~/privacy' },
];

const AsideLeft = () => {
  const path = usePathname();
  const { data: user }: any = useSession();

  return (
    <>
      <aside className="hide-scroll sticky top-0 flex max-h-dvh min-w-[18rem] max-w-min flex-col gap-3 overflow-y-auto max-[1220px]:min-w-[16rem] max-[1168px]:min-w-min max-[590px]:hidden">
        <div className="flex gap-4 rounded-xl border bg-white p-5 py-3.5 max-[1168px]:!p-3.5">
          <Image className="size-10 w-fit rounded-full" src={user?.picture} />
          <div className="flex flex-col text-[15px] max-[1168px]:hidden">
            <h1 className="line-clamp-1 font-bold">{user?.name ?? 'MeeFund'}</h1>
            <Markdown className="line-clamp-2 text-sm">{user ? (user?.bio || 'Tidak ada bio') : 'Login untuk mengakses'}</Markdown>
          </div>
        </div>
        <div className="flex flex-col rounded-xl border bg-white">
          <div
            className={cn(
              `group flex cursor-pointer items-center gap-3 px-6 py-3.5 font-medium active:scale-[.95]`,
              'hover:text-primary-500 [&_svg]:hover:stroke-primary-500'
            )}
          >
            <LuPlusCircle className="flex-shrink-0 text-xl text-secondary-400" />
            <h1 className="text-[15px] max-[1168px]:hidden">Buat Postingan</h1>
          </div>
        </div>
        <div className="flex flex-col rounded-xl border bg-white">
          {DEFAULT_SIDE.map((x, i) => (
            <Link
              href={x.href}
              className={cn(
                `group relative flex cursor-pointer items-center gap-3 px-6 py-3.5 font-medium`,
                path == x.href && 'font-semibold text-primary-500 [&_svg]:stroke-primary-500',
                path != x.href && 'hover:text-primary-500 [&_svg]:hover:stroke-primary-500'
              )}
            >
              <div
                className={cn(
                  'absolute inset-y-0 left-0 my-auto h-1/2 w-1 rounded-full',
                  path == x.href && 'bg-primary-500',
                  path != x.href && 'group-hover:bg-primary-500'
                )}
              />
              <x.icon className="flex-shrink-0 text-xl text-secondary-400" />
              <h1 className="text-[15px] max-[1168px]:hidden">{x.label}</h1>
            </Link>
          ))}
        </div>
        <div className="flex flex-col rounded-xl border bg-white">
          {POST_CATEGORY.slice(1).map((x, i) => (
            <Link
              href={x.href}
              className={cn(
                `group relative flex cursor-pointer items-center gap-3 px-6 py-3.5 font-medium`,
                path == x.href && 'font-semibold text-primary-500 [&_svg]:stroke-primary-500',
                path != x.href && 'hover:text-primary-500 [&_svg]:hover:stroke-primary-500'
              )}
            >
              <div
                className={cn(
                  'absolute inset-y-0 left-0 my-auto h-1/2 w-1 rounded-full',
                  path == x.href && 'bg-primary-500',
                  path != x.href && 'group-hover:bg-primary-500'
                )}
              />
              <x.icon className="flex-shrink-0 text-xl text-secondary-400" />
              <h1 className="text-[15px] max-[1168px]:hidden">{x.label}</h1>
            </Link>
          ))}
        </div>
        <div className="flex flex-col rounded-xl border bg-white">
          {MORE_SIDE.map((x, i) => (
            <Link
              href={x.href}
              className={cn(
                `group relative flex cursor-pointer items-center gap-3 px-6 py-3.5 font-medium`,
                path == x.href && 'font-semibold text-primary-500 [&_svg]:stroke-primary-500',
                path != x.href && 'hover:text-primary-500 [&_svg]:hover:stroke-primary-500'
              )}
            >
              <div
                className={cn(
                  'absolute inset-y-0 left-0 my-auto h-1/2 w-1 rounded-full',
                  path == x.href && 'bg-primary-500',
                  path != x.href && 'group-hover:bg-primary-500'
                )}
              />
              <x.icon className="flex-shrink-0 text-xl text-secondary-400" />
              <h1 className="text-[15px] max-[1168px]:hidden">{x.label}</h1>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
};

export default AsideLeft;
