'use client';
import ScrollContainer from 'react-indiana-drag-scroll';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import Image from './Image';
import ReactPlayer from 'react-player/lazy';
import { PhotoViewProps } from 'react-photo-view/dist/PhotoView';
import { ReactHTMLElement, Suspense } from 'react';
import { cn } from '~/libs/tools';

type ImageContainerType = {
  className?: string;
  media?: { src: string; type: string }[];
  small?: boolean;
  triggers?: PhotoViewProps['triggers'];
  onMediaClick?: (media: ImageContainerType['media'], index: number) => void;
  onMediaDoubleClick?: (media: string, index: number) => void;
};

const ImageContainer = (props: ImageContainerType) => {
  const temp = [
    { src: '/posts.jpg', type: 'image/' },
    { src: '/posts.jpg', type: 'image/' },
    { src: '/posts.jpg', type: 'image/' },
    { src: '/posts.jpg', type: 'image/' },
  ];

  const IMGL = temp.length || 0;
  if (IMGL === 0) return null;

  return (
    <PhotoProvider maskOpacity={0.9}>
      <ScrollContainer className={cn(`flex gap-0.5 overflow-x-auto`, props.className)}>
        {temp?.map((x: any, i) => (
          <PhotoView key={i} src={x.src} triggers={props.triggers ?? ['onClick']}>
            <div
              onClick={e => e.stopPropagation()}
              className={cn(
                `h-auto w-fit flex-shrink-0 cursor-grab overflow-hidden rounded-lg border active:scale-[.94] active:cursor-grabbing`,
                props.small ? 'max-h-[50dvh]' : 'max-h-[70dvh]',
                IMGL > 1 && (props.small ? 'max-h-[40dvh]' : 'max-h-[50dvh]'),
                IMGL > 3 && (props.small ? 'max-h-[30dvh]' : 'max-h-[40dvh]')
              )}
            >
              {x.type.startsWith('image/') && (
                <Image
                  onClick={(e: any) => {
                    // e.stopPropagation();
                    props.onMediaClick?.(x, i);
                  }}
                  src={x.src}
                  className="size-full object-cover"
                  onDoubleClick={() => props.onMediaDoubleClick?.(x, i)}
                  alt={`Image ${i + 1}`}
                />
              )}
              {x.type.startsWith('video/') && <ReactPlayer url={x.src} width="100%" height="100%" playing controls loop muted />}
            </div>
          </PhotoView>
        ))}
      </ScrollContainer>
    </PhotoProvider>
  );
};

export default ImageContainer;
