'use client';
import ScrollContainer from 'react-indiana-drag-scroll';
import { PhotoView } from 'react-photo-view';
import Image from './Image';
import ReactPlayer from 'react-player/lazy';
import { PhotoViewProps } from 'react-photo-view/dist/PhotoView';
import { Suspense } from 'react';

type ImageContainerType = {
  className?: string;
  media?: { src: string; type: string }[];
  small?: boolean;
  triggers?: PhotoViewProps['triggers'];
  onMediaClick?: (media: ImageContainerType['media'], index: number) => void;
  onMediaDoubleClick?: (media: string, index: number) => void;
};

const ImageContainer = (props: ImageContainerType) => {
  const IMGL = props.media?.length || 0;
  if (IMGL === 0) return null;

  return (
    <ScrollContainer className={`${props.className || ''} flex gap-2 overflow-x-auto`}>
      {props.media?.map((x: any, i) => (
        <PhotoView key={i} src={x.src} triggers={props.triggers ?? ['onClick']}>
          <Suspense fallback={<div className="loading h-auto w-auto"></div>}>
            <div className={`flex-shrink-0 overflow-hidden rounded-lg border media-container`}>
              {x.type.startsWith('image/') && (
                <Image
                  src={x.src}
                  className="media-item"
                  onClick={() => props.onMediaClick?.(x, i)}
                  onDoubleClick={() => props.onMediaDoubleClick?.(x, i)}
                  alt={`Image ${i + 1}`}
                />
              )}
              {x.type.startsWith('video/') && (
                <ReactPlayer 
                  url={x.src} 
                  width="100%" 
                  height="100%" 
                  playing 
                  controls 
                  loop 
                  muted 
                  className="media-item"
                />
              )}
            </div>
          </Suspense>
        </PhotoView>
      ))}
    </ScrollContainer>
  );
};

export default ImageContainer;