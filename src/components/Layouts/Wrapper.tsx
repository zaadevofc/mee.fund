'use client';

import dynamic from 'next/dynamic';
import HeaderButton from './HeaderButton';
import ChildLoading from '../Services/ChildAlerts';
import { useContext } from 'react';
import { SystemContext } from '~/app/providers';

const Navbar = dynamic(() => import('~/components/Layouts/Navbar'));
// const AsideLeft = dynamic(() => import('~/components/Layouts/AsideLeft'));
const AsideRight = dynamic(() => import('~/components/Layouts/AsideRight'));
const Toaster = dynamic(() => import('../Services/Toaster'));
const ModalStore = dynamic(() => import('~/components/Layouts/ModalStore'));
const ModalSubmit = dynamic(() => import('~/components/Layouts/ModalSubmit'));

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
  const { showAsideLeft } = useContext(SystemContext);

  return (
    <>
      {/* <Toaster />
      <ModalStore />
      <ModalSubmit />
      {showAsideLeft && <AsideLeft className="!fixed top-0 z-[9999] min-h-dvh border-r bg-white p-4 drop-shadow-2xl" />}
      <main className="mx-auto flex h-dvh w-full max-w-screen-2xl flex-col">
        <Navbar />
        <div className={`pb-[4.5rem]`} /> */}
        <div className="flex w-full justify-between gap-6 overflow-y-auto px-5 max-[605px]:px-3 max-[490px]:px-0">
          {/* <AsideLeft className={`max-[1250px]:min-w-[15rem] max-[1080px]:min-w-[12rem] max-[970px]:min-w-[15rem] max-[755px]:min-w-[12rem] max-[705px]:hidden`} /> */}
          <div className="hide-scroll mx-auto flex h-full min-w-[35rem] max-w-min flex-col gap-6 max-[1160px]:min-w-[30rem] max-[1000px]:min-w-[28rem] max-[1000px]:gap-x-0 max-[705px]:min-w-[35rem] max-[605px]:min-w-full">
            {props.headerBackButton && <HeaderButton label={props.headerBackLabel} />}
            {props.loading ? <ChildLoading /> : !props.hideChild && props.children}
            {props.childLoading && <ChildLoading />}
            {props.childAlert && (
              <div className="flex p-4">
                <div className="m-auto">{props.childAlert}</div>
              </div>
            )}
            <div className={`pb-[4.5rem]`} />
          </div>
          {/* <AsideRight className={`max-[1250px]:min-w-[17rem] max-[1035px]:min-w-[15rem] max-[970px]:hidden`} /> */}
        </div>
      {/* </main> */}
    </>
  );
};

export default Wrapper;
