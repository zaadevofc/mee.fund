'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LuBadgeCheck, LuBellDot, LuSettings2, LuUser2 } from 'react-icons/lu';
import { POST_CATEGORY } from '~/consts';
import Image from '../Services/Image';
import Markdown from '../Services/Markdown';

const AsideLeft = ({ className }: any) => {
  const { data: user }: any = useSession();
  const path = usePathname();
  const router = useRouter();

  const ADVANCE_SIDE = [
    { icon: LuUser2, label: 'Profile', href: '/@' + user?.username },
    { icon: LuBellDot, label: 'Aktifitas', href: '/activity' },
    { icon: LuSettings2, label: 'Settings', href: '/settings' },
  ];

  return (
    <>
      <aside className={className + " hide-scroll sticky top-0 flex max-h-[calc(100vh-4rem)] w-full min-w-[17rem] max-w-min flex-col gap-3 overflow-y-auto pb-20"}>
        <div className="flex flex-col gap-4">
          <label
            onClick={() => user && router.push(`/@${user?.username}`)}
            htmlFor={!user ? 'masuk_akun_modal' : ''}
            className={`flex w-full cursor-pointer items-start gap-3 rounded-lg border bg-white p-3 active:scale-[.96]`}
          >
            <div className="flex-shrink-0 overflow-hidden">
              <Image className="size-10 rounded-full border" src={user?.picture} width={100} height={100} alt={`@${user?.username} profile picture`} />
            </div>
            <div className="flex w-full flex-col">
              <div className="flex items-center gap-0.5">
                <strong className="line-clamp-1">{user?.name ?? 'MeeFund'}</strong>
                <LuBadgeCheck className={`${user?.is_verified && '!block'} hidden fill-green-400 stroke-white text-lg`} />
              </div>
              <span className="flex items-center gap-2 text-sm opacity-60">
                <Markdown className={`line-clamp-1 leading-tight`} text={!user ? 'Login ke akun MeeFund Ad laborum qui veniam enim.' : !!user?.bio ? user?.bio : '_Klik untuk tambah bio_'} />
              </span>
            </div>
          </label>
          <ul className="menu flex flex-col gap-3 !p-0 [&>li>details>summary]:border [&>li>details>ul]:mt-2 [&_li>details>ul>li]:!py-1 [&_summary]:sticky [&_summary]:top-0 [&_summary]:z-10 [&_summary]:bg-white">
            <li>
              <details open={POST_CATEGORY.some(x => x.href == path)}>
                <summary>
                  <h1 className="text-shade font-bold">EXPLORE</h1>
                </summary>
                <ul>
                  {POST_CATEGORY.map((x, i) => {
                    return (
                      <li>
                        <Link href={x.href} className={`${x.href == path && 'font-semibold !text-black [&_svg]:text-primary'} text-shade group flex items-center gap-3`}>
                          <x.icon className="stroke-[1.7] text-xl" />
                          <h1 className={`block`}>{x.label}</h1>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </details>
            </li>
            <li>
              <details open={ADVANCE_SIDE.some(x => x.href == path)}>
                <summary>
                  <h1 className="text-shade font-bold">ADVANCE</h1>
                </summary>
                <ul className="!gap-0">
                  {ADVANCE_SIDE.map((x, i) => {
                    return (
                      <li>
                        <Link href={x.href} className={`${x.href == path && 'font-semibold !text-black [&_svg]:text-primary'} text-shade group flex items-center gap-3`}>
                          <x.icon className="stroke-[1.7] text-xl" />
                          <h1 className={`block`}>{x.label}</h1>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default AsideLeft;
