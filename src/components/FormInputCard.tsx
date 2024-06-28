"use client";

import { Prisma } from "@prisma/client";
import bytes from "bytes";
import keygen from "keygen";
import mime from "mime-types";
import { useSession } from "next-auth/react";
import { useContext, useState } from "react";
import { Collapse } from "react-collapse";
import toast from "react-hot-toast";
import {
  LuBadgeCheck,
  LuChevronDown,
  LuChevronUp,
  LuImagePlus,
  LuListChecks,
  LuListVideo,
  LuMic,
  LuSmile,
} from "react-icons/lu";
import TextareaAutosize from "react-textarea-autosize";
import { SystemContext } from "~/app/providers";
import { POST_CATEGORY } from "~/consts";
import { uploadMedia } from "~/libs/hosting";
import { extractTags } from "~/libs/tools";
import EmojiCard from "./EmojiCard";
import Image from "./Image";
import ImageContainer from "./ImageContainer";
import Markdown from "./Markdown";

type FormInputCardType = {
  className?: string;
  placeholder?: string;
  actionLabel?: string;
  withCategory?: boolean;
  inputMode?: "post" | "comment";
  onUploadSuccess?: (data: unknown) => void;
};

const FormInputCard = (props: FormInputCardType) => {
  const [isFullCard, setFullCard] = useState(false);
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [isInputText, setInputText] = useState("");
  const [isMediaList, setMediaList] = useState([]);
  const [isCategory, setCategory] = useState("");

  const { data: user }: any = useSession();
  const { CreateNewPost } = useContext(SystemContext);
  const createNewPost = CreateNewPost();

  const payload = {
    content: isInputText,
    category: isCategory,
    media: isMediaList,
    tags: extractTags("#", isInputText),
    total_size: bytes(isMediaList.reduce((a, b: any) => a + b.file.size, 0)),
  };

  const handlePrepare = async () => {
    if (!user) return;
    if (isInputText.length == 0 && isMediaList.length == 0)
      return toast.error("Konten minimal memiliki teks atau gambar!");
    if (!isCategory) return toast.error("Pilih kategori postinganmu!");

    setLoading(true);
    setFullCard(false);

    let media: Prisma.MediaCreateWithoutPostInput[] = [];
    toast.loading(`Mengupload file.`, {
      duration: 999999,
    });

    if (isMediaList.length > 0 && media.length !== isMediaList.length) {
      for (const f of isMediaList) {
        const file = f as any;
        const init = await uploadMedia(file.file, {
          type: "thumbnail-user-post",
          tags: payload.tags,
        });

        media.push({
          url: init.cdnUrl + "/-/preview/",
          format: init.imageInfo?.format!,
          mimetype: init.mimeType!,
          width: init.imageInfo?.width,
          height: init.imageInfo?.height,
          file_name: init.originalFilename,
          file_id: init.uuid,
          long_size: init.size,
          short_size: bytes(init.size!),
          metadata: init.metadata || {},
          orientation: init.imageInfo?.orientation?.toString(),
        });
      }
    }

    let post_schema: Prisma.PostCreateInput = {
      ids: keygen.url(12),
      user: { connect: { id: user?.id } },
      content: payload.content,
      category: payload.category as never,
      tags: {
        connectOrCreate: payload.tags.map((x) => ({
          create: { name: x },
          where: { name: x },
        })),
      },
      media: { create: media },
    };

    if (media.length == isMediaList.length) {
      toast.remove();
      toast.loading(`Mempublikasi postingan.`, {
        duration: 999999,
      });

      createNewPost.mutate(post_schema as any, {
        onSuccess: (x: any) => {
          if (x.error) {
            toast.remove();
            toast.error("Gagal mempublikasi, silahkan coba lagi!", {
              duration: 5000,
            });
            toast.error("Jika masalah berlanjut, coba hubungi author.", {
              duration: 5000,
            });
            setLoading(false);
            setFullCard(true);
          }

          if (x.data) {
            props.onUploadSuccess && props.onUploadSuccess(post_schema);
            toast.remove();
            toast.success("Postinganmu telah dipublikasi!");
            toast.success("Lihat postingan di profilmu!");
            setLoading(false);
            setInputText("");
            setMediaList([]);
            setCategory("");
          }
        },
      });
    }
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
      <div className="hidden w-full rounded-lg border p-4">
        <Markdown text={isInputText} className="leading-[21px]" />
      </div>
      <label
        htmlFor={!user ? "masuk_akun_modal" : ""}
        className={
          props.className +
          ` flex gap-3 rounded-lg border border-y p-4 ${!user && "cursor-pointer"}`
        }
      >
        <div className="size-10 flex-shrink-0 overflow-hidden">
          <Image
            className="size-10 rounded-full border"
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
            <strong className="line-clamp-1">{user?.name ?? "MeeFund"}</strong>
            <LuBadgeCheck
              className={`${user?.is_verified && "!block"} hidden fill-green-400 stroke-white text-lg`}
            />
            <button onClick={() => !isLoading && user && setFullCard(x => !x)} className="btn btn-xs ml-auto">
              {isFullCard ? <LuChevronDown /> : <LuChevronUp />}
            </button>
          </div>
          <TextareaAutosize
            disabled={isLoading || !user}
            value={isInputText}
            onClick={() => user && setFullCard(true)}
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
                  !isLoading &&
                    setMediaList((f) => f.filter((y: any) => y.url != x));
                }}
              />
              <div className="flex w-full items-center justify-between">
                <span className="text-sm text-gray-500">
                  {isMediaList.length} File{isMediaList.length > 1 ? "s" : ""}
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
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="file_upload"
                    className="flex-shrink-0 cursor-pointer opacity-50 hover:opacity-70"
                  >
                    <LuImagePlus />
                  </label>
                  <LuSmile
                    onClick={() => !isLoading && setIsShowEmoji((x) => !x)}
                    className="flex-shrink-0"
                  />
                  <LuListVideo className="flex-shrink-0 !cursor-not-allowed !opacity-20" />
                  <LuMic className="flex-shrink-0 !cursor-not-allowed !opacity-20" />
                  <LuListChecks className="flex-shrink-0 !cursor-not-allowed !opacity-20" />
                  <select
                    value={isCategory}
                    onChange={(e) => !isLoading && setCategory(e.target.value)}
                    className={`${props.withCategory && "!block"} select select-bordered select-xs hidden w-fit`}
                  >
                    <option value={""} disabled selected>
                      Pilih Kategori
                    </option>
                    {POST_CATEGORY.map(
                      (x, i) =>
                        i > 0 && (
                          <option
                            value={x.label.replaceAll(" ", "_").toUpperCase()}
                          >
                            {x.label}
                          </option>
                        ),
                    )}
                  </select>
                </div>
                <small className="mt-3 underline opacity-30">
                  Markdown Support
                </small>
                <small className="opacity-30">
                  Hanya mendukung file Image (20 MB)
                </small>
              </div>
              <button
                disabled={isLoading || !user}
                onClick={handlePrepare}
                className="btn btn-primary btn-sm ml-auto mt-auto"
              >
                {props.actionLabel ?? `Posting`}
              </button>
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
      </label>
    </>
  );
};

export default FormInputCard;
