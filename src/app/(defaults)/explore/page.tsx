'use client';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LuBadgeCheck } from 'react-icons/lu';
import { useDebounce } from 'use-debounce';
import Container from '~/components/Layouts/Container';
import { Input } from '~/components/ui/input';
import { useSearch } from '~/libs/hooks';
import { updateParams } from '~/libs/tools';
import { cn } from '~/libs/utils';

const PostCard = dynamic(() => import('~/components/Services/PostCard'));
const ImageContainer = dynamic(() => import('~/components/Services/ImageContainer'));
const Markdown = dynamic(() => import('~/components/Services/Markdown'));
const Image = dynamic(() => import('~/components/Services/Image'));
const HeaderButton = dynamic(() => import('~/components/Layouts/HeaderButton'));
const HeaderTabs = dynamic(() => import('~/components/Layouts/HeaderTabs'));

const tabList = [
  { label: 'Postingan', value: 'posts' },
  { label: 'Pengguna', value: 'users' },
  { label: 'Tags', value: 'tags' },
  { label: 'Media', value: 'media' },
];

const ExplorePage = () => {
  const [isType, setType] = useState<any>('posts');
  const [isKeyword, setKeyword] = useState<any>('');

  const [keyword] = useDebounce(isKeyword.trim(), 1000);
  const { data: user }: any = useSession();
  const params = useSearchParams();
  const router = useRouter();

  let q = useSearchParams().get('q') || '';
  let tabs = useSearchParams().get('tabs');
  tabs = tabList.some(x => x.value == tabs) ? tabs : 'posts';

  useEffect(() => {
    return () => {
      setKeyword(q);
      setType(tabs);
    };
  }, []);

  const { data: searchData, isLoading: searchLoading } = useSearch(
    {
      limit: 5,
      offset: 0,
      keyword,
      type: isType,
      request_id: user?.id ?? '',
    },
    { disabled: keyword.length < 3 }
  );

  return (
    <>
      <Container
        showAlertAfter={keyword.length < 3 || searchData?.data?.length == 0 || searchLoading || searchData?.error}
        setAlertLoading={searchLoading}
        setAlertLabel={(keyword.length < 3 && 'Coba untuk mencari sesuatu') || (searchData?.data?.length == 0 && 'Tidak ditemukan apapun') || searchData?.cause}
      >
        <HeaderButton label="Pencarian" />
        <Input
          onChange={e => {
            setKeyword(e.target.value);
            router.push(`${updateParams(params, 'q', e.target.value)}`);
          }}
          defaultValue={isKeyword}
          type="text"
          placeholder="Cari postingan atau seseorang"
          className="!py-6 max-[460px]:rounded-none"
        />
        <HeaderTabs
          tabs={tabList}
          className="mb-2"
          value={tabs!}
          onTabsClick={x => {
            setType(x);
            router.push(`${updateParams(params, 'tabs', x)}`);
          }}
        />
        {isType == 'posts' && (
          <div className="flex flex-col gap-3 max-[460px]:divide-y">{searchData?.data?.map((x: any) => <PostCard type="posts" payload={x} />)}</div>
        )}

        {isType == 'users' && (
          <div className="flex flex-col gap-3 max-[460px]:divide-y">
            {searchData?.data?.map((x: any) => (
              <Link href={`/@${x.username}`} key={x.id} className="flex gap-3 rounded-xl p-3 min-[460px]:border">
                <Image src={x?.picture} className="size-10 rounded-lg" />
                <div className="flex flex-col text-[15px]">
                  <div className="flex">
                    <h1 className="font-bold">{x?.name}</h1>
                    {x?.is_verified && <LuBadgeCheck className={cn('fill-sky-500 stroke-white text-lg', x?.role == 'AUTHOR' && 'fill-purple-500')} />}
                  </div>
                  <Markdown className="text-shade-0 line-clamp-3 whitespace-normal" text={x?.bio || `@${x?.username}`} />
                </div>
              </Link>
            ))}
          </div>
        )}

        {isType == 'media' && (
          <div className="columns-3 gap-0 max-[460px]:p-2">
            {searchData?.data?.map((x: any) => (
              <>
                <Link href={`/post/${x?.post?.ids}`} key={x.url} className="flex gap-3 rounded-xl">
                  <ImageContainer videoAutoPlay={false} media={[{ src: x?.url, type: x?.mimetype }]} className="size-full rounded-lg" />
                </Link>
              </>
            ))}
          </div>
        )}
      </Container>
    </>
  );
};

export default ExplorePage;
