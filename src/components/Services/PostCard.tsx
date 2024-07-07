'use client';

import { usePathname, useRouter } from 'next/navigation';
import { DeferredContent } from 'primereact/deferredcontent';
import { Galleria } from 'primereact/galleria';
import { memo, ReactNode } from 'react';
import { GoComment, GoHeart, GoSync } from 'react-icons/go';
import Image from '~/components/Services/Image';
import Markdown from '~/components/Services/Markdown';
import { cn } from '~/libs/tools';
import ImageContainer from './ImageContainer';

type PostCardType = {
  children?: ReactNode;
  asComment?: boolean;
  payload: any;
};

const PostCard = memo((props: PostCardType) => {
  const router = useRouter();
  const path = usePathname();

  const isSelf = path.match(`/post/${props.payload?.ids}`);

  const handle = (e: any, action: void) => {
    e.stopPropagation();
    action;
  };

  const ACTION = [
    { icon: GoHeart, value: props?.payload?._count?.likes },
    { icon: GoComment, value: props?.payload?._count?.comments || props?.payload?._count?.replies },
    { icon: GoSync, value: props?.payload?._count?.reposts },
  ];

  const Content = () => (
    <div className={cn('flex flex-col gap-3', !props.asComment ? 'text-[15px]' : 'text-[14px]')}>
      {props?.payload?.content && <Markdown text={props?.payload?.content} />}
      <ImageContainer media={props?.payload?.media.map((x: any) => ({ src: x?.url, type: x?.mimetype }))} />
    </div>
  );

  return (
    <>
      <div
        onClick={e => !isSelf && handle(e, router.push(`/post/${props.payload?.ids}`))}
        className={cn('flex flex-col gap-3 pb-2 pt-4 min-[460px]:p-4 max-[460px]:px-3 min-[460px]:rounded-xl min-[460px]:border', isSelf ? 'p-4' : 'cursor-pointer', props.asComment && 'pb-2 pt-3')}
      >
        <div className={cn('flex gap-3', !props.asComment && 'items-center')}>
          <Image className={cn('rounded-lg border', props.asComment ? 'size-8' : 'size-9')} src={props.payload?.user?.picture} />
          <div className={cn('flex flex-col text-sm', props.asComment && 'gap-0.5 text-[13px]')}>
            <h1 className="font-bold">{props.payload?.user?.name}</h1>
            <p className={cn('text-xs text-secondary-300', !props.payload?.category && 'hidden')}>{props.payload?.category}</p>
            {props.asComment && <Content />}
          </div>
        </div>
        {!props.asComment && <Content />}
        <div className={cn('flex items-center gap-5', props.asComment && 'pl-10')}>
          {ACTION.slice(0, props.asComment ? -1 : 3).map(x => (
            <div className={cn('flex cursor-pointer items-center gap-1 active:scale-[.90]', props.asComment ? 'text-base' : 'text-[19px]')}>
              <x.icon />
              <h1 className="text-[13px]">{x.value || ''}</h1>
            </div>
          ))}
        </div>
        {props.asComment && !!props.payload?.replies?.length && <button className="ml-10 w-fit bg-secondary-50 text-[13px]">Lihat balasan</button>}
        <div className={cn('flex gap-2 rounded-lg border bg-secondary-50 p-2 mt-1', props.payload?.comments?.length == 0 && 'hidden', props.asComment && 'hidden')}>
          <Image className="size-8 rounded-lg border" src={props.payload?.comments?.[0]?.user?.picture} />
          <div className="flex flex-col -space-y-1 text-sm">
            <h1 className="font-semibold">{props.payload?.comments?.[0]?.user?.name}</h1>
            <Markdown className="line-clamp-2" text={props.payload?.comments?.[0]?.content} />
          </div>
        </div>
      </div>
    </>
  );
});

export default PostCard;
