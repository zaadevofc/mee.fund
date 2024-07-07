'use client';

import Link from 'next/link';
import { default as MarkdownWrapper } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import rehypeRaw from 'remark-breaks';
import remarkBreaks from 'remark-breaks';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { RAINBOW_TEXT } from '~/consts';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

const Markdown = ({ text, className, children }: any) => {
  let rainbowText = RAINBOW_TEXT;
  let txt = ((text || children) as string) || '';

  txt = txt.replace(new RegExp(rainbowText.join('|'), 'gi'), match => `<span class='textmark-rainbow'>${match}</span>`);
  txt = txt.replace(new RegExp('indonesia', 'gi'), match => `<span class='textmark-indonesia'>${match}</span>`);
  txt = txt.replace(/#(\w+)/gi, `<a href='/tags/$1'>‎#$1</a>`);
  txt = txt.replace(/@(\w+)/gi, `<a href='/@$1' className='font-bold'>@$1</a>`);

  return (
    <div className={className + ' markdown'}>
      <MarkdownWrapper
        rehypePlugins={[rehypeSanitize, rehypeRaw, rehypeKatex]}
        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
        className={'whitespace-pre-wrap break-words leading-[21px]'}
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
