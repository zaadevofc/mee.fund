'use client';

import dynamic from 'next/dynamic';
import HeaderButton from './HeaderButton';
import ChildLoading from '../Services/ChildLoading';

const Navbar = dynamic(() => import('~/components/Layouts/Navbar'));
const AsideLeft = dynamic(() => import('~/components/Layouts/AsideLeft'), { loading: ChildLoading });
const AsideRight = dynamic(() => import('~/components/Layouts/AsideRight'), { loading: ChildLoading });
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
  return (
    <>
      <Toaster />
      <ModalStore />
      <ModalSubmit />
      <main className="mx-auto flex h-dvh w-full max-w-screen-2xl flex-col">
        <Navbar />
        <div className="pb-[4.5rem]" />
        <div className="max-[490px]:px-0 flex w-full justify-between gap-6 max-[605px]:px-3 overflow-y-auto px-5">
          <AsideLeft className={`max-[705px]:hidden max-[755px]:min-w-[12rem] max-[970px]:min-w-[15rem] max-[1250px]:min-w-[15rem] max-[1080px]:min-w-[12rem]`} />
          <div className="hide-scroll mx-auto mb-6 flex max-[605px]:min-w-full max-[705px]:min-w-[35rem] min-w-[35rem] max-w-min flex-col gap-6 max-[1160px]:min-w-[30rem] max-[1000px]:min-w-[28rem] max-[1000px]:gap-x-0">
            {props.headerBackButton && <HeaderButton label={props.headerBackLabel} />}
            {props.loading ? <ChildLoading /> : !props.hideChild && props.children}
            {props.childLoading && <ChildLoading />}
            {props.childAlert && (
              <div className="flex p-4">
                <div className="m-auto">{props.childAlert}</div>
              </div>
            )}
          </div>
          <AsideRight className={`max-[1250px]:min-w-[17rem] max-[1035px]:min-w-[15rem] max-[970px]:hidden`} />
        </div>
      </main>
    </>
  );
};

export default Wrapper;
