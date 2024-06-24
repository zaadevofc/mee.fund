"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { LuBadgeCheck } from "react-icons/lu";
import BackHeaderButton from "~/components/BackHeaderButton";
import Image from "~/components/Image";
import Markdown from "~/components/Markdown";
import PostCard from "~/components/PostCard";
import Wrapper from "~/components/Wrapper";
import { getUsernameFromParams } from "~/libs/tools";

const PostDetailPage = ({ params }: any) => {
  const { data: session }: any = useSession();

  const router = useRouter();
  const path = usePathname();
  const user: any = session?.username == path.substring(2) ? session : {};

  return (
    <>
      <Wrapper>
        <BackHeaderButton label="Profile" />
        <div className={`flex w-full flex-col gap-4 rounded-lg border p-5`}>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
              <img
                className="rounded-full border"
                src="https://avatars.githubusercontent.com/u/93970726?v=4"
                alt=""
              />
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-2xl">
                <strong>{user?.name}</strong>
                <LuBadgeCheck className="fill-green-400 stroke-white text-lg" />
              </div>
              <p className="text-sm text-gray-500">@{user?.username}</p>
            </div>
          </div>
          <div>
            <Markdown className={`leading-[21px]`} text={user?.bio} />
          </div>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((x) => (
              <div className="tooltip cursor-pointer" data-tip="hello">
                <div className="w-7 overflow-hidden rounded-full border">
                  <Image
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                    src="/assets/badges/cute-shiba.avif"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="text-gray-500">
            <Markdown
              className={`leading-[21px]`}
              text={`**344k** pengikut  •  **1.9k** mengikuti  •  **1.3k** postingan`}
            />
          </div>
          <div className="flex w-full items-center gap-3">
            <div className="w-full">
              <h1 className="btn btn-primary btn-sm w-full">Ikuti</h1>
            </div>
            {user?.username == path.substring(2) ? (
              <div onClick={() => signOut()} className="w-full">
                <h1 className="btn btn-outline btn-error btn-sm w-full">
                  Logout
                </h1>
              </div>
            ) : (
              <div className="w-full">
                <h1 className="btn btn-outline btn-sm w-full">Bagikan</h1>
              </div>
            )}
          </div>
        </div>
        <div
          role="tablist"
          className="tabs-boxed tabs rounded-lg border bg-transparent"
        >
          <h1 role="tab" className="tab font-semibold text-primary">
            Postingan
          </h1>
          <h1 role="tab" className="tab">
            Disukai
          </h1>
          <h1 role="tab" className="tab">
            Disimpan
          </h1>
        </div>
        {Array.from({ length: 10 }).map((x) => (
          <PostCard />
        ))}
      </Wrapper>
    </>
  );
};

export default PostDetailPage;
