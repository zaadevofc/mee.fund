'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LuAlignLeft, LuAlignRight, LuBell, LuHome, LuPlus, LuSearch, LuUser2 } from 'react-icons/lu';
import Brands from '../Services/Brands';
import { useContext } from 'react';
import { SystemContext } from '~/app/providers';

const Navbar = () => {
  const { data: user }: any = useSession();
  const { setInitSubmitType, setShowAsideLeft } = useContext(SystemContext);

  const path = usePathname();
  const router = useRouter();

  const listNavbar = [
    { icon: LuSearch, href: '/search' },
    { icon: LuBell, href: '/activity' },
    { icon: LuPlus, href: '/' },
    { icon: LuUser2, href: '/@' + user?.username },
    { icon: LuAlignRight, href: 'sideleft' },
  ];

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 mx-auto flex w-full items-center border-b bg-white">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col justify-between px-6 py-3 max-[490px]:px-3">
          <div className="flex w-full items-center gap-10">
            <Brands />
            <div className={`${user && 'hidden'} ml-auto flex items-center gap-3`}>
              <label htmlFor="masuk_akun_modal" className="btn btn-sm">
                Masuk
              </label>
              <label htmlFor="buat_akun_modal" className="btn btn-primary btn-sm">
                Buat Akun
              </label>
            </div>

            <div className={`${!user && 'hidden'} ml-auto flex items-center gap-4 max-[705px]:hidden`}>
              {listNavbar.map((x, i) => (
                <label onClick={() => i == 0 && setInitSubmitType!({ type: 'posts' })} htmlFor={i > 0 ? '' : 'make_post_modal'}>
                  <div
                    onClick={() => i > 0 && router.push(x.href)}
                    className={`${path == x.href ? 'btn-primary' : 'hover:text-gray-700'} btn btn-circle btn-ghost flex-shrink-0 text-gray-500 hover:text-gray-700`}
                  >
                    <x.icon className="flex-shrink-0 text-[21px]" />
                  </div>
                </label>
              ))}
            </div>

            <div className="btm-nav btm-nav-md border-t min-[705px]:hidden">
              {listNavbar.map((x, i) => (
                <label onClick={() => i == 0 && setInitSubmitType!({ type: 'posts' })} htmlFor={i > 0 ? '' : 'make_post_modal'}>
                  <div
                    onClick={() => {
                      x.href.startsWith('/') && i > 0 && router.push(x.href);
                      x.href == 'sideleft' && setShowAsideLeft!((x: any) => !x);
                    }}
                    className={`${path == x.href ? 'btn-primary' : 'hover:text-gray-700'} btn btn-ghost flex-shrink-0 text-gray-500 hover:text-gray-700`}
                  >
                    <x.icon className="flex-shrink-0 text-[21px]" />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
