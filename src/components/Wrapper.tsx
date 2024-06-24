"use client";

import Aside from "~/components/Aside";
import Navbar from "~/components/Navbar";
import SideContents from "~/components/SideContents";

const Wrapper = ({ children }: any) => {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-dvh max-w-screen-xl flex-col">
        <div className="hide-scroll flex h-dvh w-full gap-4 overflow-hidden">
          <Aside />
          <div className="hide-scroll mt-3 mb-6 flex min-w-[39rem] max-w-min flex-col gap-3 overflow-x-hidden overflow-y-auto">
            {children}
          </div>
          <SideContents />
        </div>
      </main>
    </>
  );
};

export default Wrapper;
