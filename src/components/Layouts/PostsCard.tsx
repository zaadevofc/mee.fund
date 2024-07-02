import { LuBadgeCheck, LuBan, LuBarChart2, LuBookmark, LuCopy, LuHeart, LuMegaphone, LuMessageSquare, LuMoreHorizontal, LuRepeat, LuShare, LuThumbsDown, LuUserPlus } from 'react-icons/lu';
import Image from '../Services/Image';
import ImageContainer from '../Services/ImageContainer';
import Markdown from '../Services/Markdown';
import { ReactNode, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Collapse } from 'react-collapse';

let actionsMark = [
  ['hover:text-red-500', '[&_svg]:fill-red-500 text-red-500'],
  ['hover:text-blue-500', ''],
  ['hover:text-green-500', 'text-green-500'],
  ['hover:text-purple-500', ''],
  ['hover:text-sky-500', '[&_svg]:fill-sky-500 text-sky-500'],
];

let shareList = [
  { label: 'WhatsApp', click: '', img: 'https://seeklogo.com/images/W/whatsapp-icon-logo-BDC0A8063B-seeklogo.com.png' },
  { label: 'Facebook', click: '', img: 'https://seeklogo.com/images/F/facebook-logo-0AA7913C4D-seeklogo.com.png' },
  { label: 'Telegram', click: '', img: 'https://seeklogo.com/images/T/telegram-logo-38987D01C4-seeklogo.com.png' },
  { label: 'Pinterest', click: '', img: 'https://seeklogo.com/images/P/pinterest-logo-35F0AD2195-seeklogo.com.png' },
  { label: 'LinkedIn', click: '', img: 'https://seeklogo.com/images/L/linkedin-logo-F209489167-seeklogo.com.png' },
];

let optionsList = [
  { icon: LuUserPlus, label: 'Ikuti @zaadevofc', click: '' },
  { icon: LuBan, label: 'Bisukan @zaadevofc', click: '' },
  { icon: LuMegaphone, label: 'Laporkan Postingan', click: '' },
  { icon: LuThumbsDown, label: 'Tidak Tertarik', click: '' },
];

type PostsCardType = {
  columnStyle?: boolean;
  cleanStyle?: boolean;
  showHighlight?: boolean;
  showSideOutline?: boolean;
  showSideDots?: boolean;
  allowCollapse?: boolean;
  payload?: unknown;
  children?: ReactNode;
};

