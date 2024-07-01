'use client';

import { Prisma } from '@prisma/client';
import { UseMutationResult } from '@tanstack/react-query';
import bytes from 'bytes';
import keygen from 'keygen';
import mime from 'mime-types';
import { useSession } from 'next-auth/react';
import { useContext, useState } from 'react';
import { Collapse } from 'react-collapse';
import toast from 'react-hot-toast';
import {
  LuBadgeCheck,
  LuChevronDown,
  LuChevronUp,
  LuImagePlus,
  LuListChecks,
  LuListVideo,
  LuMic,
} from 'react-icons/lu';
import TextareaAutosize from 'react-textarea-autosize';
import { SystemContext } from '~/app/providers';
import { POST_CATEGORY } from '~/consts';
import { uploadMedia } from '~/libs/hosting';
import { extractTags } from '~/libs/tools';
import Image from '../Services/Image';
import ImageContainer from '../Services/ImageContainer';

type SubmitCardType = {
  className?: string;
  withMedia?: boolean;
  onUploadSuccess?: (data: unknown) => void;
} & ({ inputMode: 'posts' } | { inputMode: 'comments'; post_id?: string });

type textLabelingType = {
  [K in SubmitCardType['inputMode']]: {
    placeholder: string;
    actionLabel: string;
  };
};

type PayloadSchemaType = {
  post?: Prisma.PostCreateInput;
  comment?: Prisma.CommentCreateInput;
  reply?: Prisma.CommentCreateInput;
};

let textLabeling: textLabelingType = {
  posts: {
    placeholder: 'Beritahu tentang ide, inovasi atau sekedar sharing',
    actionLabel: 'Posting',
  },
  comments: {
    placeholder: 'Tulis komentar...',
    actionLabel: 'Kirim',
  },
};

