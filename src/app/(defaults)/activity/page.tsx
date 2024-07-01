"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BackHeaderButton from "~/components/Layouts/HeaderButton";
import Image from "~/components/Services/Image";
import Markdown from "~/components/Services/Markdown";
import Wrapper from "~/components/Layouts/Wrapper";
import { dayjs } from "~/libs/tools";

const MemePage = () => {
  const q = useSearchParams().get("q") as any;

  return (
    <>
      <Wrapper>
        <BackHeaderButton label="Aktifitas dan Notifikasi" />
        <div
          role="tablist"
          className="tabs-boxed tabs rounded-lg border bg-transparent"
        >
          <h1 role="tab" className="tab font-semibold text-primary">
            Aktifitas
          </h1>
          <h1 role="tab" className="tab">
            Mentions
          </h1>
          <h1 role="tab" className="tab">
            System
          </h1>
        </div>
        <div className="flex flex-col overflow-hidden rounded-lg border bg-white">
          <div className="flex flex-col divide-y">
            {/* aktifitas like */}
            {Array.from({ length: 3 }).map((x, i) => (
              <Link
                href={"/tags/loremkolor"}
                className={`items-centerp flex gap-2.5 px-4 py-3 hover:bg-base-200`}
              >
                <div className="flex-shrink-0">
                  <Image
                    className="size-10 rounded-full border"
                    src="/assets/badges/cute-shiba.avif"
                  />
                </div>
                <div className="flex flex-col">
                  {/* <small className="opacity-50">Trending di SMA</small> */}
                  <Markdown
                    className="line-clamp-2"
                    text={`@kejaa_ menyukai postingan Anda.`}
                  />
                  <p className="text-sm text-gray-500">
                    {dayjs().calendar(dayjs())}
                  </p>
                </div>
                <div className="my-auto ml-auto flex-shrink-0">
                  <Image
                    className="size-12 rounded-lg border object-cover"
                    src="/posts.jpg"
                  />
                </div>
              </Link>
            ))}

            {/* mentions */}
            {Array.from({ length: 3 }).map((x, i) => (
              <Link
                href={"/tags/loremkolor"}
                className={`items-centerp flex gap-2.5 px-4 py-3 hover:bg-base-200`}
              >
                <div className="flex-shrink-0">
                  <Image
                    className="size-10 rounded-full border"
                    src="/assets/badges/cute-shiba.avif"
                  />
                </div>
                <div className="flex flex-col">
                  {/* <small className="opacity-50">Trending di SMA</small> */}
                  <Markdown
                    className="line-clamp-2"
                    text={`@dithaa_ menyebut Anda pada postingan: _"Ilmu bisa di cari tetapi ilmu tanpa adab hanyalah batu."_`}
                  />
                  <p className="text-sm text-gray-500">
                    {dayjs().calendar(dayjs())}
                  </p>
                </div>
                <div className="my-auto ml-auto flex-shrink-0">
                  <Image
                    className="size-12 rounded-lg border object-cover"
                    src="/assets/badges/katana-sword.avif"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default MemePage;
