'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
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
import { SystemContext } from '~/app/providers';
import Brands from '../Services/Brands';
import Image from '../Services/Image';
import { BlockUI } from 'primereact/blockui';
import { cn } from '~/libs/tools';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Sidebar } from 'primereact/sidebar';

const Navbar = () => {
  const { data: user }: any = useSession();
  const { setInitSubmitType, setShowAsideLeft, setAuthModal } = useContext(SystemContext);

  const path = usePathname();
  const router = useRouter();

  const DEFAULT_SIDE = [
    { icon: LuHome, label: 'Beranda', href: '/' },
    { icon: LuTrophy, label: 'Populer', href: '/populer' },
    { icon: LuBarChart2, label: 'Trending', href: '/trending' },
    { icon: LuSearch, label: 'Explore', href: '/explore' },
    { icon: LuBell, label: 'Aktifitas', href: '/activity' },
    { icon: LuSettings2, label: 'Settings', href: '/settings' },
  ];

  return (
    <>
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b bg-white p-3 px-5">
        <Brands />
        <div className="flex items-center gap-4">
          <button onClick={() => setAuthModal!(true)} className={cn('rounded-lg bg-primary-500 text-white', user && 'hidden')}>
            Masuk
          </button>
          <Image className={cn('size-7 rounded-lg', !user && 'hidden')} src={user?.picture} />
        </div>
      </nav>
      <nav className="fixed bottom-0 z-50 w-full bg-white min-[590px]:hidden">
        <div className="flex w-full items-center justify-between border-t p-2 px-5">
          {DEFAULT_SIDE.slice(0, -1).map(x => (
            <Link
              key={x.label}
              href={x.href}
              className={cn(
                'group relative flex flex-col items-center gap-1',
                path == x.href && 'font-semibold text-primary-500 [&_svg]:stroke-primary-500',
                path != x.href && 'hover:text-primary-500 [&_svg]:hover:stroke-primary-500'
              )}
            >
              <div
                className={cn(
                  'absolute inset-x-0 -top-2.5 mx-auto h-1 w-full rounded-full',
                  path == x.href && 'bg-primary-500',
                  path != x.href && 'group-hover:bg-primary-500'
                )}
              />
              <x.icon className={cn('text-xl')} />
              <h1 className="text-[10px]">{x.label}</h1>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
