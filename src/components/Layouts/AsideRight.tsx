'use client';

import { useWindowWidth } from '@react-hook/window-size';
import Link from 'next/link';
import { useContext } from 'react';
import { LuBadgeCheck } from 'react-icons/lu';
import { SystemContext } from '~/app/providers';
import { dayjs } from '~/libs/tools';
import ChildLoading from '../Services/ChildLoading';
import Image from '../Services/Image';
import Markdown from '../Services/Markdown';

const AsideRight = ({ className }: any) => {
  const windowWidth = useWindowWidth();
  const { FetchTrendingTags, FetchUserSuggestions } = useContext(SystemContext);

  const payload = { limit: 10, offset: 0 };
  const fetchTrendingTags: any = FetchTrendingTags(payload, windowWidth < 970 ? 'off' : 'on');
  const fetchUserSuggestions: any = FetchUserSuggestions({ ...payload, limit: 5 }, windowWidth < 970 ? 'off' : 'on');

  const tags = fetchTrendingTags?.data?.data;
  const users = fetchUserSuggestions?.data?.data;

  return (
    <>
      <aside className={className + " hide-scroll sticky top-0 flex max-h-[calc(100vh-4rem)] min-w-[20rem] max-w-min flex-col gap-3 overflow-auto pb-20"}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col rounded-lg border bg-white pt-4">
            <h1 className="px-4 text-lg font-bold">Yang ramai di bahas</h1>
            {fetchTrendingTags.isLoading && <ChildLoading />}
            <div className={`${fetchTrendingTags.isLoading && 'hidden'} my-2 flex flex-col`}>
              {tags?.map((x: any, i: any) => (
                <Link key={i} href={'/tags/loremkolor'} className="flex px-4 py-3">
                  <div className="flex flex-col">
                    <h1 className="text-primarys font-semibold">#{x?.name}</h1>
                    <p className="text-gray-500">{x?._count?.posts} postingan</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-white pt-4">
            <h1 className="textmark-rainbow px-4 text-lg font-bold">Disarankan</h1>
            {fetchUserSuggestions.isLoading && <ChildLoading />}
            <div className={`${fetchTrendingTags.isLoading && 'hidden'} my-2 flex flex-col`}>
              {users?.map((x: any, i: any) => (
                <Link href={`/@${x?.username}`} className="flex w-full items-center gap-3 px-4 py-3">
                  <Image src={x?.picture} className="size-9 rounded-full" />
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-0.5">
                      <span className="font-bold">{x?.name}</span>
                      <LuBadgeCheck className={`${!x?.is_verified && 'hidden'} flex-shrink-0 fill-primary text-lg text-white`} />
                    </div>
                    <Markdown className={`line-clamp-2 text-sm leading-tight`} text={x?.bio || '@' + x?.username} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-white">
            <h1 className="break-words bg-[url('/svg/noises.svg')] p-4 max-[1035px]:text-base text-xl font-black uppercase leading-tight -tracking-wide text-primary">
              Komunitas <span className="textmark-rainbow">kreatif</span> yang penuh inovasi
            </h1>
          </div>
          <div className="flex flex-col rounded-lg border bg-white">
            <h1 className="break-words bg-[url('/svg/noises.svg')] p-4 max-[1035px]:text-base text-xl font-black uppercase leading-tight -tracking-wide text-primary">
              BAGIKAN MEEFUND KE TEMAN TEMAN MU!
            </h1>
          </div>
          <h1 className="mt-5 whitespace-nowrap text-[13px] opacity-60">
            &copy; {dayjs().format('YYYY')} MeeFund by{' '}
            <strong>
              <Link scroll={false} href={'https://instagram.com/zaadevofc'} target="_blank">
                zaadevofc
              </Link>
            </strong>
          </h1>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-light opacity-60 [&>_a:hover]:underline">
            <Link scroll={false} href={'/'} className="whitespace-nowrap">
              Terms of Service
            </Link>
            <Link scroll={false} href={'/'} className="whitespace-nowrap">
              Privacy Policy
            </Link>
            <Link scroll={false} href={'/'} className="whitespace-nowrap">
              Developers
            </Link>
            <Link scroll={false} href={'/'} className="whitespace-nowrap">
              About
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AsideRight;
