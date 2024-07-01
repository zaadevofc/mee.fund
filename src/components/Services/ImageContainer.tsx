"use client";
import ScrollContainer from "react-indiana-drag-scroll";
import { PhotoView } from "react-photo-view";
import Image from "./Image";
import { PhotoViewProps } from "react-photo-view/dist/PhotoView";
import { Suspense } from "react";

type ImageContainerType = {
  className?: string;
  media?: string[];
  triggers?: PhotoViewProps["triggers"];
  onMediaClick?: (media: string, index: number) => void;
  onMediaDoubleClick?: (media: string, index: number) => void;
};

const ImageContainer = (props: ImageContainerType) => {
  const IMGL = props.media?.length || 0;

  let imgClass = IMGL > 1 ? "max-w-[350px]" : "max-w-[500px]";
  imgClass +=
    " max-h-[500px] [@media_(min-height:_401px)]:w-auto [@media_(min-height:_401px)]:h-auto";

  if (IMGL > 0)
    return (
      <ScrollContainer
        className={
          props.className +
          " mt-2 flex w-full max-w-[35.4rem] gap-0.5 overflow-x-auto rounded-xl"
        }
      >
        {props.media?.map((x, i) => (
          <PhotoView key={i} src={x} triggers={props.triggers ?? ["onClick"]}>
            <Suspense
              fallback={
                <div className="flex p-4">
                  <div className="loading m-auto"></div>
                </div>
              }
            >
              <Image
                className={
                  imgClass + " flex-none rounded-xl border object-cover"
                }
                onClick={() => props.onMediaClick && props.onMediaClick(x, i)}
                onDoubleClick={() =>
                  props.onMediaDoubleClick && props.onMediaDoubleClick(x, i)
                }
                src={x}
              />
            </Suspense>
          </PhotoView>
        ))}
      </ScrollContainer>
    );
};

export default ImageContainer;
