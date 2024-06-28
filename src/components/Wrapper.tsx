"use client";

import { LuChevronUp } from "react-icons/lu";
import Aside from "~/components/Aside";
import Navbar from "~/components/Navbar";
import SideContents from "~/components/SideContents";
import BackHeaderButton from "./BackHeaderButton";

type WrapperType = {
  children: any;
  loading?: boolean;
  childLoading?: boolean;
  childAlert?: boolean;
  headerBackButton?: boolean;
  headerBackLabel?: string;
};

const Wrapper = (props: WrapperType) => {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-dvh w-full max-w-screen-xl flex-col">
        <div className="flex min-h-dvh w-full divide-x justify-center gap-6 px-3">
          <Aside />
          <div className="mt-3 flex w-full flex-col gap-3 pb-28">
            {props.headerBackButton && (
              <BackHeaderButton label={props.headerBackLabel} />
            )}
            {props.loading ? (
              <div className="flex rounded-lg border p-4">
                <div className="loading m-auto"></div>
              </div>
            ) : (
              props.children
            )}
            {props.childLoading && (
              <div className="flex rounded-lg border p-4">
                <div className="loading m-auto"></div>
              </div>
            )}
            {props.childAlert && (
              <div className="flex rounded-lg border p-4">
                <div className="m-auto">{props.childAlert}</div>
              </div>
            )}
          </div>
          <SideContents />
        </div>
      </main>
    </>
  );
};

export default Wrapper;