const PostsCard = (props: PostsCardType) => {
  const [isActions, setActions] = useState({ likes: false, reposts: false, bookmarks: false });
  const [isCollapse, setCollapse] = useState(true);

  const router = useRouter();
  const { data: user } = useSession() as any;

  const hasLike = true;
  const indicator = (has: boolean, actions: keyof typeof isActions) => (has ? (!isActions[actions] ? -1 : 0) : isActions[actions] ? 1 : 0);
  const makeActions = (actions: keyof typeof isActions) => setActions(x => ({ ...x, [actions]: !x[actions] }));

  const actionsList = [
    {
      icon: LuHeart,
      value: ['731', 'likes'],
      active: indicator(hasLike, 'likes'),
      click: makeActions,
    },
    {
      icon: LuMessageSquare,
      value: ['84', ''],
      click: makeActions,
    },
    {
      icon: LuRepeat,
      value: ['45', 'reposts'],
      active: indicator(hasLike, 'reposts'),
      click: makeActions,
    },
    {
      icon: LuBarChart2,
      value: ['564', ''],
      click: makeActions,
    },
    {
      icon: LuBookmark,
      value: ['564', 'bookmarks'],
      active: indicator(hasLike, 'bookmarks'),
      click: makeActions,
    },
  ];

  return (
    <>
      <article
        onClick={e => {
          e.stopPropagation();
          router.push('/post/vZyhVFeMYGeU');
        }}
        className={`${!props.cleanStyle && 'border p-3.5 hover:bg-[#fbfbfb]'} group flex cursor-pointer flex-col rounded-lg bg-white`}
      >
        <div className="flex flex-col gap-2">
          <div className="relative flex items-center gap-3">
            <div
              onClick={e => {
                e.stopPropagation();
                props.allowCollapse && setCollapse(x => !x);
              }}
              className={`${!props.allowCollapse && 'hidden'} absolute -left-8 -top-3 size-8 cursor-pointer rounded-bl-xl border-b-2 border-l-2 border-gray-400 hover:border-gray-600`}
            />
            <Image className="size-9 rounded-full" />
            <div className="flex w-full flex-col">
              <div className="flex gap-1">
                <div className="flex items-center gap-0.5">
                  <span className="font-bold">zaadevofc</span>
                  <LuBadgeCheck className="flex-shrink-0 fill-primary text-lg text-white" />
                </div>
                <span className="text-shade"> • kemarin</span>
                <div className="dropdown dropdown-end ml-auto">
                  <div tabIndex={0} className="text-shade cursor-pointer text-base">
                    <LuMoreHorizontal className="flex-shrink-0" />
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
              <small className="text-shade-0">CODING</small>
            </div>
          </div>
          <Collapse isOpened={isCollapse}>
            <div className="flex h-full">
              <div className={`${props.columnStyle && 'hidden'} flex w-12 flex-shrink-0 flex-col`}>
                <div className={`${!props.showSideOutline && 'hidden'} ml-4 h-full w-[1px] bg-gray-300`} />
                <div className={`${!props.showSideDots && 'hidden'} ml-2.5 h-3 w-3 rounded-full bg-primary-content`} />
              </div>
              <div className={`flex flex-col gap-2`}>
                <div className="flex flex-col gap-3">
                  <Markdown
                    text={
                      'Elit nisi irure 🤩💌⭐✨✨ **nulla** deserunt quis aute exercitation dolore occaecat labore do. Velit elit tempor enim est ea aute. Officia magna exercitation elit id nulla aute aute sit officia anim labore. Quis ullamco aliquip minim Lorem id Lorem ad.'
                    }
                  />
                  <ImageContainer media={[]} />
                </div>

                <div className="mt-1 flex items-center gap-8 border-t pb-1 pt-3">
                  {actionsList.slice(0, -1).map((x, i) => (
                    <div
                      onClick={e => {
                        e.stopPropagation();
                        x?.click(x.value[1] as any);
                      }}
                      key={i}
                      className={`${actionsMark[i][0]} ${x.active && actionsMark[i][1]} text-shade flex cursor-pointer items-center gap-1.5 text-base`}
                    >
                      <x.icon className="flex-shrink-0" />
                      <small>{x.value[0]}</small>
                    </div>
                  ))}

                  <div className="ml-auto flex items-center gap-2">
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
                            <x.icon className="flex-shrink-0" />
                          </div>
                        )
                    )}
                    <div className="dropdown dropdown-end">
                      <div tabIndex={0} className="text-shade cursor-pointer text-base">
                        <LuShare className="flex-shrink-0" />
                      </div>
                      <ul tabIndex={0} className="menu dropdown-content z-[1] w-max rounded-box border bg-base-100 p-2 font-bold drop-shadow-xl">
                        <li>
                          <div className="flex items-center gap-3">
                            <LuCopy className="flex-shrink-0 text-base" />
                            <h1>Copy Link</h1>
                          </div>
                        </li>
                        {shareList.map((x, i) => (
                          <li key={i}>
                            <div className="flex items-center gap-3">
                              <img className="size-4 flex-shrink-0" src={x.img} />
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
          <div className={`${!props.showHighlight && 'hidden'} flex gap-3 rounded-lg border p-3.5`}>
            <Image className="size-9 rounded-full" />
            <div className="flex w-full flex-col gap-1">
              <div className="flex gap-1">
                <div className="flex items-center gap-0.5">
                  <span className="font-bold">zaadevofc</span>
                  <LuBadgeCheck className="flex-shrink-0 fill-primary text-lg text-white" />
                </div>
                <span className="text-shade"> • kemarin</span>
                <div className="badge badge-sm ml-auto !border-gray-300">highlight</div>
              </div>
              <Markdown
                className="line-clamp-2"
                text={
                  'Elit nisi irure 🤩💌⭐✨✨ **nulla** deserunt quis aute exercitation dolore occaecat labore do. Velit elit tempor enim est ea aute. Officia magna exercitation elit id nulla aute aute sit officia anim labore. Quis ullamco aliquip minim Lorem id Lorem ad.'
                }
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default PostsCard;
