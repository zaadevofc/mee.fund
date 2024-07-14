'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { memo, ReactNode, useContext, useMemo, useState } from 'react';
import { GoBookmark, GoBookmarkFill, GoComment, GoHeart, GoHeartFill, GoSync } from 'react-icons/go';
import { LuBadgeCheck } from 'react-icons/lu';
import { SystemContext } from '~/app/providers';
import Image from '~/components/Services/Image';
import Markdown from '~/components/Services/Markdown';
import { cn } from '~/libs/tools';
import ImageContainer from './ImageContainer';

type PostCardType = {
  type: 'posts' | 'comments';
  index?: number;
  payload: any;
  className?: string;
  children?: ReactNode;
  asComment?: boolean;
  cleanStyle?: boolean;
  showReplyButton?: boolean;
  setRowHeight?: (index: number, height: number) => void;
};

const PostCard = memo((props: PostCardType) => {
  const [isActions, setActions] = useState({ likes: false, reposts: false, bookmarks: false, comments: false });
  const [showReply, setShowReply] = useState(false);

  const { CreateNewActions, setSubmitModal } = useContext(SystemContext);
  const { data: user }: any = useSession();
  const router = useRouter();
  const path = usePathname();
  const isSelf = path.match(`/post/${props.payload?.ids}`);

  const createNewActions = CreateNewActions();

  const handle = (e: any, action: void) => {
    e.stopPropagation();
    action;
  };

  const hasLike = props.payload?.likes?.length > 0;
  const hasRepost = props.payload?.reposts?.length > 0;
  const hasBookmark = props.payload?.bookmarks?.length > 0;

  const indicator = (has: boolean, actions: keyof typeof isActions) => (has ? (!isActions[actions] ? -1 : 0) : isActions[actions] ? 1 : 0);
  const getValues = (has: boolean, actions: keyof typeof isActions) =>
    (has ? (isActions[actions] ? -1 : 0) : isActions[actions] ? 1 : 0) + (props.payload?._count?.[actions] || 0);

  const actionsMark = [['[&_svg]:!fill-rose-600 text-rose-600'], [''], ['text-green-600'], ['[&_svg]:!fill-sky-600 text-sky-600']];

  const makeActions = useMemo(
    () => async (actions: keyof typeof isActions) => {
      if (actions == 'comments') {
        if (!props.asComment) {
          router.push(`/post/${props.payload?.ids}`);
        } else {
          setSubmitModal!({
            open: true,
            type: 'comments',
            post_id: props.payload?.post_id,
            parent_id: props.payload?.parent_id,
          });
        }
        return;
      }

      setActions(x => ({ ...x, [actions]: !x[actions] }));
      await createNewActions.mutate({
        actions,
        type: props.type,
        user_id: user?.id,
        post_id: props.payload?.id,
        comment_id: props.payload?.id,
      } as any);
    },
    []
  );

  const liked = indicator(hasLike, 'likes');
  const bookmarked = indicator(hasBookmark, 'bookmarks');

  const ACTION = [
    { icon: liked ? GoHeartFill : GoHeart, active: liked, value: [getValues(hasLike, 'likes'), 'likes'], click: makeActions },
    { icon: GoComment, value: [props?.payload?._count?.comments || props?.payload?._count?.replies, 'comments'], click: makeActions },
    { icon: GoSync, active: indicator(hasRepost, 'reposts'), value: [getValues(hasRepost, 'reposts'), 'reposts'], click: makeActions },
    { icon: bookmarked ? GoBookmarkFill : GoBookmark, active: bookmarked, value: [getValues(hasBookmark, 'bookmarks'), 'bookmarks'], click: makeActions },
  ];

  const Content = useMemo(
    () => (
      <div className={cn('flex flex-col gap-3', !props.asComment ? 'text-[15px]' : 'text-[14px]')}>
        {props?.payload?.content && <Markdown text={props?.payload?.content} />}
        <ImageContainer
          id={props.payload?.ids}
          videoAutoPlay={!props.asComment}
          small={props.asComment}
          media={props?.payload?.media.map((x: any) => ({ src: x?.url, type: x?.mimetype }))}
        />
      </div>
    ),
    []
  );

  const Actions = useMemo(
    () => (
      <div className={cn('flex items-center gap-5', props.asComment && 'pl-10')}>
        {ACTION.slice(0, props.asComment ? -2 : 4).map((x, i) => (
          <div
            onClick={e => {
              e.stopPropagation();
              x.click(x.value[1]);
            }}
            className={cn(
              'flex cursor-pointer items-center gap-1 active:scale-[.90]',
              props.asComment ? 'text-base' : 'text-[19px]',
              x.value[1] == 'bookmarks' && 'ml-auto',
              x.active && actionsMark[i][0]
            )}
          >
            <x.icon />
            <h1 className="text-[13px]">{x.value[0] || ''}</h1>
          </div>
        ))}
      </div>
    ),
    [ACTION]
  );

  return (
    <>
      <div
        onClick={e => !props.asComment && !isSelf && handle(e, router.push(`/post/${props.payload?.ids}`))}
        className={cn(
          'flex flex-col gap-3 pb-2 pt-4 max-[460px]:px-3 min-[460px]:rounded-xl min-[460px]:border min-[460px]:p-4',
          isSelf ? 'p-4' : 'cursor-pointer',
          props.asComment && 'cursor-auto pb-2 pt-3',
          props.cleanStyle && 'border-none p-0',
          props.className
        )}
      >
        <div className={cn('flex gap-3', !props.asComment && 'items-center')}>
          <Image className={cn('rounded-lg border', props.asComment ? 'size-8' : 'size-9')} src={props.payload?.user?.picture} />
          <div className={cn('flex w-full flex-col overflow-hidden text-sm', props.asComment && 'gap-0.5 text-[13px]')}>
            <div className="flex w-full">
              <h1 onClick={e => handle(e, router.push(`/@${props.payload?.user?.username}`))} className="font-bold cursor-pointer hover:underline">
                {props.payload?.user?.name}
              </h1>
              {props.payload?.user?.is_verified && (
                <LuBadgeCheck className={cn('fill-sky-500 stroke-white text-lg', props.payload?.user?.role == 'AUTHOR' && 'fill-purple-500')} />
              )}
            </div>
            <p className={cn('text-xs text-secondary-300', !props.payload?.category && 'hidden')}>{props.payload?.category?.replaceAll('_', ' ')}</p>
            {props.asComment && Content}
          </div>
        </div>
        {!props.asComment && Content}
        {Actions}
        <div className={cn('ml-10 flex flex-col', !showReply && 'hidden')}>{props.children}</div>
        {props.showReplyButton && props.asComment && !!props.payload?.replies?.length && (
          <button onClick={() => setShowReply(x => !x)} className={cn('ml-10 w-fit bg-secondary-50 text-[13px]', showReply && 'mt-3')}>
            {showReply ? 'Sembunyikan' : 'Lihat balasan'}
          </button>
        )}
        <div
          className={cn(
            'mt-1 flex gap-2 rounded-lg border bg-secondary-50 p-2',
            props.payload?.comments?.length == 0 && 'hidden',
            props.asComment && 'hidden',
            isSelf && 'hidden'
          )}
        >
          <Image className="size-8 rounded-lg border" src={props.payload?.comments?.[0]?.user?.picture} />
          <div className="flex flex-col text-sm">
            <div className="flex">
              <h1 onClick={e => handle(e, router.push(`/@${props.payload?.comments?.[0]?.user?.username}`))} className="font-bold cursor-pointer hover:underline">
                {props.payload?.comments?.[0]?.user?.name}
              </h1>
              {props.payload?.comments?.[0]?.user?.is_verified && (
                <LuBadgeCheck className={cn('fill-sky-500 stroke-white text-lg', props.payload?.comments?.[0]?.user?.role == 'AUTHOR' && 'fill-purple-500')} />
              )}
            </div>
            <Markdown className="line-clamp-2 leading-[17px]" text={props.payload?.comments?.[0]?.content} />
          </div>
        </div>
      </div>
    </>
  );
});

export default PostCard;
