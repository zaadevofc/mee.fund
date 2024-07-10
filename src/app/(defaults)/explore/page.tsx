"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "~/components/Layouts/Container";
import BackHeaderButton from "~/components/Layouts/HeaderButton";
import TabOptions from "~/components/Layouts/HeaderTabs";
import Wrapper from "~/components/Layouts/Wrapper";

const tabs = [
  { label: "Untuk Kamu", value: "default" },
  { label: "Terbaru", value: "newest" },
];

const MemePage = () => {
  const router = useRouter();
  const q = useSearchParams().get("q") as any;

  return (
    <>
      <Container>
        <BackHeaderButton label="Pencarian" />
        <form>
          <label className="input input-md input-ghost !rounded-none flex items-center gap-2 !outline-none">
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
        <TabOptions tabs={tabs} />
        <div className="flex flex-col overflow-hidden bg-white">
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
      </Container>
    </>
  );
};

export default MemePage;
