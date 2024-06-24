"use client";

import { default as MarkdownWrapper } from "markdown-to-jsx";
import Link from "next/link";
import { RAINBOW_TEXT } from "~/consts";

const Markdown = ({ text, className }: any) => {
  let rainbowText = RAINBOW_TEXT;
  let txt = text as string || '';

  txt = txt.replace(
    new RegExp(rainbowText.join("|"), "gi"),
    (match) => `<span class='textmark-rainbow'>${match}</span>`,
  );

  txt = txt.replace(
    new RegExp("indonesia", "gi"),
    (match) => `<span class='textmark-indonesia'>${match}</span>`,
  );

  txt = txt.replace(
    /#(\w+)/g,
    `<a href='/tags/$1'>&nbsp;‎#$1</a>`,
  )
  txt = txt.replace(/@(\w+)/g, `<a href='/@$1' class='font-medium'>@$1</a>`);

  return (
    <>
      <MarkdownWrapper
        className={className + " whitespace-pre-wrap text-pretty"}
        options={{
          wrapper: "p",
          overrides: {
            a: {
              component: Link,
            },
          },
        }}
      >
        {txt}
      </MarkdownWrapper>
    </>
  );
};

export default Markdown;
