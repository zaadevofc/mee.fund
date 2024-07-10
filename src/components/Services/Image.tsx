import React, { HTMLAttributes, ImgHTMLAttributes } from 'react';
import { default as NextImage } from 'next/image';

const Image = ({ ...props }: any) => {
  return (
    <>
      <NextImage
        loading="lazy"
        placeholder="blur"
        blurDataURL="/assets/defaults/thumbnails/blur-data-image.jpg"
        width={500}
        height={500}
        {...props}
        {...(!props.alt && { alt: 'MeeFund - Cari hal seru sambil cari ilmu!' })}
        {...(!props.src && { src: '/assets/defaults/thumbnails/empty-picture.webp' })}
      />
    </>
  );
};

export default Image;
