'use client';

import Link from 'next/link';
import Image from '~/components/Services/Image';
import { useTopTags, useTopUsers } from '~/libs/hooks';
import { cn } from '~/libs/tools';
import Markdown from '../Services/Markdown';
import ChildAlerts from '../Services/ChildAlerts';
import { useWindowWidth } from '@react-hook/window-size';

const AsideRight = () => {
  const windowWidth = useWindowWidth();

  const { data: tagsData, isLoading: tagsLoading } = useTopTags(
    {
      limit: 10,
      offset: 0,
    },
    { disabled: windowWidth < 990 }
  );

  const { data: usersData, isLoading: usersLoading } = useTopUsers(
    {
      limit: 5,
      offset: 0,
    },
    { disabled: windowWidth < 990 }
  );

  return (
    <>
      <aside className="hide-scroll sticky top-0 flex max-h-dvh min-w-[20rem] max-w-min flex-col gap-3 overflow-y-auto max-[1220px]:min-w-[17rem] max-[990px]:hidden">
        {(tagsLoading || usersLoading) && <ChildAlerts loading />}
        <div className={cn('flex flex-col rounded-xl border bg-white py-3', tagsLoading && 'hidden')}>
          <h1 className="border-b px-6 pb-3 text-lg font-bold">Yang ramai di bahas ✨</h1>
          {tagsData?.data?.map((x: any, i: any) => (
            <Link href={'/'} className={cn(`group relative flex cursor-pointer items-center gap-3 px-6 py-3.5 font-medium`)}>
              <div className="flex flex-col text-[15px]">
                <h1 className="font-bold group-hover:text-primary-500">#{x?.name}</h1>
                <p className="text-sm">{x?._count?.posts} postingan</p>
              </div>
            </Link>
          ))}
        </div>
        <div className={cn('flex flex-col gap-1 rounded-xl border bg-white', usersLoading && 'hidden')}>
          <h1 className="border-b px-5 py-3 text-lg font-bold">Disarankan</h1>
          {usersData?.data?.map((x: any, i: any) => (
            <Link href={`/@${x?.username}`} className="group flex gap-3 p-5 py-3.5">
              <Image className="size-10 rounded-full border group-hover:rounded-lg" src={x?.picture} />
              <div className="flex flex-col text-[15px]">
                <h1 className="font-bold group-hover:text-primary-500">{x?.name}</h1>
                <Markdown className="line-clamp-2 text-sm" text={x?.bio || `@${x?.username}`} />
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
};

export default AsideRight;
