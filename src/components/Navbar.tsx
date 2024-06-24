"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Brands from "./Brands";
import { LuBell, LuLogOut, LuPlus, LuSearch, LuUser2 } from "react-icons/lu";
import { usePathname } from "next/navigation";

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
              <label htmlFor="buat_akun_modal" className="btn btn-sm">
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
              <Link
                href={"/"}
                className={`btn btn-circle btn-sm border border-base-300 text-xl`}
              >
                <LuPlus />
              </Link>
              <Link
                href={"/search"}
                className={`btn btn-circle btn-sm ${path == `/search` && "btn-primary"} border border-base-300 text-xl`}
              >
                <LuSearch />
              </Link>
              <Link
                href={"/activity"}
                className={`btn btn-circle btn-sm ${path == `/activity` && "btn-primary"} border border-base-300 text-xl`}
              >
                <LuBell />
              </Link>
              <Link
                href={`/@${user?.name}`}
                className={`btn btn-circle btn-sm ${path == `/@${user?.name}` && "btn-primary"} border border-base-300 text-xl`}
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
