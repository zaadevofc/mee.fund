'use client';
import ScrollContainer from 'react-indiana-drag-scroll';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { PhotoViewProps } from 'react-photo-view/dist/PhotoView';
import 'react-photo-view/dist/react-photo-view.css';
import { cn } from '~/libs/tools';
import Image from './Image';
import VideoPlayer from './VideoPlayer';

type ImageContainerType = {
  id?: string;
  className?: string;
  media?: { src: string; type: string }[];
  small?: boolean;
  videoAutoPlay?: boolean;
  triggers?: PhotoViewProps['triggers'];
  onMediaClick?: (media: ImageContainerType['media'], index: number) => void;
  onMediaDoubleClick?: (media: string, index: number) => void;
};

const ImageContainer = (props: ImageContainerType) => {
  const temp = [
    { src: '/posts.jpg', type: 'image/webp' },
    { src: '/posts.jpg', type: 'image/webp' },
    { src: '/posts.jpg', type: 'image/webp' },
    // { src: '/posts-1.webp', type: 'image/webp' },
    // { src: '/posts-2.jpg', type: 'image/webp' },
  ];

  const IMGL = props?.media?.length || 0;
  if (IMGL === 0) return null;

  return (
    <PhotoProvider maskOpacity={0.9} className={cn(IMGL == 0 && 'hidden')}>
      <ScrollContainer className={cn(`flex gap-0.5 overflow-x-auto`, props.className)}>
        {props?.media?.map((x: any, i) => (
          <div
            key={i}
            onClick={e => e.stopPropagation()}
            className={cn(
              `relative w-full flex-shrink-0 cursor-grab overflow-hidden rounded-lg border active:scale-[.94] active:cursor-grabbing`,
              props.small ? 'max-h-[50dvh]' : 'max-h-[70dvh]',
              IMGL > 1 && (props.small ? 'max-h-[40dvh]' : 'max-h-[50dvh]'),
              IMGL > 3 && (props.small ? 'max-h-[30dvh]' : 'max-h-[40dvh]')
            )}
          >
            <PhotoView src={x.src} triggers={props.triggers ?? (['onClick'] as any)}>
              {x.type.startsWith('image/') && (
                <Image
                  onClick={(e: any) => {
                    props.onMediaClick?.(x, i);
                  }}
                  src={x.src}
                  className="h-auto w-fit object-contain"
                  onDoubleClick={() => props.onMediaDoubleClick?.(x, i)}
                  alt={`Image ${i + 1}`}
                />
              )}
            </PhotoView>
            {x.type.startsWith('video/') && (
              <VideoPlayer
                autoPlay={props.videoAutoPlay}
                mimetype={x.type}
                id={x.src + props.id}
                src={x.src}
                // className="h-auto max-h-full w-auto max-w-full object-contain"
              />
            )}
          </div>
        ))}
      </ScrollContainer>
    </PhotoProvider>
  );
};

export default ImageContainer;
