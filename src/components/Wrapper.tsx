"use client";

import Aside from "~/components/Aside";
import Navbar from "~/components/Navbar";
import SideContents from "~/components/SideContents";

const Wrapper = ({ children, loading }: any) => {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-dvh w-full max-w-screen-xl flex-col">
        <div className="hide-scroll flex h-dvh w-full gap-4 overflow-hidden">
          <Aside />
          <div className="hide-scroll mb-6 mt-3 flex w-full flex-col gap-3 overflow-y-auto overflow-x-hidden">
            {loading ? (
              <div className="flex rounded-lg border p-4">
                <div className="loading m-auto"></div>
              </div>
            ) : (
              children
            )}
          </div>
          <SideContents />
        </div>
      </main>
    </>
  );
};

export default Wrapper;
