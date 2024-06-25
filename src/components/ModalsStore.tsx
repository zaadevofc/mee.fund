"use client";

import { signIn } from "next-auth/react";

const ModalsStore = () => {
  return (
    <>
      <input type="checkbox" id="buat_akun_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box flex flex-col gap-3">
          <h1 className="rounded-lg border bg-[url('/svg/noises.svg')] p-4 text-xl font-black uppercase leading-tight -tracking-wide text-primary">
            JELAJAHI KESERUANNYA, BUAT AKUN MEEFUND SEKARANG JUGAAA
          </h1>
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label className="input input-md input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Buat akun dengan email..."
                />
                <span className="text-lg">@</span>
              </label>
              <h1 className="btn btn-primary btn-sm w-full">Buat Akun</h1>
            </div>
            <div className="divider">atau</div>
            <div className="flex items-center gap-3">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  signIn("google");
                }}
                className="w-full"
              >
                <div className="btn btn-outline btn-sm mx-auto flex w-full items-center gap-3 rounded-lg">
                  <img
                    className="w-4"
                    src="https://seeklogo.com/images/G/google-2015-logo-65BBD07B01-seeklogo.com.png"
                    alt=""
                  />
                  <h1>Google</h1>
                </div>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  signIn("github");
                }}
                className="w-full"
              >
                <div className="btn btn-outline btn-sm mx-auto flex w-full items-center gap-3 rounded-lg">
                  <img
                    className="w-4"
                    src="https://seeklogo.com/images/G/github-logo-7880D80B8D-seeklogo.com.png"
                    alt=""
                  />
                  <h1>Github</h1>
                </div>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  signIn("discord");
                }}
                className="w-full"
              >
                <div className="btn btn-outline btn-sm mx-auto flex w-full items-center gap-3 rounded-lg">
                  <img
                    className="w-4"
                    src="https://seeklogo.com/images/D/discord-logo-7A1EC3216C-seeklogo.com.png"
                    alt=""
                  />
                  <h1>Discord</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="buat_akun_modal">
          Close
        </label>
      </div>
      
      <input type="checkbox" id="masuk_akun_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box flex flex-col gap-3">
          <h1 className="rounded-lg border bg-[url('/svg/noises.svg')] p-4 text-xl font-black uppercase leading-tight -tracking-wide text-primary">
            JELAJAHI KESERUANNYA, MASUK KE MEEFUND SEKARANG JUGAAA
          </h1>
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label className="input input-md input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Masuk dengan email..."
                />
                <span className="text-lg">@</span>
              </label>
              <h1 className="btn btn-primary btn-sm w-full">Masuk</h1>
            </div>
            <div className="divider">atau</div>
            <div className="flex items-center gap-3">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  signIn("google");
                }}
                className="w-full"
              >
                <div className="btn btn-outline btn-sm mx-auto flex w-full items-center gap-3 rounded-lg">
                  <img
                    className="w-4"
                    src="https://seeklogo.com/images/G/google-2015-logo-65BBD07B01-seeklogo.com.png"
                    alt=""
                  />
                  <h1>Google</h1>
                </div>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  signIn("github");
                }}
                className="w-full"
              >
                <div className="btn btn-outline btn-sm mx-auto flex w-full items-center gap-3 rounded-lg">
                  <img
                    className="w-4"
                    src="https://seeklogo.com/images/G/github-logo-7880D80B8D-seeklogo.com.png"
                    alt=""
                  />
                  <h1>Github</h1>
                </div>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  signIn("discord");
                }}
                className="w-full"
              >
                <div className="btn btn-outline btn-sm mx-auto flex w-full items-center gap-3 rounded-lg">
                  <img
                    className="w-4"
                    src="https://seeklogo.com/images/D/discord-logo-7A1EC3216C-seeklogo.com.png"
                    alt=""
                  />
                  <h1>Discord</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="masuk_akun_modal">
          Close
        </label>
      </div>
    </>
  );
};

export default ModalsStore;
