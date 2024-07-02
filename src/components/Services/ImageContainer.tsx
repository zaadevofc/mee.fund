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

  const containerClass = props.small ? 'w-40 max-h-60' : 'w-full max-h-96';

  return (
    <ScrollContainer className={`${props.className || ''} flex gap-2 overflow-x-auto`}>
      {props.media?.map((x: any, i) => (
        <PhotoView key={i} src={x.src} triggers={props.triggers ?? ['onClick']}>
          <Suspense fallback={<div className="loading h-40 w-40"></div>}>
            <div className={`${containerClass} flex-shrink-0 overflow-hidden rounded-xl border`}>
              {x.type.startsWith('image/') && (
                <Image src={x.src} className="h-auto w-full object-cover" onClick={() => props.onMediaClick?.(x, i)} onDoubleClick={() => props.onMediaDoubleClick?.(x, i)} alt={`Image ${i + 1}`} />
              )}
              {x.type.startsWith('video/') && <ReactPlayer url={x.src} width="100%" height="100%" controls loop muted />}
            </div>
          </Suspense>
        </PhotoView>
      ))}
    </ScrollContainer>
  );
};

export default ImageContainer;
