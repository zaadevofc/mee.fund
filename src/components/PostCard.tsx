"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { IoEllipsisHorizontal } from "react-icons/io5";
import {
  LuArrowUpCircle,
  LuBadgeCheck,
  LuBookmark,
  LuMessageSquare,
  LuRefreshCcw,
  LuShare,
} from "react-icons/lu";
import Markdown from "~/components/Markdown";
import { dayjs } from "~/libs/tools";
import FormInputCard from "./FormInputCard";
import Image from "./Image";
import ImageContainer from "./ImageContainer";

type PostCardType = {
  key?: any;
  clean?: boolean;
  commentForm?: boolean;
  className?: string;
  payload: {
    post_id: string;
    name: string;
    username: string;
    picture: string;
    is_verified: string;
    category: string;
    content?: string;
    media?: [];
    created_at: string;
    likes: number;
    comments: number;
    reposts: number;
    bookmarks: number;
    comment_name?: string;
    comment_username?: string;
    comment_picture?: string;
    comment_is_verified?: string;
    comment_content?: string;
    comment_created_at?: string;
  };
};

const PostCard = ({
  key,
  commentForm,
  clean,
  payload,
}: Partial<PostCardType>) => {
  const IMGL = (payload && payload.media?.length) || 0;
  const router = useRouter();

  const actionPostLits = payload && [
    {
      icon: LuArrowUpCircle,
      value: payload.likes,
      color: "bg-accent",
    },
    {
      icon: LuMessageSquare,
      value: payload.comments,
      color: "bg-info",
    },
    {
      icon: LuRefreshCcw,
      value: payload.reposts,
      color: "bg-success",
    },
    {
      icon: LuBookmark,
      value: payload.bookmarks,
      color: "bg-secondary",
    },
    {
      icon: LuShare,
      color: "bg-neutral",
    },
  ];

  if (payload?.post_id)
    return (
      <>
        <div
          key={key}
          className={`flex flex-col gap-3 rounded-lg borders bg-white ${clean && "clean"} p-4`}
        >
          <div
            className={`${clean && "flex-col items-start !gap-3"} flex w-full gap-2`}
          >
            <div
              className={`${!clean && "flex-col"} flex flex-shrink-0 items-center gap-3`}
            >
              <Link scroll={false} href={`/@${payload.username}`}>
                <Image
                  className="size-10 h-fit flex-shrink-0 rounded-full border"
                  src={
                    payload.picture ??
                    "/assets/defaults/thumbnails/empty-picture.webp"
                  }
                  width={100}
                  height={100}
                  alt={`@${payload.username} profile picture`}
                />
              </Link>
              <div className={clean ? "flex flex-col" : "hidden"}>
                <div className="flex w-full items-center gap-1">
                  <Link
                    href={`/@${payload.username}`}
                    className="flex items-center gap-0.5 text-sm"
                  >
                    <strong>{payload.name}</strong>
                    <LuBadgeCheck
                      className={`${payload.is_verified && "!block"} hidden fill-green-400 stroke-white text-lg`}
                    />
                  </Link>
                  <span className="text-sm opacity-60">
                    • {dayjs(payload?.created_at).calendar(dayjs())}
                  </span>
                </div>
                <span className="text-sm opacity-60">
                  {`@${payload.username}`}
                </span>
              </div>
              {payload.comments > 0 && (
                <div className="h-full w-[1px] bg-primary-content" />
              )}
            </div>
            <div className="flex w-full flex-col">
              <Link
                href={`/post/${payload.post_id}`}
                className="flex w-full cursor-pointer flex-col"
              >
                <div className={clean ? "hidden" : "flex flex-col"}>
                  <div className="flex w-full items-center gap-1">
                    <Link
                      href={`/@${payload.username}`}
                      className="flex items-center gap-0.5 text-sm"
                    >
                      <strong>{payload.name}</strong>
                      <LuBadgeCheck
                        className={`${payload.is_verified && "!block"} hidden fill-green-400 stroke-white text-lg`}
                      />
                    </Link>
                    <span className="text-sm opacity-60">
                      • {`@${payload.username}`} •{" "}
                      {dayjs(payload?.created_at).calendar(dayjs())}
                    </span>
                    <button className="btn btn-ghost btn-xs ml-auto">
                      <IoEllipsisHorizontal />
                    </button>
                  </div>
                </div>
                <div>
                  <Markdown
                    className={`${
                      IMGL > 0 ? "line-clamp-4" : "line-clamp-[20]"
                    } leading-[20px]`}
                    text={payload?.content}
                  />
                </div>
              </Link>
              <ImageContainer media={payload?.media} className="mt-1.5" />
              <div className="mt-4 flex w-full items-center gap-5">
                {actionPostLits?.map((x, i) => (
                  <>
                    <label
                      onClick={() => toast.success("Hello World")}
                      className={`${i == actionPostLits.length - 1 && "ml-auto"} group flex cursor-pointer items-center gap-1`}
                    >
                      <div className="relative inline-flex items-center justify-center">
                        <x.icon className="relative z-10 flex-shrink-0 stroke-[1.1] text-xl" />
                        <div
                          className={`absolute ${x.color} left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform rounded-full opacity-0 group-hover:opacity-20`}
                        />
                      </div>
                      <span className="text-sm opacity-80">{x.value}</span>
                    </label>
                  </>
                ))}
              </div>
            </div>
          </div>
          {commentForm && <FormInputCard className="mt-3" />}
          {/* <Link
          href={`/@${payload.username}/post/${payload?.ids}`}
          className="flex gap-2 overflow-hidden rounded-lg border bg-base-200 p-3"
         >
          <Link scroll={false}href={"/s"}>
            <img
              className="h-fit w-10 rounded-full border"
              src="https://avatars.githubusercontent.com/u/93970726?v=4"
              width={100}
              height={100}
            />
          </Link>
          <div className="flex w-fit flex-col gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <Link scroll={false}href={"/s"} className="flex items-center gap-0.5">
                  <strong>zaadevofc</strong>
                  <LuBadgeCheck className="fill-green-400 stroke-white text-base" />
                </Link>
                <span className="text-sm opacity-60">
                  • @zaadevofc • {dayjs().calendar(dayjs())}
                </span>
              </div>
              <div>
                <Markdown
                  className={`line-clamp-3 leading-[21px]`}
                  text={`Pas itu pernah coba make nextjs eh malah tekorr pricing nya meledak parah wkwkwkkw bikin rugi... Pas itu pernah coba make nextjs eh malah tekorr pricing nya meledak parah wkwkwkkw bikin rugi...Pas itu pernah coba make nextjs eh malah tekorr pricing nya meledak parah wkwkwkkw bikin rugi...Pas itu pernah coba make nextjs eh malah tekorr pricing nya meledak parah wkwkwkkw bikin rugi...`}
                />
              </div>
            </div>
          </div>
        </Link> */}
        </div>
      </>
    );
};

export default PostCard;