const SubmitCard = (props: SubmitCardType) => {
  const [isFullCard, setFullCard] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isCanWrite, setCanWrite] = useState(false);

  const [isMediaList, setMediaList] = useState([]);
  const [isCategory, setCategory] = useState('');

  const { data: user }: any = useSession();
  const { CreateNewPost, CreateNewComment } = useContext(SystemContext);

  const createNewPost = CreateNewPost();
  const createNewComment = CreateNewComment();

  const payload = {
    content: '',
    tags: [''],
    media: isMediaList,
    category: isCategory,
    total_size: bytes(isMediaList.reduce((a, b: any) => a + b.file.size, 0)),
  };

  // const handlePrepare = async () => {
  //   if (!user) return;

  //   let content = (globalThis as any)?.textinput.value;

  //   payload.content = content;
  //   payload.tags = extractTags('#', content);

  //   if (content.length == 0 && isMediaList.length == 0) return toast.error('Konten minimal memiliki teks atau gambar!');
  //   if (props.withCategory && !isCategory) return toast.error('Pilih kategori konten mu!');
  //   if (Number(bytes(payload.total_size)) > Number(bytes('20MB')))
  //     return toast.error('Media tidak boleh lebih dari 20MB!');

  //   setLoading(true);
  //   setFullCard(false);

  //   let media: Prisma.MediaCreateWithoutPostInput[] = [];
  //   toast.loading(`Mengupload file.`, {
  //     duration: 999999,
  //   });

  //   if (isMediaList.length > 0 && media.length !== isMediaList.length) {
  //     for (const f of isMediaList) {
  //       const file = f as any;
  //       const init = await uploadMedia(file.file, { tags: payload.tags });

  //       media.push({
  //         url: init.cdnUrl + '/-/preview/',
  //         format: init.imageInfo?.format!,
  //         mimetype: init.mimeType!,
  //         width: init.imageInfo?.width,
  //         height: init.imageInfo?.height,
  //         file_name: init.originalFilename,
  //         file_id: init.uuid,
  //         long_size: init.size,
  //         short_size: bytes(init.size!),
  //         metadata: init.metadata || {},
  //         orientation: init.imageInfo?.orientation?.toString(),
  //       });
  //     }
  //   }

  //   let schema: PayloadSchemaType = {
  //     post: {
  //       ids: keygen.url(12),
  //       user: { connect: { id: user?.id } },
  //       content: payload.content,
  //       category: payload.category as never,
  //       tags: {
  //         connectOrCreate: payload.tags.map(x => ({
  //           create: { name: x },
  //           where: { name: x },
  //         })),
  //       },
  //       media: { create: media },
  //     },
  //     comment: {
  //       ids: keygen.url(12),
  //       content: payload.content,
  //       user: { connect: { id: user?.id } },
  //       post: { connect: { ids: props?.post_id } },
  //       media: { create: media },
  //     },
  //   };

  //   if (media.length == isMediaList.length) {
  //     toast.remove();
  //     toast.loading(`Sedang mempublikasi...`, {
  //       duration: 999999,
  //     });
  //     toast.error(`Tunggu jangan berpindah halaman!`, {
  //       duration: 999999,
  //     });

  //     templateData[props.inputMode].fn.mutate(schema[props.inputMode] as never, {
  //       onSuccess: (x: any) => {
  //         if (x.error) {
  //           toast.remove();
  //           toast.error('Gagal mempublikasi, silahkan coba lagi!', {
  //             duration: 5000,
  //           });
  //           toast.error('Jika masalah berlanjut, coba hubungi author.', {
  //             duration: 5000,
  //           });
  //           setLoading(false);
  //           setFullCard(true);
  //         }

  //         if (x.data) {
  //           console.log({ d: x.data });
  //           props.onUploadSuccess && props.onUploadSuccess(schema[props.inputMode]);
  //           toast.remove();
  //           toast.success('Kontenmu telah dipublikasi!');
  //           setReqRefecth!(props.inputMode);
  //           content = '';
  //           setLoading(false);
  //           setMediaList([]);
  //           setCategory('');
  //           setCanWrite(false);
  //         }
  //       },
  //     });
  //   }
  // };

  const handleMedia = (e: any) => {
    if (Number(bytes(payload.total_size)) > Number(bytes('20MB')))
      return toast.error('Media tidak boleh lebih dari 20MB!');

    for (const f of e.target.files) {
      const file = f as any;
      if (file.size > Number(bytes('10MB'))) return toast.error('Setiap satu media tidak boleh lebih dari 10MB!');
      if (!file.type.match('image/')) return;
      if (!mime.lookup(file.name).toString().match('image/')) return;

      let parse = URL.createObjectURL(f);
      setMediaList(x => [...x, { file: f, url: parse }] as any);
    }
  };

  return (
    <>
      <label
        htmlFor={!user ? 'masuk_akun_modal' : ''}
        className={props.className + ` flex gap-3 max-[412px]:p-2.5 p-4 ${!user && 'cursor-pointer'} w-full overflow-x-auto`}
      >
        <div className="flex w-full min-w-0 items-start">
          <div className="size-10 flex-shrink-0 overflow-hidden">
            <Image
              className="size-10 rounded-full border"
              src={user?.picture}
              width={100}
              height={100}
              alt={`@${user?.username} profile picture`}
            />
          </div>
          <div className="ml-3 flex min-w-0 flex-grow flex-col gap-1">
            <div className="flex items-center gap-0.5">
              <strong className="mr-1 line-clamp-1">{user?.name ?? 'MeeFund'}</strong>
              <LuBadgeCheck
                className={`${user?.is_verified && '!block'} hidden flex-shrink-0 fill-green-400 stroke-white text-lg`}
              />
              <button
                onClick={() => !isLoading && user && setFullCard(x => !x)}
                className="btn !btn-xs ml-auto flex-shrink-0 !px-1.5"
              >
                {isFullCard ? <LuChevronDown /> : <LuChevronUp />}
              </button>
            </div>
            <div className="w-full min-w-0">
              <TextareaAutosize
                id="textinput"
                {...(!isCanWrite && { value: '' })}
                disabled={isLoading || !user}
                onClick={() => {
                  user && setFullCard(true);
                  user && setCanWrite(true);
                }}
                className="w-full bg-transparent leading-[21px]"
                placeholder={textLabeling[props.inputMode]['placeholder']}
              />
            </div>
            <Collapse isOpened={isFullCard} className="w-full overflow-x-auto">
              <div className={`${isMediaList.length == 0 && 'hidden'} mb-4 mt-2 flex w-full flex-col gap-2`}>
                <ImageContainer
                  triggers={['onDoubleClick']}
                  media={isMediaList.filter(x => x != '-').map((x: any) => x.url)}
                  onMediaClick={(x, i) => {
                    !isLoading && user && setMediaList(f => f.filter((y: any) => y.url != x));
                  }}
                />
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {isMediaList.length} File{isMediaList.length > 1 ? 's' : ''}
                  </span>
                  <span className="text-sm text-gray-500">
                    {'payload.total_size'}
                    <span className="font-semibold">/20MB</span>
                  </span>
                </div>
              </div>
              <div className={`mt-2 flex flex-wrap gap-3 ${isFullCard ? '' : ''} overflow-hidden`}>
                <div className="flex w-full flex-col">
                  <div className="flex flex-wrap items-center gap-3 overflow-x-auto whitespace-nowrap text-xl [&>_svg]:cursor-pointer [&>_svg]:opacity-50 hover:[&>_svg]:opacity-70">
                    <input
                      onChange={handleMedia}
                      multiple
                      type="file"
                      accept="image/*"
                      id="file_upload"
                      className="hidden"
                      disabled={isLoading || !user}
                    />
                    <label htmlFor="file_upload" className="flex-shrink-0 cursor-pointer opacity-50 hover:opacity-70">
                      <LuImagePlus />
                    </label>
                    <LuListVideo className="flex-shrink-0 !cursor-not-allowed !opacity-20" />
                    <LuMic className="flex-shrink-0 !cursor-not-allowed !opacity-20" />
                    <LuListChecks className="flex-shrink-0 !cursor-not-allowed !opacity-20" />
                    <select
                      value={isCategory}
                      onChange={e => !isLoading && user && setCategory(e.target.value)}
                      className={`${props.inputMode == 'posts' && '!block'} select select-bordered select-xs hidden max-w-xs flex-shrink-0`}
                    >
                      <option value={''} disabled selected>
                        Pilih Kategori
                      </option>
                      {POST_CATEGORY.map(
                        (x, i) => i > 0 && <option value={x.label.replaceAll(' ', '_').toUpperCase()}>{x.label}</option>
                      )}
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-5">
                    <div className="flex flex-col">
                      <small className="mt-3 underline opacity-30">Markdown Support</small>
                      <small className="opacity-30">Hanya mendukung file Image (20 MB)</small>
                    </div>
                    <button
                      disabled={isLoading || !user}
                      onClick={() => 'handlePrepare'}
                      className="btn btn-primary btn-sm ml-auto mt-auto flex-shrink-0"
                    >
                      {textLabeling[props.inputMode]['actionLabel']}
                    </button>
                  </div>
                </div>
              </div>
            </Collapse>
          </div>
        </div>
      </label>
    </>
  );
};

export default SubmitCard;
