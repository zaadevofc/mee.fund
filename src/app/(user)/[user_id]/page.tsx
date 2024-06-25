"use client";

import { signOut, useSession } from "next-auth/react";
import { notFound, usePathname } from "next/navigation";
import { useContext } from "react";
import { LuBadgeCheck } from "react-icons/lu";
import Loading from "~/app/loading";
import { SystemContext } from "~/app/providers";
import BackHeaderButton from "~/components/BackHeaderButton";
import Image from "~/components/Image";
import Markdown from "~/components/Markdown";
import PostCard from "~/components/PostCard";
import Wrapper from "~/components/Wrapper";

const PostDetailPage = ({ params }: any) => {
  const { data: session }: any = useSession();
  const path = usePathname();

  if (!path.startsWith("/@")) return notFound();

  const userPath = path.substring(2);

  const { FetchUserProfile } = useContext(SystemContext);

  const UserProfile: any = FetchUserProfile(
    userPath,
    !path.startsWith("/@") ? "off" : "on",
  );

  if (
    ["NOT_FOUND", "INTERNAL_SERVER_ERROR", "INVALID_QUERY"].includes(
      UserProfile.data?.error,
    )
  )
    return notFound();

  return (
    <>
      <Wrapper loading={UserProfile.isLoading}>
        <BackHeaderButton label="Profile" />
        <div className={`flex w-full flex-col gap-4 rounded-lg border p-5`}>
          <div className="flex items-center gap-4">
            <div className="flex size-20 items-center justify-center rounded-full border bg-gray-200">
              <Image
                className="size-20 rounded-full border"
                src={UserProfile.data?.data?.picture.replace(
                  "=s96-c",
                  "=s500-c",
                )}
                alt=""
              />
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-2xl">
                <strong>{UserProfile.data?.data?.name}</strong>
                <LuBadgeCheck
                  className={`${UserProfile.data?.data?.is_verified && "!block"} hidden fill-green-400 stroke-white text-lg`}
                />
              </div>
              <p className="text-sm text-gray-500">
                @{UserProfile.data?.data?.username}
              </p>
            </div>
          </div>
          <div>
            <Markdown
              className={`leading-[21px]`}
              text={
                !!UserProfile.data?.data?.bio
                  ? UserProfile.data?.data?.bio
                  : "_bio akan ditampilkan disini_"
              }
            />
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
              text={`**${UserProfile.data?.data?._count.followers}** pengikut  •  **${UserProfile.data?.data?._count.following}** mengikuti  •  **${UserProfile.data?.data?._count.posts}** postingan`}
            />
          </div>
          <div className="flex w-full items-center gap-3">
            <div className="w-full">
              <h1 className="btn btn-primary btn-sm w-full">Ikuti</h1>
            </div>
            {UserProfile.data?.data?.username == path.substring(2) ? (
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
