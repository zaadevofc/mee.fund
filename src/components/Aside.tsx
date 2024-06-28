"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LuBadgeCheck, LuChevronLeft } from "react-icons/lu";
import { POST_CATEGORY, SEO } from "~/consts";
import Markdown from "./Markdown";
import Image from "./Image";

const Aside = () => {
  const { data: user }: any = useSession();
  const path = usePathname();
  const router = useRouter();

  return (
    <>
      <aside className="hide-scroll sticky top-3 hidden h-dvh overflow-auto w-full max-w-[3rem] flex-col gap-3 mb-10 mt-3 min-[525px]:flex min-[1200px]:max-w-[16rem]">
        <div className="flex flex-col gap-4">
          <label
            onClick={() => user && router.push(`/@${user?.username}`)}
            htmlFor={!user ? "masuk_akun_modal" : ""}
            className={`flex w-full cursor-pointer items-start gap-3 rounded-lg min-[1200px]:border ${path == `/@${user?.username}` && "border-primary-content"} bg-white active:scale-[.96] min-[1200px]:p-3`}
          >
            <div className="flex-shrink-0 overflow-hidden">
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
            <div className="hidden w-full flex-col min-[1200px]:flex">
              <div className="flex items-center gap-0.5">
                <strong className="line-clamp-1">
                  {user?.name ?? "MeeFund"}
                </strong>
                <LuBadgeCheck
                  className={`${user?.is_verified && "!block"} hidden fill-green-400 stroke-white text-lg`}
                />
              </div>
              <span className="flex items-center gap-2 text-sm opacity-60">
                <Markdown
                  className={`line-clamp-2 leading-tight`}
                  text={
                    !user
                      ? "Login ke akun MeeFund"
                      : !!user?.bio
                        ? user?.bio
                        : "_Klik untuk tambah bio_"
                  }
                />
              </span>
            </div>
          </label>
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
                    className={`hidden min-[1200px]:block ${
                      path == x.href
                        ? "font-medium"
                        : "opacity-70 group-hover:font-medium group-hover:opacity-100"
                    }`}
                  >
                    {x.label}
                  </h1>
                  <LuChevronLeft
                    className={`ml-auto hidden min-[1200px]:block`}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Aside;
