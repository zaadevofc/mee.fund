"use client";

import { useSession } from "next-auth/react";
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
import { POST_CATEGORY } from "~/consts";
import EmojiCard from "./EmojiCard";
import bytes from "bytes";
import mime from "mime-types";
import Image from "./Image";
import ImageContainer from "./ImageContainer";
import toast from "react-hot-toast";

type FormInputCardType = {
  placeholder?: string;
  actionLabel?: string;
  withCategory?: boolean;
};

const FormInputCard = (props: FormInputCardType) => {
  const [isFullCard, setIsFullCard] = useState(false);
  const [isShowEmoji, setIsShowEmoji] = useState(false);

  const [isInputText, setInputText] = useState("");
  const [isMediaList, setMediaList] = useState([]);
  const [isCategory, setCategory] = useState("");

  const { data: user }: any = useSession();

  const payload = {
    content: isInputText,
    category: isCategory,
    media: isMediaList,
    total_size: bytes(isMediaList.reduce((a, b: any) => a + b.file.size, 0)),
  };

  const handlePrepare = () => {
    if (isInputText.length == 0 && isMediaList.length == 0) return toast.error('Konten minimal memiliki teks atau gambar!');
    if (!isCategory) return toast.error('Pilih kategori postinganmu!');

     console.log(payload);
  };

  const handleMedia = (e: any) => {
    for (const f of e.target.files) {
      const file = f as any;
      if (!file.type.match("image/")) return;
      if (!mime.lookup(file.name).toString().match("image/")) return;

      let parse = URL.createObjectURL(f);
      setMediaList((x) => [...x, { file: f, url: parse }] as any);
    }
  };

  return (
    <>
      <div className="flex gap-3 rounded-lg border border-y p-4">
        <div className="flex-shrink-0">
          <Image
            className="size-10 h-fit rounded-full border"
            src={
              user?.picture ?? "/assets/defaults/thumbnails/empty-picture.webp"
            }
            width={100}
            height={100}
            alt={`@${user?.username} profile picture`}
          />
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center gap-0.5">
            <strong className="line-clamp-1">{user?.name}</strong>
            <LuBadgeCheck
              className={`${user?.is_verified && "!block"} hidden fill-green-400 stroke-white text-lg`}
            />
          </div>
          <TextareaAutosize
            value={isInputText}
            onClick={() => setIsFullCard(true)}
            onChange={(e) => setInputText(e.target.value)}
            className="leading-[21px]"
            placeholder={props.placeholder ?? `Buat postingan...`}
          />
          <Collapse isOpened={isFullCard} className="w-full">
            <div
              className={`${isMediaList.length == 0 && "hidden"} mb-4 mt-2 flex w-full flex-col gap-2`}
            >
              <ImageContainer
                triggers={["onDoubleClick"]}
                media={isMediaList
                  .filter((x) => x != "-")
                  .map((x: any) => x.url)}
                onMediaClick={(x, i) => {
                  setMediaList((f) => f.filter((y: any) => y.url != x));
                }}
              />
              <div className="flex w-full items-center justify-between">
                <span className="text-sm text-gray-500">
                  {isMediaList.length} File{isMediaList.length > 1 ? 's' : ''}
                </span>
                <span className="text-sm text-gray-500">
                  {payload.total_size}
                  <span className="font-semibold">/20MB</span>
                </span>
              </div>
            </div>
            <div
              className={`mt-2 flex ${isFullCard ? "" : ""} overflow-hidden`}
            >
              <div className="flex w-full flex-col">
                <div
                  className={`flex items-center gap-3 text-xl [&>_svg]:cursor-pointer [&>_svg]:opacity-50 hover:[&>_svg]:opacity-70`}
                >
                  <input
                    onChange={handleMedia}
                    multiple
                    type="file"
                    accept="image/*"
                    id="file_upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="file_upload"
                    className="flex-shrink-0 cursor-pointer opacity-50 hover:opacity-70"
                  >
                    <LuImagePlus />
                  </label>
                  <LuSmile
                    onClick={() => setIsShowEmoji((x) => !x)}
                    className="flex-shrink-0"
                  />
                  <LuListVideo className="flex-shrink-0 !cursor-not-allowed !opacity-20" />
                  <LuMic className="flex-shrink-0 !cursor-not-allowed !opacity-20" />
                  <LuListChecks className="flex-shrink-0 !cursor-not-allowed !opacity-20" />
                  <select
                    onChange={(e) => setCategory(e.target.value)}
                    className={`${props.withCategory && "!block"} select select-bordered select-xs hidden w-fit`}
                  >
                    <option disabled selected>
                      Pilih Kategori
                    </option>
                    {POST_CATEGORY.map((x, i) => (
                      <option
                        value={x.label.replaceAll(" ", "_").toUpperCase()}
                      >
                        {x.label}
                      </option>
                    ))}
                  </select>
                </div>
                <small className="mt-3 underline opacity-30">
                  Markdown Support
                </small>
                <small className="opacity-30">
                  Hanya mendukung file Image (20 MB)
                </small>
              </div>
              <h1
                onClick={handlePrepare}
                className="btn btn-primary btn-sm ml-auto mt-auto"
              >
                {props.actionLabel ?? `Posting`}
              </h1>
            </div>
            <div
              className={`${isShowEmoji && "!block"} top-28 z-10 mt-2 hidden rounded-lg`}
            >
              <EmojiCard
                open={isShowEmoji}
                onEmojiSelect={(e: any) =>
                  setInputText((prev) => prev + e.native)
                }
              />
            </div>
          </Collapse>
        </div>
      </div>
    </>
  );
};

export default FormInputCard;
