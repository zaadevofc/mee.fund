"use state";

import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { Collapse } from "react-collapse";
import {
  LuBadgeCheck,
  LuImagePlus,
  LuListChecks,
  LuListVideo,
  LuMic,
  LuSmile,
} from "react-icons/lu";
import TextareaAutosize from "react-textarea-autosize";
import Image from "./Image";

const FormInputCard = () => {
  const [isFullCard, setIsFullCard] = useState(false);

  return (
    <>
      <div className="flex gap-3 rounded-lg border border-y p-4">
        <input type="file" name="" id="" />
        <div className="flex-shrink-0">
          <Image
            className="h-fit w-10 rounded-full border"
            src="https://avatars.githubusercontent.com/u/93970726?v=4"
            width={100}
            height={100}
          />
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center gap-0.5">
            <strong>zaadevofc</strong>
            <LuBadgeCheck className="fill-green-400 stroke-white text-base" />
          </div>
          <TextareaAutosize
            onClick={() => setIsFullCard(true)}
            className="leading-[21px]"
            placeholder="Buat postingan..."
          />
          <Collapse isOpened={isFullCard} className="w-full">
            <div
              className={`mt-2 flex ${isFullCard ? "" : ""} sh-full overflow-hidden`}
            >
              <div className="flex w-full flex-col">
                <div className="flex items-center gap-3 text-xl [&>_svg]:cursor-pointer [&>_svg]:opacity-50 hover:[&>_svg]:opacity-70">
                  <LuImagePlus />
                  <LuSmile />
                  <LuListVideo />
                  <LuMic className="!opacity-20" />
                  <LuListChecks className="!opacity-20" />
                  <select className="select select-bordered select-xs w-fit">
                    <option disabled selected>
                      Pilih Kategori
                    </option>
                    <option>Umum</option>
                    <option>Meme</option>
                    <option>Coding</option>
                    <option>Gaming</option>
                  </select>
                </div>
                <small className="mt-3 opacity-30">Markdown Support</small>
              </div>
              <h1 className="btn btn-primary btn-sm ml-auto mt-auto">
                Posting
              </h1>
            </div>
            <EmojiPicker open={false} />
          </Collapse>
        </div>
      </div>
    </>
  );
};

export default FormInputCard;
