"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BackHeaderButton from "~/components/BackHeaderButton";
import Wrapper from "~/components/Wrapper";

const MemePage = () => {
  const router = useRouter();
  const q = useSearchParams().get("q") as any;

  return (
    <>
      <Wrapper>
        <BackHeaderButton label="Pencarian" />
        <form>
          <label className="input input-md input-bordered flex items-center gap-2 !rounded-2xl !outline-none">
            <input
              type="text"
              name="q"
              className="grow"
              defaultValue={q}
              placeholder="Cari sesuatu disini..."
            />
            <kbd className="kbd kbd-sm">⌘</kbd>
            <kbd className="kbd kbd-sm">P</kbd>
          </label>
        </form>
        <div
          role="tablist"
          className="tabs-boxed tabs rounded-lg border bg-transparent"
        >
          <h1 role="tab" className="tab font-semibold text-primary">
            Postingan
          </h1>
          <h1 role="tab" className="tab">
            Orang
          </h1>
          <h1 role="tab" className="tab">
            Tags
          </h1>
          <h1 role="tab" className="tab">
            Media
          </h1>
        </div>
        <div className="flex flex-col overflow-hidden rounded-lg border bg-white">
          <div className="flex flex-col">
            {Array.from({ length: 20 })
              .slice(0, 6)
              .map((x, i) => (
                <Link
                  href={"/tags/loremkolor"}
                  className={`flex px-4 py-3 hover:bg-base-200`}
                >
                  <div className="flex flex-col">
                    {/* <small className="opacity-50">Trending di SMA</small> */}
                    <h1 className="text-primarys font-semibold">#LoremKolor</h1>
                    <p className="text-sm text-gray-600">45k postingan</p>
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
