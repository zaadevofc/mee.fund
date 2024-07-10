'use client';

import { signOut, useSession } from 'next-auth/react';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { LuBadgeCheck } from 'react-icons/lu';
import Container from '~/components/Layouts/Container';
import HeaderTabs from '~/components/Layouts/HeaderTabs';
import RenderPosts from '~/components/Renders/RenderPosts';
import ChildAlerts from '~/components/Services/ChildAlerts';
import Image from '~/components/Services/Image';
import Markdown from '~/components/Services/Markdown';
import { useUsers } from '~/libs/hooks';

const tabs = [
  { label: 'Postingan', value: '' },
  { label: 'Disukai', value: 'likes' },
  { label: 'Disimpan', value: 'bookmarks' },
  { label: 'Reposts', value: 'reposts' },
]

const UserDetailPage = ({ user_id }: any) => {
  if (!user_id.startsWith('@')) return notFound();

  const [isType, setType] = useState<any>('');
  const [isFollow, setFollow] = useState(false);

  const { data: user }: any = useSession();
  const username = user_id.substring(1);

  const { data: usersData, isLoading: usersLoading } = useUsers({ username, request_id: user?.id || '' });

  const profile = usersData?.data;
  const isSelf = user?.username == username;
  const hasFollow = profile?.followers?.length > 0;

  return (
    <>
      <Container
        showHeaderButton
        headerButtonLabel={`Profile ${user?.username == username ? '(Anda)' : ''}`}
        showAlertBefore={usersLoading || usersData?.error}
        setAlertLoading={usersLoading}
        setAlertLabel={usersData?.cause}
        hideChild={usersLoading || usersData?.error}
      >
        <div className={`mb-3 flex w-full flex-col gap-4`}>
          <div className="relative h-28 min-[460px]:h-36 w-full">
            <div className="absolute bottom-0 left-0 z-10 h-full w-full bg-[linear-gradient(360deg,transparent,rgba(0,0,0,.7))] min-[460px]:rounded-xl" />
            <Image src="/assets/defaults/thumbnails/red-neon-wallpaper.jpg" className="h-full w-full object-cover object-center min-[460px]:rounded-xl" />
          </div>
          <div className="z-10 -mt-10 ml-5 flex items-center gap-4">
            <Image
              className="size-20 min-[460px]:size-24 rounded-full border-4 !border-white"
              src={profile?.picture.replace('=s96-c', '=s500-c') ?? '/assets/defaults/thumbnails/empty-picture.webp'}
              alt=""
            />
            <div className="mt-6">
              <div className="flex items-center gap-0.5 text-2xl">
                <strong>{profile?.name}</strong>
                <LuBadgeCheck className={`${profile?.is_verified && '!block'} hidden fill-green-400 stroke-white text-lg`} />
              </div>
              <p className="text-sm text-gray-500">@{profile?.username}</p>
            </div>
          </div>
          <div className="max-[460px]:p-3 min-[460px]:my-3">
            <Markdown className={`leading-[21px]`} text={!!profile?.bio ? profile?.bio : '_bio akan ditampilkan disini_'} />
          </div>
          <div className="zflex hidden items-center gap-1.5 max-[460px]:px-3">
            {Array.from({ length: 5 }).map(x => (
              <div className="tooltip cursor-pointer" data-tip="hello">
                <div className="w-7 overflow-hidden rounded-full border">
                  <Image width={50} height={50} className="rounded-full object-cover" src="/assets/badges/cute-shiba.avif" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-gray-500 max-[460px]:px-3">
            <Markdown
              className={`text-[15px]`}
              text={`**${profile?._count.followers}** pengikut  •  **${profile?._count.following}** mengikuti  •  **${profile?._count.posts}** postingan`}
            />
          </div>
          <div className="flex w-full items-center gap-3 max-[460px]:p-3">
            {isSelf ? (
              <>
                <div className="w-full">
                  <button className="w-full bg-secondary-500 text-white">Edit Profile</button>
                </div>
                <div onClick={() => user && signOut()} className="w-full">
                  <button className="w-full border-primary-500">Logout</button>
                </div>
              </>
            ) : (
              <>
                <div onClick={() => user && setFollow(x => !x)} className="w-full">
                  <button className={`w-full bg-primary-500 text-white`}>{hasFollow ? 'Mengikuti' : 'Ikuti'}</button>
                </div>
                <div className="w-full">
                  <button className="w-full">Bagikan</button>
                </div>
              </>
            )}
          </div>
        </div>
        <HeaderTabs tabs={tabs} onTabsClick={setType} />
        <RenderPosts username={username} type={isType} />
      </Container>
    </>
  );
};

export default UserDetailPage;
