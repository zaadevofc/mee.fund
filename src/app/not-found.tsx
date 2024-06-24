"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Brands from "~/components/Brands";
import Markdown from "~/components/Markdown";
import { dayjs } from "~/libs/tools";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex h-dvh flex-col items-center justify-center">
      <Brands className="!text-3xl" />
      <div className="mt-10 flex w-full max-w-2xl flex-col gap-2 rounded-lg border p-4">
        <h1 className="text-xl font-semibold">Upss Kamu Salah Alamat!</h1>
        <Markdown
          text={
            "halaman ini tidak tersedia, kemungkinan sudah di hapus atau anda terjadi kesalahan saat menuliskan alamat."
          }
          className="text-lg"
        />
        <p className="text-sm text-red-500">
          Jika masalah ini terus terjadi, harap hubungi author pada kontak yang
          tertera!
        </p>
      </div>
      <div onClick={() => router.back()} className="mt-3 w-full max-w-2xl">
        <h1 className="btn btn-warning btn-sm w-full">Kembali</h1>
      </div>
      <div className="fixed inset-x-0 bottom-4 mx-auto flex flex-col items-center justify-center">
        <h1 className="mt-5 whitespace-nowrap text-[13px] opacity-60">
          &copy; {dayjs().format("YYYY")} MeeFund by{" "}
          <strong>
            <Link href={"https://instagram.com/zaadevofc"} target="_blank">
              zaadevofc
            </Link>
          </strong>
        </h1>
      </div>
    </main>
  );
}
