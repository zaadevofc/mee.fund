import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useContext, useState, useMemo, useCallback, memo } from 'react';
import { Collapse } from 'react-collapse';
import * as Icons from 'react-icons/lu';
import { SystemContext } from '~/app/providers';
import { dayjs } from '~/libs/tools';
import Image from '../Services/Image';
import ImageContainer from '../Services/ImageContainer';
import Markdown from '../Services/Markdown';

const actionsMark = [
  ['hover:text-red-500', '[&_svg]:fill-red-500 text-red-500'],
  ['hover:text-blue-500', ''],
  ['hover:text-green-500', 'text-green-500'],
  ['hover:text-purple-500', ''],
  ['hover:text-sky-500', '[&_svg]:fill-sky-500 text-sky-500'],
];

const shareList = [
  { label: 'WhatsApp', img: '/assets/defaults/icons/whatsapp.png' },
  { label: 'Facebook', img: '/assets/defaults/icons/facebook.png' },
  { label: 'Telegram', img: '/assets/defaults/icons/telegram.png' },
  { label: 'Pinterest', img: '/assets/defaults/icons/pinterest.png' },
  { label: 'LinkedIn', img: '/assets/defaults/icons/linkedin.png' },
];

const optionsList = [
  { icon: Icons.LuUserPlus, label: 'Ikuti @zaadevofc' },
  { icon: Icons.LuBan, label: 'Bisukan @zaadevofc' },
  { icon: Icons.LuMegaphone, label: 'Laporkan Postingan' },
  { icon: Icons.LuThumbsDown, label: 'Tidak Tertarik' },
];

type PostsCardType = {
  columnStyle?: boolean;
  cleanStyle?: boolean;
  showHighlight?: boolean;
  showSideOutline?: boolean;
  showSideDots?: boolean;
  allowInputModal?: boolean;
  allowCollapse?: boolean;
  allowLinked?: boolean;
  payload?: unknown;
  type: 'posts' | 'comments';
  children?: ReactNode;
  hideNotCommentActions?: boolean;
};

