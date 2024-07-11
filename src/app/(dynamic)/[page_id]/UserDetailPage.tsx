'use client';

import { DialogClose } from '@radix-ui/react-dialog';
import { signOut, useSession } from 'next-auth/react';
import { notFound } from 'next/navigation';
import { InputTextarea } from 'primereact/inputtextarea';
import { useState } from 'react';
import { GoHeart, GoPeople, GoPerson } from 'react-icons/go';
import { LuBadgeCheck, LuCopy, LuFastForward, LuForward, LuHeart, LuPenSquare, LuSave, LuSaveAll, LuUser2, LuUsers2 } from 'react-icons/lu';
import { editUserProfileType } from '~/app/api/v1/users/users.service';
import Container from '~/components/Layouts/Container';
import HeaderTabs from '~/components/Layouts/HeaderTabs';
import RenderPosts from '~/components/Renders/RenderPosts';
import ChildAlerts from '~/components/Services/ChildAlerts';
import Image from '~/components/Services/Image';
import Markdown from '~/components/Services/Markdown';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Switch } from '~/components/ui/switch';
import { SEO } from '~/consts';
import { postJson, useUsers } from '~/libs/hooks';
import { exclude, signJWT } from '~/libs/tools';
import { cn } from '~/libs/utils';

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

  const [isPrivate, setPrivate] = useState(profile?.visibility == 'PRIVATE');

  const tabs = [
    { label: 'Postingan', value: '' },
    { label: 'Reposts', value: 'reposts' },
    { label: 'Disukai', value: 'likes' },
    { label: 'Disimpan', value: 'bookmarks' },
  ].slice(0, isSelf ? 4 : 2);

  const handleUpdateUser = async (e: any) => {
    e.preventDefault();
    if (!user) return;
    const form = new FormData(e.target);
    const data = exclude({ ...Object.fromEntries(form), visibility: isPrivate ? 'PRIVATE' : 'PUBLIC' }, ['picture', 'email', 'id']);
    const payload: editUserProfileType['opts'] = {
      where: { id: user?.id },
      data: data,
    };

    const token = await signJWT({ payload }, 180);
    const res = await postJson(`/api/v1/users/edit`, { token });
  };

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
        <div className={`mb-3 flex w-full flex-col gap-6 max-[460px]:p-3`}>
          <div className="mt-5 flex flex-row-reverse items-start justify-between gap-5">
            <Image
              className="size-20 flex-shrink-0 rounded-full border-4 !border-white min-[460px]:size-24"
              src={profile?.picture.replace('=s96-c', '=s500-c') ?? '/assets/defaults/thumbnails/empty-picture.webp'}
            />
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center text-xl min-[460px]:text-2xl">
                  <h1 className="font-bold">{profile?.name}</h1>
                  {profile?.is_verified && <LuBadgeCheck className="fill-sky-500 stroke-white text-xl" />}
                </div>
                <p className="text-gray-500">@{profile?.username}</p>
              </div>
              <div className={cn('pr-2', !profile?.bio && 'hidden')}>
                <Markdown
                  className={`text-[15px] leading-[21px]`}
                  text={profile?.bio}
                />
              </div>
              <div className={cn('mt-2 flex flex-wrap gap-1', profile?.role == 'BASIC' && 'hidden')}>
                <Badge className="flex gap-0.5 text-[10px]" variant={'outline'}>
                  <span className={cn(profile?.role == 'AUTHOR' && 'textmark-indonesia font-bold')}>{profile?.role}</span>
                  <span className="textmark-rainbow font-bold">MEEFUND</span>
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-shade flex w-full items-center gap-5 text-[15px]">
              <div className="flex gap-1">
                <GoPeople className="flex-shrink-0 text-xl" />
                <p>{profile?._count?.followers}</p>
              </div>
              <div className="flex gap-1">
                <GoPerson className="flex-shrink-0 text-xl" />
                <p>{profile?._count?.following}</p>
              </div>
              <div className="flex gap-1">
                <GoHeart className="flex-shrink-0 text-xl" />
                <p>{profile?._count?.post_likes}</p>
              </div>
            </div>
            <div className="flex w-full items-center gap-3">
              {isSelf ? (
                <>
                  <Dialog>
                    <DialogTrigger className="w-full border-none p-0">
                      <Button variant={'secondary'} className="w-full">
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-lg max-[460px]:h-dvh">
                      <form action={'javascript:void(0)'} onSubmit={handleUpdateUser} className="relative flex flex-col gap-7 pb-20">
                        <h1 className="text-lg font-semibold">Edit Profile</h1>
                        <div className="hide-scroll flex flex-col gap-6 overflow-y-scroll">
                          <div className="flex justify-between gap-4">
                            <Image src={profile?.picture} className={`size-16 rounded-lg`} />
                            <div className="flex w-full flex-col gap-1 text-[15px]">
                              <h1 className="font-semibold">Foto Profile</h1>
                              <Input name="picture" type="file" accept="image/*" placeholder={profile?.name} />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 text-[15px]">
                            <h1 className="font-semibold">Nama</h1>
                            <Input name="name" placeholder={profile?.name} defaultValue={profile?.name} />
                          </div>
                          <div className="flex flex-col gap-1 text-[15px]">
                            <h1 className="font-semibold">Username</h1>
                            <Input name="username" placeholder={profile?.username} defaultValue={profile?.username} />
                          </div>
                          <div className="flex flex-col gap-1 text-[15px]">
                            <h1 className="font-semibold">Bio</h1>
                            <div className="w-full rounded-lg border">
                              <InputTextarea
                                name="bio"
                                autoResize
                                className="!text-[15px] leading-[21px] w-full"
                                defaultValue={profile?.bio}
                                placeholder={'Buat bio yang menarik!'}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-5">
                            <div className="flex flex-col text-[15px]">
                              <h1 className="font-semibold">Akun Privat</h1>
                              <h1 className="text-shade text-sm">Orang lain tidak diizinkan melihat postingan dan aktifitas mu.</h1>
                            </div>
                            <Switch onCheckedChange={setPrivate} checked={profile?.visibility == 'PRIVATE'} className="flex-shrink-0" />
                          </div>
                        </div>
                        <div className={cn('absolute bottom-0 flex w-full items-center rounded-lg border bg-secondary-50 p-2')}>
                          <Button type="submit" size={'sm'} variant={'destructive'} className="ml-auto gap-x-2">
                            <LuSave className="text-shade stroke-white text-lg" /> Simpan
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={() => signOut()} variant={'outline'} className="w-full !bg-primary-500 !text-white">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant={'outline'} className={cn('w-full', hasFollow ? 'border-primary-500' : '!bg-primary-500 !text-white')}>
                    {hasFollow ? 'Mengikuti' : 'Ikuti'}
                  </Button>
                  <Dialog>
                    <DialogTrigger className="w-full border-none p-0">
                      <Button variant={'outline'} className="w-full">
                        Bagikan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-lg">
                      <div className="relative flex flex-col gap-7">
                        <div className="flex flex-col">
                          <h1 className="text-lg font-semibold">Bagikan Profile</h1>
                          <h1 className="text-shade text-sm">Dapatkan lebih banyak teman di sana!</h1>
                        </div>
                        <div className="hide-scroll flex flex-col gap-6 overflow-y-scroll">
                          <div className="flex items-center gap-1">
                            <Input readOnly defaultValue={`${SEO.SITE_URL}@${profile?.username}`} />
                            <Button onClick={() => navigator.clipboard.writeText(`${SEO.SITE_URL}@${profile?.username}`)} size="icon" variant="outline">
                              <LuCopy className="flex-shrink-0 text-lg" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <DialogClose asChild>
                              <Button variant={'secondary'} className="ml-auto">
                                Tutup
                              </Button>
                            </DialogClose>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>
        </div>
        <HeaderTabs className="mb-2" tabs={tabs} onTabsClick={setType} />
        <RenderPosts username={username} type={isType} />
      </Container>
    </>
  );
};

export default UserDetailPage;
