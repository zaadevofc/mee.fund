"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IoBookmarkOutline,
  IoChatbubbleOutline,
  IoEllipsisHorizontal,
} from "react-icons/io5";
import { LuArrowBigUp, LuArrowLeft, LuBadgeCheck } from "react-icons/lu";
import ScrollContainer from "react-indiana-drag-scroll";
import { PhotoView } from "react-photo-view";
import FormInputCard from "~/components/FormInputCard";
import Markdown from "~/components/Markdown";
import Wrapper from "~/components/Wrapper";
import { dayjs } from "~/libs/tools";

const actionPostLits = [
  {
    icon: LuArrowBigUp,
    value: "243",
    color: "bg-success/10",
  },
  {
    icon: IoChatbubbleOutline,
    value: "455",
    color: "bg-info/10",
  },
  {
    icon: IoBookmarkOutline,
    value: "224",
    color: "bg-secondary/10",
  },
];
const IMGL = 2;
const NestedC = ({ children }: any) => (
  <div className="relative flex gap-2 py-3">
    <div className="absolute -left-[27px] -top-2 size-10 rounded-bl-xl border-b border-l border-b-primary border-l-primary" />
    <Link href={"/s"} className="z-[1]">
      <img
        className="h-fit w-10 rounded-full border border-primary"
        src="https://avatars.githubusercontent.com/u/93970726?v=4"
        width={100}
        height={100}
      />
    </Link>
    <div className="flex w-fit flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="relative flex flex-col gap-3">
          <div className="absolute -bottom-12 -left-[27px] h-full w-2 border-l border-l-primary-content" />

          <div className="-mb-2 flex items-center gap-1">
            <Link href={"/s"} className="flex items-center gap-0.5">
              <strong>zaadevofc</strong>
              <LuBadgeCheck className="fill-green-400 stroke-white text-base" />
            </Link>
            <span className="text-sm opacity-60">
              • @zaadevofc • {dayjs().calendar(dayjs())}
            </span>
          </div>
          <div>
            <Markdown
              className={`leading-[21px]`}
              text={`Pas itu pernah coba make nextjs eh malah tekorr pricing nya meledak parah wkwkwkkw bikin rugi... Pas itu pernah coba make nextjs eh malah tekorr pricing nya meledak parah wkwkwkkw bikin rugi...Pas itu pernah coba make nextjs eh malah tekorr pricing nya meledak parah wkwkwkkw bikin rugi...Pas itu pernah coba make nextjs eh malah tekorr pricing nya meledak parah wkwkwkkw bikin rugi...`}
            />
          </div>
          <ScrollContainer
            className={` ${
              IMGL > 2
                ? "flex items-center"
                : IMGL > 1
                  ? "grid grid-cols-2"
                  : ""
            } hidden items-center gap-2 overflow-x-scroll`}
          >
            {Array.from({ length: IMGL }).map((x, i) => (
              <PhotoView src={"/posts.jpg"}>
                <img
                  className={`max-h-[400px] w-fit cursor-grab rounded-lg border border-gray-300 active:cursor-grabbing ${
                    IMGL > 2
                      ? "object-cover [@media_(min-height:_401px)]:w-auto"
                      : IMGL > 1
                        ? "object-cover [@media_(min-height:_401px)]:w-full"
                        : "object-contain [@media_(min-height:_401px)]:w-auto"
                  } active:scale-[.96] [@media_(min-height:_401px)]:h-full`}
                  src={"/posts.jpg"}
                  width={500}
                  height={500}
                />
              </PhotoView>
            ))}
          </ScrollContainer>
        </div>
        <div className="mt-1 flex items-center gap-5 text-lg">
          {actionPostLits.slice(0, 2).map((x, i) => (
            <div
              className={`group relative flex items-center ${i > 0 ? "gap-1.5" : "gap-1"}`}
            >
              <div
                className={`absolute -left-1.5 flex h-full w-[130%] cursor-pointer rounded-lg ${x.color} z-[1] opacity-0 group-hover:opacity-100`}
              />
              <div>
                <x.icon
                  className={`stroke-[1.1] ${i > 0 ? "text-lg" : "text-2xl"}`}
                />
              </div>
              {x.value && <span className="text-[13px]">{x.value}</span>}
            </div>
          ))}
          <div className="btn btn-ghost btn-xs ml-auto">
            <IoEllipsisHorizontal />
          </div>
        </div>
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  </div>
);

