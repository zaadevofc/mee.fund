import React from "react";
import { default as NextImage } from "next/image";

const Image = (props: Partial<React.ImgHTMLAttributes<HTMLImageElement>>) => {
  return (
    <>
      <NextImage
        loading="lazy"
        placeholder="blur"
        blurDataURL="/assets/defaults/thumbnails/blur-data-image.jpg"
        alt="MeeFund - Cari hal seru sambil cari ilmu!"
        width={500}
        height={500}
        {...props as any}
      />
    </>
  );
};

export default Image;
