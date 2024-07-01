import React from 'react';
import Brands from '../Services/Brands';
import Markdown from '../Services/Markdown';
import Link from 'next/link';
import { dayjs } from '~/libs/tools';

type CauntionType = {
  label: string;
  message: string;
  buttonLabel: string;
  buttonClick: () => void;
};

const Cauntion = (props: CauntionType) => {
  return (
    <>
      <main className="flex h-dvh flex-col items-center justify-center">
        <Brands className="!text-3xl" />
        <div className="mt-10 flex w-full max-w-2xl flex-col gap-2 rounded-lg border p-4">
          <h1 className="text-xl font-semibold">{props.label}</h1>
          <Markdown text={props.message} className="text-lg" />
          <p className="text-sm text-red-500">
            Jika masalah ini terus terjadi, coba hubungi author pada kontak yang tertera.
          </p>
        </div>
        <div onClick={() => props.buttonClick()} className="mt-3 w-full max-w-2xl">
          <h1 className="btn btn-warning btn-sm w-full">{props.buttonLabel}</h1>
        </div>
        <div className="fixed inset-x-0 bottom-4 mx-auto flex flex-col items-center justify-center">
          <h1 className="mt-5 whitespace-nowrap text-[13px] opacity-60">
            &copy; {dayjs().format('YYYY')} MeeFund by{' '}
            <strong>
              <Link scroll={false} href={'https://instagram.com/zaadevofc'} target="_blank">
                zaadevofc
              </Link>
            </strong>
          </h1>
        </div>
      </main>
    </>
  );
};

export default Cauntion;
