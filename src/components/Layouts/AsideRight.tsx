'use client';

import { useWindowWidth } from '@react-hook/window-size';
import Link from 'next/link';
import { useContext } from 'react';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { LuBadgeCheck } from 'react-icons/lu';
import { SystemContext } from '~/app/providers';
import { dayjs } from '~/libs/tools';
import Image from '../Services/Image';
import Markdown from '../Services/Markdown';
import ChildLoading from '../Services/ChildLoading';

const AsideRight = () => {
  const windowWidth = useWindowWidth();
  const { FetchTrendingTags, FetchUserSuggestions } = useContext(SystemContext);

  const payload = { limit: 10, offset: 0 };
  const fetchTrendingTags: any = FetchTrendingTags(payload, windowWidth < 860 ? 'off' : 'on');
  const fetchUserSuggestions: any = FetchUserSuggestions({ ...payload, limit: 5 }, windowWidth < 860 ? 'off' : 'on');

  const tags = fetchTrendingTags?.data?.data;
  const users = fetchUserSuggestions?.data?.data;

  return (
    <>
      <aside className="hide-scroll sticky top-16 pt-2 hidden max-h-[calc(100vh-4rem)] max-w-full flex-col gap-3 overflow-auto [@media_(min-width:860px)]:flex">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col rounded-lg border bg-white pt-4">
            <h1 className="px-4 text-lg font-bold">Yang ramai di bahas</h1>
            {fetchTrendingTags.isLoading && <ChildLoading />}
            <div className={`${fetchTrendingTags.isLoading && 'hidden'} my-2 flex flex-col`}>
              {tags?.map((x: any, i: any) => (
                <Link key={i} href={'/tags/loremkolor'} className="flex px-4 py-3 hover:bg-base-200">
                  <div className="flex flex-col">
                    {/* <small className="opacity-50">Trending di SMA</small> */}
                    <h1 className="text-primarys font-semibold">#{x?.name}</h1>
                    <p className="text-gray-500">{x?._count?.posts} postingan</p>
                  </div>
                  <div className="btn btn-ghost btn-xs ml-auto">
                    <IoEllipsisHorizontal />
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
                <Link href={`/@${x?.username}`} className="flex w-full gap-3 px-4 py-3 hover:bg-base-200">
                  <Image
                    className="size-9 h-fit flex-shrink-0 rounded-full border"
                    src={x?.picture ?? '/assets/defaults/thumbnails/empty-picture.webp'}
                    width={100}
                    height={100}
                    alt={`@${x?.username} profile picture`}
                  />
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-0.5">
                      <strong>{x?.name}</strong>
                      <LuBadgeCheck className={`${x?.is_verified && '!block'} hidden fill-green-400 stroke-white text-lg`} />
                    </div>
                    <Markdown className={`line-clamp-2 text-sm leading-tight opacity-60`} text={x?.bio || '@' + x?.username} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-white">
            <h1 className="break-words bg-[url('/svg/noises.svg')] p-4 text-xl font-black uppercase leading-tight -tracking-wide text-primary">
              Komunitas <span className="textmark-rainbow">kreatif</span> yang penuh inovasi
            </h1>
          </div>
          <div className="flex flex-col rounded-lg border bg-white">
            <h1 className="break-words bg-[url('/svg/noises.svg')] p-4 text-xl font-black uppercase leading-tight -tracking-wide text-primary">BAGIKAN MEEFUND KE TEMAN TEMAN MU!</h1>
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
