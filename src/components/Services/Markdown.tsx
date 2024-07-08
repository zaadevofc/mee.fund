'use client';

import 'katex/dist/katex.min.css';
import Link from 'next/link';
import { default as MarkdownWrapper } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize from 'rehype-sanitize';
import { default as rehypeRaw, default as remarkBreaks } from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { RAINBOW_TEXT } from '~/consts';
import { cn } from '~/libs/tools';

const Markdown = ({ text, className, children }: any) => {
  let rainbowText = RAINBOW_TEXT;
  let txt = ((text || children) as string) || '';

  txt = txt.replace(new RegExp(rainbowText.join('|'), 'gi'), match => `<span class='textmark-rainbow'>${match}</span>`);
  txt = txt.replace(new RegExp('indonesia', 'gi'), match => `<span class='textmark-indonesia'>${match}</span>`);
  txt = txt.replace(/#(\w+)/gi, `<a href='/tags/$1'>‎#$1</a>`);
  txt = txt.replace(/@(\w+)/gi, `<a href='/@$1' className='font-bold'>@$1</a>`);

  return (
    <div className={cn('markdown whitespace-pre-wrap break-words leading-[21px]', className)}>
      <MarkdownWrapper
        rehypePlugins={[rehypeSanitize, rehypeRaw, rehypeKatex]}
        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
        components={{
          a({ node, inline, className, children, ...props }: any) {
            return <Link {...props}>{children}</Link>;
          },
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                wrapLongLines
                customStyle={{
                  padding: '0px',
                  borderRadius: '.5rem',
                  fontSize: '12px',
                  border: '1px solid #d0d7de',
                }}
                style={coy}
                PreTag="div"
                language={match[1]}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {txt}
      </MarkdownWrapper>
    </div>
  );
};

export default Markdown;
