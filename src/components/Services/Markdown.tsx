'use client';

import MarkdownPreview from '@uiw/react-markdown-preview';
import remarkBreaks from 'remark-breaks';
import { RAINBOW_TEXT } from '~/consts';
import { cn } from '~/libs/tools';

const Markdown = ({ text, className, children }: any) => {
  let rainbowText = RAINBOW_TEXT;
  let txt = ((text || children) as string) || '';

  txt = txt.replace(new RegExp(rainbowText.join('|'), 'gi'), match => `<span className='textmark-rainbow'>${match}</span>`);
  txt = txt.replace(new RegExp('indonesia', 'gi'), match => `<span className='textmark-indonesia'>${match}</span>`);
  txt = txt.replace(/#(\w+)/gi, `<a href='/tags/$1' className='font-medium'>‎#$1</a>`);
  txt = txt.replace(/@(\w+)/gi, `<a href='/@$1' className='font-medium'>@$1</a>`);

  return (
      <MarkdownPreview
        source={txt}
        remarkPlugins={[remarkBreaks]}
        urlTransform={url => url}
        wrapperElement={{
          'data-color-mode': 'light'
        }}
        className={cn('!break-words w-full max-w-fit !bg-transparent markdown !text-[15px] !leading-[22px]', className)}
      />
  );
};

export default Markdown;
