'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useContext, useMemo, useState } from 'react';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { LuArrowUpCircle, LuBadgeCheck, LuBookmark, LuMessageSquare, LuRefreshCcw, LuShare } from 'react-icons/lu';
import { SystemContext } from '~/app/providers';
import Markdown from '~/components/Services/Markdown';
import { dayjs } from '~/libs/tools';
import FormInputCard from '../Layouts/SubmitCard';
import Image from '../Services/Image';
import ImageContainer from '../Services/ImageContainer';

type PostCardType = {
  key?: any;
  clean?: boolean;
  asComment?: boolean;
  commentForm?: boolean;
  className?: string;
  payload: {
    post_id: string;
    ids: string;
    name: string;
    username: string;
    picture: string;
    is_verified: string;
    category?: string;
    content?: string;
    media?: [];
    created_at: string;
    hasLike?: boolean;
    hasBookMark?: boolean;
    hasRepost?: boolean;
    likes?: number;
    comments?: number;
    reposts?: number;
    bookmarks?: number;
    comment_name?: string;
    comment_username?: string;
    comment_picture?: string;
    comment_is_verified?: string;
    comment_content?: string;
    comment_created_at?: string;
  };
};

const PostCard = ({ asComment, key, commentForm, clean, payload }: Partial<PostCardType>) => {
  const [isLike, setIsLike] = useState(false);
  const [isBookMark, setIsBookMark] = useState(false);
  const [isRepost, setIsRepost] = useState(false);

  const { data: user }: any = useSession();
  const IMGL = (payload && payload?.media?.length) || 0;

  const { PostLikeActions, PostRepostActions, PostBookMarkActions, CommentLikeActions } = useContext(SystemContext);

  const postLikeActions = PostLikeActions();
  const postRepostActions = PostRepostActions();
  const postBookMarkActions = PostBookMarkActions();
  const commentLikeActions = CommentLikeActions();

  const actionPostLits = useMemo(
    () =>
      payload && [
        {
          icon: LuArrowUpCircle,
          color: 'bg-primary',
          fill: '[&_svg]:fill-primary/20 text-primary',
          value: (payload?.hasLike ? (isLike ? -1 : 0) : isLike ? 1 : 0) + (payload?.likes || 0),
          isOn: payload?.hasLike ? (!isLike ? -1 : 0) : isLike ? 1 : 0,
          setIsOn: setIsLike,
          fn: (clean || asComment) ? postLikeActions.mutate : commentLikeActions.mutate,
        },
        {
          icon: LuMessageSquare,
          color: 'bg-info',
          fill: '[&_svg]:fill-info/20 text-info',
          value: payload?.comments,
        },
        {
          icon: LuRefreshCcw,
          color: 'bg-error',
          fill: '[&_svg]:stroke-rose-500 text-rose-500',
          value: (payload?.hasRepost ? (isRepost ? -1 : 0) : isRepost ? 1 : 0) + (payload?.reposts || 0),
          isOn: payload?.hasRepost ? (!isRepost ? -1 : 0) : isRepost ? 1 : 0,
          setIsOn: setIsRepost,
          fn: postRepostActions.mutate,
        },
        {
          icon: LuBookmark,
          color: 'bg-secondary',
          fill: '[&_svg]:fill-secondary/20 text-secondary',
          value: (payload?.hasBookMark ? (isBookMark ? -1 : 0) : isBookMark ? 1 : 0) + (payload?.bookmarks || 0),
          isOn: payload?.hasBookMark ? (!isBookMark ? -1 : 0) : isBookMark ? 1 : 0,
          setIsOn: setIsBookMark,
          fn: postBookMarkActions.mutate,
        },
        {
          icon: LuShare,
          color: 'bg-neutral',
          fill: '[&_svg]:fill-neutral/20 text-neutral',
        },
      ],
    [payload, postLikeActions, postRepostActions, postBookMarkActions]
  );

  if (payload?.post_id)
    return (
      <>
        <div key={key} className={`flex flex-col gap-0 bg-white`}>
          {/* <div className="pb-3 pl-4 pt-4">
            <Link
              href={'/'}
              className="badge badge-sm flex items-center gap-1 !border-gray-300 !py-2.5 !pl-0 active:scale-[.96]"
            >
              <Image
                className="size-5 h-fit flex-shrink-0 rounded-full border"
                src={payload?.picture ?? '/assets/defaults/thumbnails/empty-picture.webp'}
                width={100}
                height={100}
                alt={`@${payload?.username} profile picture`}
              />
              <small>
                Reposts by <span className="text-primary">@zaadevofc</span>
              </small>
            </Link>
          </div> */}
          <div className={`${clean && 'flex-col items-start !gap-3'} flex w-full gap-2 p-4`}>
            <div className={`${!clean && 'flex-col'} flex flex-shrink-0 items-center gap-3`}>
              <Link scroll={false} href={`/@${payload?.username}`}>
                <Image
                  className="size-10 h-fit flex-shrink-0 rounded-full border"
                  src={payload?.picture ?? '/assets/defaults/thumbnails/empty-picture.webp'}
                  width={100}
                  height={100}
                  alt={`@${payload?.username} profile picture`}
                />
              </Link>
              <div className={clean ? 'flex flex-col' : 'hidden'}>
                <div className="flex w-full items-center gap-1">
                  <Link href={`/@${payload?.username}`} className="flex items-center gap-0.5 text-sm">
                    <strong>{payload?.name}</strong>
                    <LuBadgeCheck
                      className={`${payload?.is_verified && '!block'} hidden fill-green-400 stroke-white text-lg`}
                    />
                  </Link>
                  <span className="text-sm opacity-60">• {dayjs(payload?.created_at).calendar(dayjs())}</span>
                </div>
                <span className="text-sm opacity-60">{`@${payload?.username}`}</span>
              </div>
              {asComment && (payload?.comments || 0) > 0 && (
                <div className="relative h-[85%] w-[1px] rounded-br-lg bg-primary-content" />
              )}
            </div>
            <div className="flex w-full flex-col">
              <Link href={`/post/${payload?.ids}`} className="flex w-full cursor-pointer flex-col">
                <div className={clean ? 'hidden' : 'flex flex-col'}>
                  <div className="flex w-full items-center gap-1">
                    <Link href={`/@${payload?.username}`} className="flex items-center gap-0.5 text-sm">
                      <strong>{payload?.name}</strong>
                      <LuBadgeCheck
                        className={`${payload?.is_verified && '!block'} hidden fill-green-400 stroke-white text-lg`}
                      />
                    </Link>
                    <span className="text-sm opacity-60">
                      • {`@${payload?.username}`} • {dayjs(payload?.created_at).calendar(dayjs())}
                    </span>
                    <button className="btn btn-ghost btn-xs ml-auto">
                      <IoEllipsisHorizontal />
                    </button>
                  </div>
                </div>
                <div>
                  <Markdown
                    className={`${
                      IMGL > 0 ? 'line-clamp-4' : 'line-clamp-[20]'
                    } leading-[20px] ${clean && '!text-base'}`}
                    text={payload?.content}
                  />
                </div>
              </Link>
              <ImageContainer media={payload?.media} className="mt-1.5" />
              <div className="mt-4 flex w-full items-center gap-5">
                {actionPostLits?.slice(0, (clean || asComment) ? actionPostLits.length : 2)?.map((x, i) => (
                  <>
                    <label
                      onClick={() => {
                        user &&
                          x?.fn!({
                            user_id: user?.id,
                            ...(((clean || asComment) ? { post_id: payload?.post_id } : { comment_id: payload?.post_id }) as any),
                          });
                        user && x?.setIsOn!(x => !x);
                      }}
                      className={`${i == actionPostLits.length - 1 && 'ml-auto'} ${x?.isOn && x.fill} group flex cursor-pointer items-center gap-1`}
                    >
                      <div className="relative inline-flex items-center justify-center">
                        <x.icon className={`relative z-10 flex-shrink-0 stroke-[1.1] text-xl`} />
                        <div
                          className={`absolute ${x.color} left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform rounded-full opacity-0 group-hover:opacity-20`}
                        />
                      </div>
                      <h1 className={`text-sm opacity-80`}>{x.value}</h1>
                    </label>
                  </>
                ))}
              </div>
              <Link
                href={`/post/${payload?.ids}`}
                className={`${!asComment && '!hidden'} ${payload.comments == 0 && 'hidden'} z-10 mt-5 flex gap-2 rounded-lg border bg-primary/10 !p-3`}
              >
                <Link scroll={false} href={`/@${payload?.comment_username}`} className="flex-shrink-0">
                  <Image
                    className="size-10 flex-shrink-0 rounded-full border"
                    src={payload?.comment_picture ?? '/assets/defaults/thumbnails/empty-picture.webp'}
                    width={100}
                    height={100}
                    alt={`@${payload?.comment_username} profile picture`}
                  />
                </Link>
                <div className={`flex w-full flex-col gap-4`}>
                  <div className="flex flex-col">
                    <div className="flex w-full items-center gap-1">
                      <Link href={`/@${payload?.comment_username}`} className="flex items-center gap-0.5 text-sm">
                        <strong>{payload?.comment_name}</strong>
                        <LuBadgeCheck
                          className={`${payload?.comment_is_verified && '!block'} hidden fill-green-400 stroke-white text-lg`}
                        />
                      </Link>
                      <span className="text-sm opacity-60">
                        • {`@${payload?.comment_username}`} • {dayjs(payload?.comment_created_at).calendar(dayjs())}
                      </span>
                    </div>
                    <div>
                      <Markdown className={`line-clamp-3 leading-[20px]`} text={payload?.comment_content} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          {commentForm && (
            <FormInputCard className="mt-3" inputMode={commentForm ? 'comments' : 'posts'} post_id={payload?.ids} />
          )}
        </div>
      </>
    );
};

export default PostCard;
