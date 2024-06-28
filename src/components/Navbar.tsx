"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuBell, LuPlus, LuSearch, LuUser2 } from "react-icons/lu";
import Brands from "./Brands";

const Navbar = () => {
  const { data: user }: any = useSession();
  const path = usePathname();

  return (
    <>
      <nav className="mb-3 flex w-full items-center border-b bg-white">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col p-3">
          <div className="flex w-full items-center gap-10">
            <Brands />
            <div
              className={`${user && "hidden"} ml-auto flex items-center gap-3`}
            >
              <label htmlFor="masuk_akun_modal" className="btn btn-sm">
                Masuk
              </label>
              <label
                htmlFor="buat_akun_modal"
                className="btn btn-primary btn-sm"
              >
                Buat Akun
              </label>
            </div>

            <div
              className={`${!user && "hidden"} ml-auto flex items-center gap-4`}
            >
              <Link scroll={false}
                href={"/"}
                className={`btn btn-circle btn-sm border border-base-300 text-xl`}
              >
                <LuPlus />
              </Link>
              <Link scroll={false}
                href={"/search"}
                className={`btn btn-circle btn-sm ${path == `/search` && "btn-primary"} border border-base-300 text-xl`}
              >
                <LuSearch />
              </Link>
              <Link scroll={false}
                href={"/activity"}
                className={`btn btn-circle btn-sm ${path == `/activity` && "btn-primary"} border border-base-300 text-xl`}
              >
                <LuBell />
              </Link>
              <Link scroll={false}
                href={`/@${user?.username}`}
                className={`btn btn-circle btn-sm ${path == `/@${user?.username}` && "btn-primary"} border border-base-300 text-xl`}
              >
                <LuUser2 />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
