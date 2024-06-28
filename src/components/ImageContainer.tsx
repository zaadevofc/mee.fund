"use client";
import ScrollContainer from "react-indiana-drag-scroll";
import { PhotoView } from "react-photo-view";
import Image from "./Image";
import { PhotoViewProps } from "react-photo-view/dist/PhotoView";

type ImageContainerType = {
  className?: string;
  media?: string[];
  triggers?: PhotoViewProps["triggers"];
  onMediaClick?: (media: string, index: number) => void;
  onMediaDoubleClick?: (media: string, index: number) => void;
};

const ImageContainer = (props: ImageContainerType) => {
  const IMGL = props.media?.length || 0;
  const extendClass =
    IMGL == 1
      ? "[&_img]:max-h-[400px] [&_img]:rounded-lg !w-fit"
      : IMGL == 2
        ? "grid grid-cols-2"
        : IMGL == 3
          ? "flex"
          : IMGL == 4
            ? "grid grid-cols-2"
            : "flex overflow-x-scrool";

  const imgClass =
    (IMGL % 2 != 0 || IMGL > 4) &&
    " max-w-sm !w-fit" +
      "[@media_(min-height:_401px)]:w-auto [@media_(min-height:_401px)]:h-auto";

  if (IMGL > 0)
    return (
      <ScrollContainer
        className={
          props.className + " h-full w-fit overflow-x-scroll rounded-lg"
        }
      >
        <div
          className={`${props.className} ${extendClass} h-full max-h-[400px] w-full divide-x divide-y overflow-hidden rounded-lg border`}
        >
          {props.media?.map((x, i) => (
            <PhotoView key={i} src={x} triggers={props.triggers ?? ["onClick"]}>
              <Image
                className={imgClass + " h-full w-full object-cover"}
                onClick={() => props.onMediaClick && props.onMediaClick(x, i)}
                onDoubleClick={() =>
                  props.onMediaDoubleClick && props.onMediaDoubleClick(x, i)
                }
                src={x}
              />
            </PhotoView>
          ))}
        </div>
      </ScrollContainer>
    );
};

export default ImageContainer;
