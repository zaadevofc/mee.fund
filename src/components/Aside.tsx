"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuBadgeCheck,
  LuChevronLeft
} from "react-icons/lu";
import { POST_CATEGORY } from "~/consts";
import Markdown from "./Markdown";

const Aside = () => {
  const { data: user }: any = useSession();
  const path = usePathname();

  return (
    <>
      <aside className="mt-3">
        <div className="hide-scroll sticky top-0 mb-5 flex h-max max-h-screen w-full max-w-xs flex-col overflow-auto">
          <div className="flex flex-col gap-4">
            <Link
              href={`/@${user?.username}`}
              className={`flex w-full items-start gap-3 rounded-lg border ${path == `/@${user?.username}` && "border-primary-content"} bg-white p-3 active:scale-[.96]`}
            >
              <div className="flex-shrink-0">
                <img
                  className="w-10 rounded-full border"
                  src="https://avatars.githubusercontent.com/u/93970726?v=4"
                  width={100}
                  height={100}
                />
              </div>
              <div className="flex w-fit flex-col">
                <div className="flex items-center gap-0.5">
                  <strong>zaadevofc</strong>
                  <LuBadgeCheck className="fill-green-400 stroke-white text-base" />
                </div>
                <span className="flex items-center gap-2 text-sm opacity-60">
                  <Markdown
                    className={`leading-tight line-clamp-2`}
                    text={`Ilmu bisa di cari tetapi ilmu tanpa adab _hanyalah_ **batu.**`}
                  />
                </span>
              </div>
            </Link>
            <div className="flex flex-col gap-3">
              {POST_CATEGORY.map((x, i) => {
                return (
                  <Link href={x.href} className="group flex items-center gap-3">
                    <div
                      className={`${
                        path == x.href
                          ? "bg-primary [&>svg]:stroke-white"
                          : "bg-base-200 group-hover:bg-primary-content"
                      } mask mask-squircle flex items-center justify-center p-1.5`}
                    >
                      <x.icon className="stroke-[1.7] text-xl" />
                    </div>
                    <h1
                      className={`${
                        path == x.href
                          ? "font-medium"
                          : "opacity-70 group-hover:font-medium group-hover:opacity-100"
                      }`}
                    >
                      {x.label}
                    </h1>
                    <LuChevronLeft className="ml-auto" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Aside;
