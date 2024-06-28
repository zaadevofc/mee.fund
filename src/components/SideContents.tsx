"use client";

import Link from "next/link";
import {
  IoEllipsisHorizontal,
  IoPeopleOutline,
  IoServerOutline,
} from "react-icons/io5";
import { LuBadgeCheck, LuPlus } from "react-icons/lu";
import { dayjs } from "~/libs/tools";

const SideContents = () => {
  return (
    <>
      <aside className="hide-scroll sticky top-3 mb-10 mt-3 hidden h-dvh w-full max-w-[17rem] flex-col gap-3 overflow-auto min-[860px]:flex lg:max-w-[20rem]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col rounded-lg border bg-white py-4">
            <h1 className="px-4 text-lg font-bold">Yang ramai di bahas</h1>
            <div className="my-2 flex flex-col">
              {Array.from({ length: 20 })
                .slice(0, 6)
                .map((x, i) => (
                  <Link
                    href={"/tags/loremkolor"}
                    className="flex px-4 py-3 hover:bg-base-200"
                  >
                    <div className="flex flex-col">
                      {/* <small className="opacity-50">Trending di SMA</small> */}
                      <h1 className="text-primarys font-semibold">
                        #LoremKolor
                      </h1>
                      <p className="text-sm text-gray-600">45k postingan</p>
                    </div>
                    <div className="btn btn-ghost btn-xs ml-auto">
                      <IoEllipsisHorizontal />
                    </div>
                  </Link>
                ))}

              <Link
                href={"/"}
                className="px-4 text-sm font-semibold text-primary"
              >
                Lihat lainnya
              </Link>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-white p-4">
            <h1 className="text-lg font-bold">Disarankan</h1>
            <div className="mt-5 flex flex-col gap-3">
              {Array.from({ length: 20 })
                .slice(0, 6)
                .map((x, i) => (
                  <div className="flex w-full items-center gap-3">
                    <Link scroll={false} href={"/s"}>
                      <img
                        className="h-fit w-8 rounded-md border"
                        src="https://avatars.githubusercontent.com/u/93970726?v=4"
                        width={100}
                        height={100}
                      />
                    </Link>
                    <div className="flex flex-col">
                      <Link
                        scroll={false}
                        href={"/s"}
                        className="flex items-center gap-0.5"
                      >
                        <strong>zaadevofc</strong>
                        <LuBadgeCheck className="fill-green-400 stroke-white text-base" />
                      </Link>
                      <small className="flex items-center gap-2 opacity-60">
                        <div className="flex items-center gap-1">
                          <IoPeopleOutline />
                          <span>921k</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <IoServerOutline />
                          <span>1.2jt</span>
                        </div>
                      </small>
                    </div>
                    <div className="btn btn-primary btn-active btn-xs ml-auto">
                      <LuPlus />
                    </div>
                  </div>
                ))}
              <Link
                scroll={false}
                href={"/"}
                className="text-sm font-semibold text-primary"
              >
                Lihat lainnya
              </Link>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-white">
            <h1 className="bg-[url('/svg/noises.svg')] p-4 text-xl font-black uppercase leading-tight -tracking-wide text-primary">
              KAPAN LAGI CARI HAL SERU SAMBIL CARI ILMU!
            </h1>
            {/* <div className="space-y-3 rounded-b-lg p-3 text-sm font-semibold uppercase leading-tight -tracking-wide">
            <p>
              Buat pertanyaan atau informasi yang bermanfaat bahkan meme untuk
              candaan dengan penuh tawa!
            </p>
            <Link scroll={false}href={"/"} className="btn btn-primary btn-sm w-full">
              Buat Postingan
            </Link>
          </div> */}
          </div>
          <div className="flex flex-col rounded-lg border bg-white">
            <h1 className="bg-[url('/svg/noises.svg')] p-4 text-xl font-black uppercase leading-tight -tracking-wide text-primary">
              BAGIKAN MEEFUND KE TEMAN TEMAN MU!
            </h1>
            {/* <div className="space-y-3 rounded-b-lg p-3 text-sm font-semibold uppercase leading-tight -tracking-wide">
            <p>
              Ramaikan sosial media ini dengan memposting dan memberi informasi
              yang bermanfaat ataupun hiburan!!
            </p>
            <Link scroll={false}href={"/"} className="btn btn-primary btn-sm w-full">
              Bagikan
            </Link>
          </div> */}
          </div>
          <h1 className="mt-5 whitespace-nowrap text-[13px] opacity-60">
            &copy; {dayjs().format("YYYY")} MeeFund by{" "}
            <strong>
              <Link
                scroll={false}
                href={"https://instagram.com/zaadevofc"}
                target="_blank"
              >
                zaadevofc
              </Link>
            </strong>
          </h1>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-light opacity-60 [&>_a:hover]:underline">
            <Link scroll={false} href={"/"} className="whitespace-nowrap">
              Terms of Service
            </Link>
            <Link scroll={false} href={"/"} className="whitespace-nowrap">
              Privacy Policy
            </Link>
            <Link scroll={false} href={"/"} className="whitespace-nowrap">
              Developers
            </Link>
            <Link scroll={false} href={"/"} className="whitespace-nowrap">
              About
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideContents;
