"use client";

import { signOut, useSession } from "next-auth/react";
import { notFound, usePathname } from "next/navigation";
import { useContext, useState } from "react";
import { LuBadgeCheck } from "react-icons/lu";
import Loading from "~/app/loading";
import { SystemContext } from "~/app/providers";
import BackHeaderButton from "~/components/BackHeaderButton";
import Image from "~/components/Image";
import Markdown from "~/components/Markdown";
import PostCard from "~/components/PostCard";
import RenderPosts from "~/components/RenderPosts";
import TabOptions, { TabOptionsType } from "~/components/TabOptions";
import Wrapper from "~/components/Wrapper";

const UserDetailPage = ({ user_id }: any) => {
  if (!user_id.startsWith("@")) return notFound();

  const [isType, setType] = useState<any>("newest");
  const { FetchUserProfile } = useContext(SystemContext);
  const { data: user }: any = useSession();

  const username = user_id.substring(1);

  const fetchUserProfile: any = FetchUserProfile(
    { username },
    !user_id.startsWith("@") ? "off" : "on",
  );

  if (
    ["NOT_FOUND", "INTERNAL_SERVER_ERROR", "INVALID_QUERY"].includes(
      fetchUserProfile.data?.error,
    )
  )
    return notFound();

  const profile = fetchUserProfile.data?.data;
  const isSelf = user?.username == username;

  const tabs = [
    { label: "Terbaru", value: "newest" },
    { label: "Reposts", value: "reposts" },
    isSelf && { label: "Disukai", value: "likes" },
    isSelf && { label: "Disimpan", value: "bookmarks" },
  ];

  return (
    <>
      <Wrapper
        loading={fetchUserProfile?.isLoading}
        headerBackButton
        headerBackLabel={`Profile ${isSelf ? "(Anda)" : ""}`}
      >
        <div className={`flex w-full flex-col gap-4 rounded-lg border p-5`}>
          <div className="flex items-center gap-4">
            <div className="flex size-20 flex-shrink-0 items-center justify-center rounded-full border bg-gray-200">
              <Image
                className="size-20 rounded-full border"
                src={
                  profile?.picture.replace("=s96-c", "=s500-c") ??
                  "/assets/defaults/thumbnails/empty-picture.webp"
                }
                alt=""
              />
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-2xl">
                <strong>{profile?.name}</strong>
                <LuBadgeCheck
                  className={`${profile?.is_verified && "!block"} hidden fill-green-400 stroke-white text-lg`}
                />
              </div>
              <p className="text-sm text-gray-500">@{profile?.username}</p>
            </div>
          </div>
          <div className="my-3">
            <Markdown
              className={`leading-[21px]`}
              text={
                !!profile?.bio ? profile?.bio : "_bio akan ditampilkan disini_"
              }
            />
          </div>
          <div className="sflex hidden items-center gap-1.5">
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
              text={`**${profile?._count.followers}** pengikut  •  **${profile?._count.following}** mengikuti  •  **${profile?._count.posts}** postingan`}
            />
          </div>
          <div className="flex w-full items-center gap-3">
            {isSelf ? (
              <>
                <div className="w-full">
                  <h1 className="btn btn-outline btn-primary btn-sm w-full">
                    Edit Profile
                  </h1>
                </div>
                <div onClick={() => user && signOut()} className="w-full">
                  <h1 className="btn btn-outline btn-error btn-sm w-full">
                    Logout
                  </h1>
                </div>
              </>
            ) : (
              <>
                <div className="w-full">
                  <h1 className="btn btn-primary btn-sm w-full">Ikuti</h1>
                </div>
                <div className="w-full">
                  <h1 className="btn btn-outline btn-sm w-full">Bagikan</h1>
                </div>
              </>
            )}
          </div>
        </div>
        <TabOptions tabs={tabs} onTabsClick={setType} />
        {tabs
          .filter((x) => x)
          .map(
            (x: any) =>
              isType == x.value && (
                <RenderPosts
                  category={"UMUM"}
                  options={x.value}
                  username={user_id.substring(1)}
                />
              ),
          )}
      </Wrapper>
    </>
  );
};

export default UserDetailPage;
