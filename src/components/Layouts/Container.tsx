'use client';

import { lazy, ReactNode } from 'react';
import AsideLeft from './AsideLeft';
import AsideRight from './AsideRight';
import Navbar from './Navbar';
import HeaderButton from './HeaderButton';
import ChildAlerts from '../Services/ChildAlerts';
import Toaster from '../Services/Toaster';

const ModalStore = lazy(() => import('./ModalStore'));

type ContainerType = {
  children?: ReactNode;
  showHeaderButton?: boolean;
  showAlertAfter?: boolean;
  showAlertBefore?: boolean;
  setAlertLabel?: string;
  setAlertLoading?: boolean;
  hideChild?: boolean;
  headerButtonLabel?: string;
};

const Container = (props: ContainerType) => {
  return (
    <>
      <ModalStore />
      <Navbar />
      <Toaster />
      <main className="container flex max-h-dvh max-w-full justify-between gap-5 overflow-y-auto p-5 pt-20 max-[690px]:gap-3 max-[690px]:px-3 max-[460px]:px-0 max-[460px]:pt-16">
        <AsideLeft />
        <div className="mx-auto flex min-w-[35rem] max-w-min flex-col max-[690px]:min-w-[30rem] max-[510px]:min-w-[27rem] max-[460px]:min-w-full min-[460px]:gap-3">
          {props.showHeaderButton && <HeaderButton label={props.headerButtonLabel} />}
          {props.showAlertBefore && <ChildAlerts label={props.setAlertLabel} loading={props.setAlertLoading} />}
          {!props.hideChild && props.children}
          {props.showAlertAfter && <ChildAlerts label={props.setAlertLabel} loading={props.setAlertLoading} />}
          <div className="pt-20" />
        </div>
        <AsideRight />
      </main>
    </>
  );
};

export default Container;
