'use client';

import { signOut, useSession } from 'next-auth/react';
import { notFound } from 'next/navigation';
import { useContext, useState } from 'react';
import { LuBadgeCheck } from 'react-icons/lu';
import { SystemContext } from '~/app/providers';
import Image from '~/components/Services/Image';
import Markdown from '~/components/Services/Markdown';
import TabOptions from '~/components/Layouts/HeaderTabs';
import Wrapper from '~/components/Layouts/Wrapper';
import dynamic from 'next/dynamic';

const RenderPosts = dynamic(() => import('~/components/Renders/RenderPosts'));

const UserDetailPage = ({ user_id }: any) => {
  if (!user_id.startsWith('@')) return notFound();

  const [isType, setType] = useState<any>('');
  const [isFollow, setFollow] = useState(false);

  const { FetchUserProfile } = useContext(SystemContext);
  const { data: user }: any = useSession();

  const username = user_id.substring(1);

  const fetchUserProfile: any = FetchUserProfile({ username, request_id: user?.id }, !user_id.startsWith('@') ? 'off' : 'on');

  const profile = fetchUserProfile.data?.data;
  const isSelf = user?.username == username;
  const hasFollow = profile?.followers?.length != 0;

  const tabs = [
    { label: 'Terbaru', value: '' },
    { label: 'Reposts', value: 'reposts' },
    isSelf && { label: 'Disukai', value: 'likes' },
    isSelf && { label: 'Disimpan', value: 'bookmarks' },
  ];

  return (
    <>
      <Wrapper loading={fetchUserProfile?.isLoading} childAlert={fetchUserProfile.data?.cause} hideChild={fetchUserProfile.data?.error}>
        <div className={`flex w-full flex-col gap-4`}>
          <div className="flex items-center gap-4">
            <div className="flex size-20 flex-shrink-0 items-center justify-center rounded-full border bg-gray-200">
              <Image
                className="size-20 rounded-full border"
                src={profile?.picture.replace('=s96-c', '=s500-c') ?? '/assets/defaults/thumbnails/empty-picture.webp'}
                alt=""
              />
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-2xl">
                <strong>{profile?.name}</strong>
                <LuBadgeCheck className={`${profile?.is_verified && '!block'} hidden fill-green-400 stroke-white text-lg`} />
              </div>
              <p className="text-sm text-gray-500">@{profile?.username}</p>
            </div>
          </div>
          <div className="my-3">
            <Markdown className={`leading-[21px]`} text={!!profile?.bio ? profile?.bio : '_bio akan ditampilkan disini_'} />
          </div>
          <div className="sflex hidden items-center gap-1.5">
            {Array.from({ length: 5 }).map(x => (
              <div className="tooltip cursor-pointer" data-tip="hello">
                <div className="w-7 overflow-hidden rounded-full border">
                  <Image width={50} height={50} className="rounded-full object-cover" src="/assets/badges/cute-shiba.avif" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-gray-500">
            <Markdown
              className={`leading-[21px]`}
              text={`**${profile?._count.followers}** pengikut  •  **${profile?._count.following}** mengikuti  •  **${profile?._count.posts}** postingan`}
            />
          </div>
          <div className="flex w-full items-center gap-3">
            {isSelf ? (
              <>
                <div className="w-full">
                  <h1 className="btn btn-outline btn-primary btn-sm w-full">Edit Profile</h1>
                </div>
                <div onClick={() => user && signOut()} className="w-full">
                  <h1 className="btn btn-outline btn-error btn-sm w-full">Logout</h1>
                </div>
              </>
            ) : (
              <>
                <div onClick={() => user && setFollow(x => !x)} className="w-full">
                  <h1 className={`${hasFollow && '!btn-ghost !border !border-primary'} btn btn-primary btn-sm w-full`}>{hasFollow ? 'Mengikuti' : 'Ikuti'}</h1>
                </div>
                <div className="w-full">
                  <h1 className="btn btn-outline btn-sm w-full">Bagikan</h1>
                </div>
              </>
            )}
          </div>
        </div>
        <TabOptions tabs={tabs} onTabsClick={setType} />
        <RenderPosts username={username} />
      </Wrapper>
    </>
  );
};

export default UserDetailPage;
