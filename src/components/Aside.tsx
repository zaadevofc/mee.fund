"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuBadgeCheck, LuChevronLeft } from "react-icons/lu";
import { POST_CATEGORY } from "~/consts";
import Markdown from "./Markdown";
import Image from "./Image";

const Aside = () => {
  const { data: user }: any = useSession();
  const path = usePathname();

  return (
    <>
      <aside className="mt-3 w-full max-w-[16rem]">
        <div className="hide-scroll sticky top-0 mb-5 flex h-dvh w-full flex-col overflow-auto">
          <div className="flex flex-col gap-4">
            <Link
              href={`/@${user?.username}`}
              className={`flex w-full items-start gap-3 rounded-lg border ${path == `/@${user?.username}` && "border-primary-content"} bg-white p-3 active:scale-[.96]`}
            >
              <div className="flex-shrink-0">
                <Image
                  className="size-10 rounded-full border"
                  src={
                    user?.picture ??
                    "/assets/defaults/thumbnails/empty-picture.webp"
                  }
                  width={100}
                  height={100}
                  alt={`@${user?.username} profile picture`}
                />
              </div>
              <div className="flex w-full flex-col">
                <div className="flex items-center gap-0.5">
                  <strong className="line-clamp-1">{user?.name}</strong>
                  <LuBadgeCheck
                    className={`${user?.is_verified && "!block"} hidden fill-green-400 stroke-white text-lg`}
                  />
                </div>
                <span className="flex items-center gap-2 text-sm opacity-60">
                  <Markdown
                    className={`line-clamp-2 leading-tight`}
                    text={!!user?.bio ? user?.bio : "_Klik untuk tambah bio_"}
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