'use client';

import AsideLeft from '~/components/Layouts/AsideLeft';
import AsideRight from '~/components/Layouts/AsideRight';
import Navbar from '~/components/Layouts/Navbar';
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
      <main className="flex h-dvh flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-screen-xl flex-grow justify-center [@media_(max-width:1324px)]:px-5 [@media_(max-width:545px)]:px-0 [@media_(min-width:860px)]:gap-6">
          <AsideLeft />
          <div className="hide-scroll mb-6 mt-[4.5rem] flex w-full max-w-[37rem] flex-col overflow-y-auto">
            {props.headerBackButton && <BackHeaderButton label={props.headerBackLabel} />}
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
            {props.loading ? (
              <div className="flex p-4">
                <div className="loading m-auto"></div>
              </div>
            ) : (
              !props.hideChild && props.children
            )}
          </div>
          <AsideRight />
        </div>
      </main>
    </>
  );
};

export default Wrapper;
