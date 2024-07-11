'use client';
import ScrollContainer from 'react-indiana-drag-scroll';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { PhotoViewProps } from 'react-photo-view/dist/PhotoView';
import 'react-photo-view/dist/react-photo-view.css';
import { cn } from '~/libs/tools';
import Image from './Image';

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
  const IMGL = props?.media?.length || 0;
  if (IMGL === 0) return null;

  return (
    <PhotoProvider maskOpacity={0.9} className={cn(IMGL == 0 && 'hidden')}>
      <ScrollContainer className={cn(`flex gap-0.5 overflow-x-auto !transition-none`, props.className)}>
        {props?.media?.map((x: any, i) => (
          <>
            <PhotoView src={x.src} triggers={props.triggers ?? (['onClick'] as any)}>
              {x.type.startsWith('image/') && (
                <Image
                  onClick={(e: any) => {
                    e.stopPropagation();
                    props.onMediaClick?.(x, i);
                  }}
                  onDoubleClick={(e: any) => {
                    e.stopPropagation();
                    props.onMediaDoubleClick?.(x, i);
                  }}
                  src={x.src}
                  className={cn('max-h-[60dvh] w-auto object-cover rounded-lg', IMGL > 2 && 'max-h-[50dvh]', props.small && 'max-h-[40dvh]')}
                  alt={`Image ${i + 1}`}
                />
              )}
            </PhotoView>
            {x.type.startsWith('video/') && (
              <video
                onClick={(e: any) => {
                  e.stopPropagation();
                  props.onMediaClick?.(x, i);
                }}
                onDoubleClick={(e: any) => {
                  e.stopPropagation();
                  props.onMediaDoubleClick?.(x, i);
                }}
                className={cn('max-h-[60dvh] w-auto rounded-lg', IMGL > 2 && 'max-h-[50dvh]', props.small && 'max-h-[40dvh]')}
                autoPlay
                muted
                loop
                src={x.src}
              ></video>
            )}
          </>
        ))}
      </ScrollContainer>
    </PhotoProvider>
  );
};

export default ImageContainer;
