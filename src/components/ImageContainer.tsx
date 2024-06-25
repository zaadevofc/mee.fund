"use client";

import ScrollContainer from "react-indiana-drag-scroll";
import { PhotoView } from "react-photo-view";
import Image from "./Image";
import { PhotoViewProps } from "react-photo-view/dist/PhotoView";

type ImageContainerType = {
  media?: string[];
  triggers?: PhotoViewProps["triggers"];
  onMediaClick?: (media: string, index: number) => void;
  onMediaDoubleClick?: (media: string, index: number) => void;
};

const ImageContainer = (props: ImageContainerType) => {
  const IMGL = props.media?.length || 0;

  return (
    <>
      <ScrollContainer
        className={`${
          IMGL > 2 ? "flex items-center" : IMGL > 1 ? "grid grid-cols-2" : ""
        } items-center gap-2 overflow-x-scroll`}
      >
        {props.media?.map((x, i) => (
          <PhotoView key={i} src={x} triggers={props.triggers ?? ['onClick']}>
            <Image
              onClick={() => props.onMediaClick && props.onMediaClick(x, i)}
              onDoubleClick={() => props.onMediaDoubleClick && props.onMediaDoubleClick(x, i)}
              className={`max-h-[400px] w-fit cursor-grab rounded-lg border border-gray-300 active:cursor-grabbing ${
                IMGL > 2
                  ? "object-cover [@media_(min-height:_401px)]:w-auto"
                  : IMGL > 1
                    ? "object-cover [@media_(min-height:_401px)]:w-full"
                    : "object-contain [@media_(min-height:_401px)]:w-auto"
              } active:scale-[.96] [@media_(min-height:_401px)]:h-full`}
              src={x}
            />
          </PhotoView>
        ))}
      </ScrollContainer>
    </>
  );
};

export default ImageContainer;
