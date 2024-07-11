'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { LuBarChart2, LuHome, LuPlusCircle, LuSearch, LuTrophy, LuUser2 } from 'react-icons/lu';
import { SystemContext } from '~/app/providers';
import { cn } from '~/libs/tools';
import Brands from '../Services/Brands';

const Navbar = () => {
  const { data: user }: any = useSession();
  const { setAuthModal, setSubmitModal } = useContext(SystemContext);

  const path = usePathname();

  const DEFAULT_SIDE = [
    { icon: LuHome, label: 'Beranda', href: '/' },
    { icon: LuTrophy, label: 'Populer', href: '/populer' },
    { icon: LuBarChart2, label: 'Trending', href: '/trending' },
    { icon: LuSearch, label: 'Explore', href: '/explore' },
    { icon: LuUser2, label: 'Profile', href: `/@${user?.username}` },
  ];

  return (
    <>
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b bg-white p-3 px-5">
        <Brands />
        <div className="flex items-center gap-4">
          <button onClick={() => setAuthModal!(true)} className={cn('rounded-lg bg-primary-500 text-white', user && 'hidden')}>
            Masuk
          </button>
          <LuPlusCircle onClick={() => setSubmitModal!({ open: true, type: 'posts' })} className="flex-shrink-0 text-2xl text-secondary-400" />
        </div>
      </nav>
      <nav className="fixed bottom-0 z-50 w-full bg-white min-[590px]:hidden">
        <div className="flex w-full items-center justify-between border-t p-2 px-5">
          {DEFAULT_SIDE.slice(0, user ? 5 : 4).map(x => (
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
