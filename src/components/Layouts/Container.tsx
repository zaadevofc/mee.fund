'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import Navbar from './Navbar';

const Toaster = dynamic(() => import('../Services/Toaster'));
const ModalStore = dynamic(() => import('./ModalStore'));
const ModalSubmit = dynamic(() => import('./ModalSubmit'));
const RequestInstall = dynamic(() => import('./RequestInstall'));
const AsideLeft = dynamic(() => import('./AsideLeft'));
const AsideRight = dynamic(() => import('./AsideRight'));
const HeaderButton = dynamic(() => import('./HeaderButton'));
const ChildAlerts = dynamic(() => import('../Services/ChildAlerts'));

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
      <Navbar />
      <Toaster />
      <ModalStore />
      <ModalSubmit />
      <RequestInstall />
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