const PostsCard = memo((props: PostsCardType) => {
  const [isActions, setActions] = useState({ likes: false, reposts: false, bookmarks: false });
  const [isCollapse, setCollapse] = useState(true);

  const router = useRouter();
  const path = usePathname();
  const payload = props?.payload as any;
  const { data: user } = useSession() as any;
  const { CreateNewActions, setInitSubmitType, setInitTempPosts } = useContext(SystemContext);
  const createNewActions = CreateNewActions();

  const hasLike = useMemo(() => payload?.likes?.length > 0, [payload?.likes]);
  const hasRepost = useMemo(() => payload?.reposts?.length > 0, [payload?.reposts]);
  const hasBookmark = useMemo(() => payload?.bookmarks?.length > 0, [payload?.bookmarks]);

  const indicator = useCallback((has: boolean, actions: keyof typeof isActions) => (has ? (!isActions[actions] ? -1 : 0) : isActions[actions] ? 1 : 0), [isActions]);

  const getValues = useCallback(
    (has: boolean, actions: keyof typeof isActions) => (has ? (isActions[actions] ? -1 : 0) : isActions[actions] ? 1 : 0) + (payload?._count?.[actions] || 0),
    [isActions, payload?._count]
  );

  const makeActions = useCallback(
    async (actions: keyof typeof isActions) => {
      setActions(x => ({ ...x, [actions]: !x[actions] }));
      props.type == 'posts' &&
        setInitTempPosts!((x: any) => {
          const find = x?.findIndex((y: any) => y?.ids === payload?.ids);
          const status = indicator(payload?.[actions].length > 0, actions);
          x[find] = {
            ...x[find],
            [actions]: Array(status ? 0 : 1),
            _count: {
              ...x[find]._count,
              [actions]: payload?._count[actions] + (status ? -1 : 1),
            },
          };
          return x;
        });
      await createNewActions.mutate({
        actions,
        type: props.type,
        user_id: user?.id,
        post_id: payload?.id,
        comment_id: payload?.id,
      } as any);
    },
    []
  );

  const actionsList = useMemo(
    () => [
      {
        icon: Icons.LuHeart,
        value: [getValues(hasLike, 'likes'), 'likes'],
        active: indicator(hasLike, 'likes'),
        click: makeActions,
      },
      {
        icon: Icons.LuMessageSquare,
        value: [(payload?._count?.replies ?? payload?._count?.comments) || 0, 'comments'],
        click: () => props.allowLinked && router.push(`/post/${payload?.ids}`),
      },
      {
        icon: Icons.LuRepeat,
        value: [getValues(hasRepost, 'reposts'), 'reposts'],
        active: indicator(hasRepost, 'reposts'),
        click: makeActions,
      },
      // {
      //   icon: Icons.LuBarChart2,
      //   value: ['454', ''],
      //   click: () => '',
      // },
      {
        icon: Icons.LuBookmark,
        value: [getValues(hasBookmark, 'bookmarks'), 'bookmarks'],
        active: indicator(hasBookmark, 'bookmarks'),
        click: makeActions,
      },
    ],
    [getValues, hasBookmark, hasLike, hasRepost, indicator, makeActions, payload?._count?.comments, payload?._count?.replies, payload?.ids, router, props.allowLinked]
  );

  if (!payload) return null;

  return (
    <article
      onClick={e => {
        e.stopPropagation();
        props.allowLinked && router.push(`/post/${payload?.ids}`);
      }}
      className={`${!props.cleanStyle && 'border p-4'} ${props.type == 'posts' && 'max-[490px]:border-b max-[490px]:px-3 max-[490px]:pb-5'} group flex cursor-pointer flex-col rounded-lg bg-white max-[490px]:!rounded-none`}
    >
      <div className={`${props.cleanStyle && 'max-[490px]:gap-3'} flex flex-col gap-2s`}>
        <div className={`${props.type == 'posts' && 'items-center'} relative flex gap-3`}>
          <div
            onClick={e => {
              e.stopPropagation();
              props.allowCollapse && setCollapse(x => !x);
            }}
            className={`${!props.allowCollapse && 'hidden'} absolute -left-8 -top-3 size-8 cursor-pointer rounded-bl-xl border-b-2 border-l-2 border-gray-200 hover:border-gray-400`}
          />
          <Image src={payload?.user?.picture} className="size-9 rounded-full" />
          <div className="flex w-full flex-col">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                <span className="font-bold">{payload?.user?.name}</span>
                <Icons.LuBadgeCheck className={`${!payload?.user?.is_verified && 'hidden'} flex-shrink-0 fill-primary text-lg text-white`} />
              </div>
              <span className="text-shade text-[13px]"> • {dayjs(payload?.created_at).calendar(dayjs())}</span>
              <div onClick={e => e.stopPropagation()} className={`${props.hideNotCommentActions && 'hidden'} dropdown dropdown-end ml-auto`}>
                <div tabIndex={0} className="text-shade cursor-pointer text-base">
                  <Icons.LuMoreHorizontal className="flex-shrink-0" />
                </div>
                <ul tabIndex={0} className="menu dropdown-content z-[1] w-max rounded-box border bg-base-100 p-2 font-bold drop-shadow-xl">
                  {optionsList.map((x, i) => (
                    <li key={i}>
                      <div className="flex items-center gap-3">
                        <x.icon className="flex-shrink-0 stroke-[2.8] text-base" />
                        <h1>{x.label}</h1>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <small className={`text-shade-0`}>{payload?.category}</small>
          </div>
        </div>
        <Collapse isOpened={isCollapse}>
          <div className="flex h-full">
            <div className={`${props.columnStyle && 'hidden'} flex w-12 flex-shrink-0 flex-col`}>
              <div
                className={`${props.showHighlight && (payload?.comments?.length || 0) && '!block'} ${!props.showSideOutline && 'hidden'} ml-4 h-full w-[1px] bg-gray-100`}
              />
              <div className={`${!props.showSideDots && 'hidden'} ml-3 h-2 w-2 rounded-full bg-neutral-content`} />
            </div>
            <div className={`flex w-full flex-col gap-2`}>
              <div className="flex flex-col gap-3">
                <Markdown className="max-[490px]:!text-[15px]" text={payload?.content} />
                <ImageContainer media={payload?.media?.map((x: any) => ({ type: x.mimetype, src: x.url }))} />
              </div>

              <div className="mt-1 flex items-center gap-8 pb-1 pt-3 max-[490px]:gap-6 min-[490px]:border-t">
                {actionsList.slice(0, props.hideNotCommentActions ? 2 : -1).map((x, i) => (
                  <label
                    htmlFor={x.value[1] == 'comments' && props.type == 'comments' ? 'make_post_modal' : ''}
                    onClick={e => {
                      e.stopPropagation();
                      x.value[1] == 'comments' &&
                        props.type == 'comments' &&
                        setInitSubmitType!({ type: props.type, post_id: path.split('/post/')[1], parent_id: payload?.parent_id ?? payload?.id });
                      user && x?.click(x.value[1] as any);
                    }}
                    key={i}
                    className={`${actionsMark[i][0]} ${x.active && actionsMark[i][1]} text-shade flex cursor-pointer items-center gap-1.5 text-base active:scale-[.90]`}
                  >
                    <x.icon className="flex-shrink-0 text-lg" />
                    <small>{x.value[0]}</small>
                  </label>
                ))}

                <div className={`${props.hideNotCommentActions && 'hidden'} ml-auto flex items-center gap-2`}>
                  {actionsList.map(
                    (x, i) =>
                      i + 1 == actionsList.length && (
                        <div
                          onClick={e => {
                            e.stopPropagation();
                            x?.click(x.value[1] as any);
                          }}
                          key={i}
                          className={`${actionsMark[i][0]} ${x.active && actionsMark[i][1]} text-shade flex cursor-pointer items-center gap-1.5 text-base`}
                        >
                          <x.icon className="flex-shrink-0 text-lg" />
                        </div>
                      )
                  )}
                  <div onClick={e => e.stopPropagation()} className={`${props.hideNotCommentActions && 'hidden'} dropdown dropdown-end hidden`}>
                    <div tabIndex={0} className="text-shade cursor-pointer text-base">
                      <Icons.LuShare className="flex-shrink-0" />
                    </div>
                    <ul tabIndex={0} className="menu dropdown-content z-[1] w-max rounded-box border bg-base-100 p-2 font-bold drop-shadow-xl">
                      <li>
                        <div className="flex items-center gap-3">
                          <Icons.LuCopy className="flex-shrink-0 text-base" />
                          <h1>Copy Link</h1>
                        </div>
                      </li>
                      {shareList.map((x, i) => (
                        <li key={i}>
                          <div className="flex items-center gap-3">
                            <Image className="size-4 flex-shrink-0" src={x.img} />
                            <h1>{x.label}</h1>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {props.children}
            </div>
          </div>
        </Collapse>
        <div className={`${(!props.showHighlight || !(payload?.comments?.length || 0)) && 'hidden'} flex gap-3 rounded-lg border p-3.5`}>
          <Image src={payload?.comments?.[0]?.user?.picture} className="size-9 rounded-full" />
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                <span className="font-bold">{payload?.comments?.[0]?.user?.name}</span>
                <Icons.LuBadgeCheck className={`${!payload?.comments?.[0]?.user?.is_verified && 'hidden'} flex-shrink-0 fill-primary text-lg text-white`} />
              </div>
              <span className="text-shade text-[13px]"> • {dayjs(payload?.comments?.[0]?.created_at).calendar(dayjs())}</span>
              <div className="badge badge-sm ml-auto !border-gray-300">highlight</div>
            </div>
            <Markdown className="line-clamp-2 max-[490px]:!text-[15px]" text={payload?.comments?.[0]?.content} />
          </div>
        </div>
      </div>
    </article>
  );
});

export default PostsCard;
