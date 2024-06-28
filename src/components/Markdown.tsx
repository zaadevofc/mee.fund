"use client";

import Link from "next/link";
import { default as MarkdownWrapper } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ghcolors } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { RAINBOW_TEXT } from "~/consts";

const Markdown = ({ text, className }: any) => {
  let rainbowText = RAINBOW_TEXT;
  let txt = (text as string) || "";

  txt = txt.replace(
    new RegExp(rainbowText.join("|"), "gi"),
    (match) => `<span class='textmark-rainbow'>${match}</span>`,
  );

  txt = txt.replace(
    new RegExp("indonesia", "gi"),
    (match) => `<span class='textmark-indonesia'>${match}</span>`,
  );

  txt = txt.replace(/#(\w+)/gi, `<a href='/tags/$1'>‎#$1</a>`);
  txt = txt.replace(/@(\w+)/gi, `<a href='/@$1' class='font-medium'>@$1</a>`);

  return (
    <div
      className={className + " markdown break-word w-full whitespace-pre-wrap"}
    >
      <MarkdownWrapper
        rehypePlugins={[rehypeRaw]}
        className={
          "relative -space-y-2 [&_ul]:menu [&_li]:ml-3 [&_li]:inline-block [&_li]:before:-left-3 [&_li]:before:top-0 [&_li]:before:content-['•'] [&_ol_li]:ml-3 [&_ul_li]:before:absolute"
        }
        components={{
          a({ node, inline, className, children, ...props }: any) {
            return <Link {...props}>{children}</Link>;
          },
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                wrapLongLines
                customStyle={{
                  maxWidth: "40rem",
                  padding: "8px",
                  borderRadius: "6px",
                }}
                style={ghcolors}
                PreTag="div"
                language={match[1]}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
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
