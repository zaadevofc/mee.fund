'use client';

import Aside from '~/components/Layouts/AsideLeft';
import Navbar from '~/components/Layouts/Navbar';
import SideContents from '~/components/Layouts/AsideRight';
import BackHeaderButton from './HeaderButton';

type WrapperType = {
  children: any;
  loading?: boolean;
  childLoading?: boolean;
  childAlert?: boolean;
  hideChild?: boolean;
  headerBackButton?: boolean;
  headerBackLabel?: string;
};

const Wrapper = (props: WrapperType) => {
  return (
    <>
      <Navbar />
      <div className="mx-auto flex h-dvh w-full max-w-screen-xl flex-col">
        <div className="flex h-dvh w-full justify-center gap-2 max-[1324px]:px-5 max-[545px]:px-0 min-[860px]:gap-6">
          <Aside />
          <div className="flex w-full max-w-full flex-col divide-y pb-28 min-[545px]:border-x">
            {props.headerBackButton && <BackHeaderButton label={props.headerBackLabel} />}
            {props.loading ? (
              <div className="flex p-4">
                <div className="loading m-auto"></div>
              </div>
            ) : (
              !props.hideChild && props.children
            )}
            {props.childLoading && (
              <div className="flex p-4">
                <div className="loading m-auto"></div>
              </div>
            )}
            {props.childAlert && (
              <div className="flex p-4">
                <div className="m-auto">{props.childAlert}</div>
              </div>
            )}
          </div>
          <SideContents />
        </div>
      </div>
    </>
  );
};

export default Wrapper;