const PostDetailPage = () => {
  const router = useRouter();

  return (
    <>
      <Wrapper>
        <div className="flex items-center gap-4">
          <h1 onClick={() => router.back()} className="btn btn-xs">
            <LuArrowLeft />
          </h1>
          <div className="btn btn-ghost btn-xs ml-auto">
            <IoEllipsisHorizontal />
          </div>
        </div>
        <div className={`flex flex-col ${IMGL >= 1 ? "gap-4" : "gap-2"}`}>
          <div className="flex w-full gap-2">
            <div className="flex flex-col items-center gap-3">
              <Link href={"/s"}>
                <img
                  className="h-fit w-10 rounded-full border"
                  src="https://avatars.githubusercontent.com/u/93970726?v=4"
                  width={100}
                  height={100}
                />
              </Link>
            </div>
            <div className="flex w-fit flex-col gap-4">
              <div className="-mb-2 flex flex-col">
                <div className="flex items-center gap-1">
                  <Link href={"/s"} className="flex items-center gap-0.5">
                    <strong>zaadevofc</strong>
                    <LuBadgeCheck className="fill-green-400 stroke-white text-base" />
                  </Link>
                  <span className="text-sm opacity-60">• @zaadevofc</span>
                </div>
                <small>
                  <Link href={"/s"}>
                    <span className="text-primary">SMA</span> •{" "}
                  </Link>
                  <span className="opacity-60">
                    {dayjs().calendar(dayjs())}
                  </span>
                </small>
              </div>
            </div>
          </div>
          <div>
            <Markdown
              className={`leading-[21px]`}
              text={`_Lorem ipsum kolor bapak mu_ **Nostrud sit ex id** eiusmod sint. In sint tempor labore eu do ea ipsum velit et aliquip cillum elit. Esse consectetur exercitation ea dolor nostrud mollit minim. Velit proident occaecat do commodo pariatur culpa ut adipisicing minim mollit non consectetur quis. Sit anim aliqua veniam magna eiusmod amet pariatur. Aute nulla ex Lorem nostrud magna laborum consequat incididunt velit eu elit labore. Irure nisi commodo anim ipsum tempor incididunt reprehenderit proident eu ut excepteur dolore nisi ipsum. Amet fugiat velit enim duis id. Non ea qui et excepteur aliqua sit.​`}
            />
          </div>
          <ScrollContainer
            className={` ${
              IMGL > 2
                ? "flex items-center"
                : IMGL > 1
                  ? "grid grid-cols-2"
                  : ""
            } items-center gap-2 overflow-x-scroll`}
          >
            {Array.from({ length: IMGL }).map((x, i) => (
              <PhotoView src={"/posts.jpg"}>
                <img
                  className={`max-h-[400px] w-fit cursor-grab rounded-lg border border-gray-300 active:cursor-grabbing ${
                    IMGL > 2
                      ? "object-cover [@media_(min-height:_401px)]:w-auto"
                      : IMGL > 1
                        ? "object-cover [@media_(min-height:_401px)]:w-full"
                        : "object-contain [@media_(min-height:_401px)]:w-auto"
                  } active:scale-[.96] [@media_(min-height:_401px)]:h-full`}
                  src={"/posts.jpg"}
                  width={500}
                  height={500}
                />
              </PhotoView>
            ))}
          </ScrollContainer>
          <div className="grid w-fit grid-cols-5 gap-5 text-lg">
            {actionPostLits.map((x, i) => (
              <div
                className={`group relative flex items-center ${i > 0 ? "gap-1.5" : "gap-1"}`}
              >
                <div
                  className={`absolute ${i == 0 ? "-left-1.5" : "-left-2"} flex h-full w-[130%] cursor-pointer rounded-lg ${x.color} z-[1] opacity-0 group-hover:opacity-100`}
                />
                <div>
                  <x.icon
                    className={`stroke-[1.1] ${i > 0 ? "text-lg" : "text-2xl"}`}
                  />
                </div>
                {x.value && <span className="text-[13px]">{x.value}</span>}
              </div>
            ))}
          </div>
          <FormInputCard />
          <div className="flex flex-col divide-y">
            {Array.from({ length: 6 }).map((x) => (
              <NestedC>
                {actionPostLits.map((x, i) => (
                  <NestedC></NestedC>
                ))}
              </NestedC>
            ))}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default PostDetailPage;
