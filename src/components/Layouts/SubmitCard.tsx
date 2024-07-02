'use client';

import { Prisma } from '@prisma/client';
import { MutateOptions } from '@tanstack/react-query';
import bytes from 'bytes';
import keygen from 'keygen';
import mime from 'mime-types';
import { useSession } from 'next-auth/react';
import { useContext, useState } from 'react';
import { Collapse } from 'react-collapse';
import toast from 'react-hot-toast';
import { LuBadgeCheck, LuChevronDown, LuChevronUp, LuImagePlus, LuListChecks, LuListVideo, LuMic } from 'react-icons/lu';
import TextareaAutosize from 'react-textarea-autosize';
import { SystemContext } from '~/app/providers';
import { POST_CATEGORY } from '~/consts';
import { postMedia } from '~/libs/hooks';
import { extractTags } from '~/libs/tools';
import Image from '../Services/Image';
import ImageContainer from '../Services/ImageContainer';

type SubmitCardType = {
  className?: string;
  withMedia?: boolean;
  onUploadSuccess?: (data: unknown) => void;
} & ({ inputMode: 'posts' } | { inputMode: 'comments'; post_id?: string });

let textLabeling = {
  posts: {
    placeholder: 'Beritahu tentang ide, inovasi atau sekedar sharing',
    actionLabel: 'Posting',
    successPost: 'Postingan berhasil di publikasi.',
  },
  comments: {
    placeholder: 'Tulis komentar...',
    actionLabel: 'Kirim',
    successPost: 'Komentar berhasil di publikasi.',
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
    category: isCategory,
    total_size: bytes(isMediaList.reduce((a, b: any) => a + b.file.size, 0)),
  };

  const handlePrepare = async () => {
    if (!user) return;

    let media: Prisma.MediaCreateWithoutPostInput[] = [];
    let content = (globalThis as any)?.textinput.value;
    payload.content = content;
    payload.tags = extractTags('#', content);

    if (content.length == 0 && isMediaList.length == 0) return toast.error('Konten minimal memiliki teks atau gambar!');
    if (props.inputMode == 'posts' && !isCategory) return toast.error('Pilih kategori postingan mu!');
    toast.loading(`Tunggu sedang mengupload files.`, { duration: 999999 });

    setLoading(true);
    setFullCard(false);

    if (isMediaList.length > 0 && media.length !== isMediaList.length) {
      for (const f of isMediaList) {
        const file = (f as any).file;

        if (file.size > Number(bytes('20MB'))) return;
        if (!/^image|video/.test(file.type)) return;
        if (!/^image|video/.test(mime.lookup(file.name).toString())) return;
        const init = await postMedia(file, props.inputMode);

        media.push({
          url: init.data.uri,
          format: '.' + mime.extension(file.type).toString(),
          mimetype: file.type,
          file_name: file.name,
          file_id: init.data.Id,
          long_size: file.size,
          short_size: bytes(file.size!),
          metadata: {
            user: `${user?.id}-${user?.name}-${user?.username}`,
            tags: payload.tags,
            bucket: init.data.Key,
            category: payload.category,
          },
        });
      }
    }

    if (media.length == isMediaList.length) {
      toast.remove();
      toast.loading(`Sedang mempublikasi. Hindari berpindah halaman!`, { duration: 999999 });

      let handler: MutateOptions<unknown, unknown, unknown> = {
        onSuccess: (x: any) => {
          toast.remove();
          if (x.error) {
            toast.error('Gagal mempublikasi, silahkan coba lagi.', { duration: 5000 });
            toast.error('Jika masalah berlanjut, coba hubungi author.', { duration: 5000 });
            setLoading(false);
            setFullCard(true);
          }

          if (x.data) {
            props.onUploadSuccess && props.onUploadSuccess(x.data);
            toast.success(textLabeling[props.inputMode].successPost);
            setCategory('');
            setMediaList([]);
            setLoading(false);
            setCanWrite(false);
          }
        },
      };

      let defaults = {
        ids: keygen.url(12),
        user: { connect: { id: user?.id } },
        content: payload.content,
        media: { create: media },
      };

      let schema = {
        posts: () =>
          props.inputMode == 'posts' &&
          createNewPost.mutate(
            {
              data: {
                ...defaults,
                category: payload.category as never,
                tags: { connectOrCreate: payload.tags.map(x => ({ create: { name: x }, where: { name: x } })) },
              },
            },
            handler
          ),
        comments: () => props.inputMode == 'comments' && createNewComment.mutate({ data: { ...defaults, post: { connect: { ids: props?.post_id } } } }, handler),
      };

      schema[props.inputMode]();
    }
  };

  const handleMedia = (e: any) => {
    if (isMediaList.length >= 5) return toast.error('Maksimal 5 hanya media!');
    if (Number(bytes(payload.total_size)) > Number(bytes('20MB'))) return toast.error('Media tidak boleh lebih dari 20MB!');

    for (const f of e.target.files) {
      const file = f as any;
      if (file.size > Number(bytes('20MB'))) return toast.error('Media tidak boleh lebih dari 20MB!');
      if (!/^image|video/.test(file.type)) return;
      if (!/^image|video/.test(mime.lookup(file.name).toString())) return;

      let parse = URL.createObjectURL(f);
      setMediaList(x => [...x, { file: f, url: parse }].slice(0, 5) as any);
    }
  };

  return (
    <>
      <label htmlFor={!user ? 'masuk_akun_modal' : ''} className={props.className + ` sticky -top-10 flex gap-3 p-4 max-[412px]:p-2.5 ${!user && 'cursor-pointer'} w-full`}>
        <div className="flex w-full min-w-0 items-start">
          <div className="size-10 flex-shrink-0 overflow-hidden">
            <Image className="size-10 rounded-full border" src={user?.picture} width={100} height={100} alt={`@${user?.username} profile picture`} />
          </div>
          <div className="ml-3 flex min-w-0 flex-grow flex-col gap-1">
            <div className="flex items-center gap-0.5">
              <strong className="mr-1 line-clamp-1">{user?.name ?? 'MeeFund'}</strong>
              <LuBadgeCheck className={`${user?.is_verified && '!block'} hidden flex-shrink-0 fill-green-400 stroke-white text-lg`} />
              <button onClick={() => !isLoading && user && setFullCard(x => !x)} className="btn !btn-xs ml-auto flex-shrink-0 !px-1.5">
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
                  small
                  triggers={['onDoubleClick']}
                  media={isMediaList.filter(x => x != '-').map((x: any) => ({ src: x.url, type: x.file.type }))}
                  onMediaClick={(x: any, i) => {
                    !isLoading && user && setMediaList(f => f.filter((y: any) => y.url != x.src));
                  }}
                />
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {isMediaList.length}
                    <span className="font-semibold">/5 Files</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    {payload.total_size}
                    <span className="font-semibold">/20MB</span>
                  </span>
                </div>
              </div>
              <div className={`mt-2 flex flex-wrap gap-3 ${isFullCard ? '' : ''} overflow-hidden`}>
                <div className="flex w-full flex-col">
                  <div className="flex flex-wrap items-center gap-3 overflow-x-auto whitespace-nowrap text-xl [&>_svg]:cursor-pointer [&>_svg]:opacity-50 hover:[&>_svg]:opacity-70">
                    <input onChange={handleMedia} multiple type="file" accept="image/*, video/*" id="file_upload" className="hidden" disabled={isLoading || !user} />
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
                      {POST_CATEGORY.map((x, i) => i > 0 && <option value={x.label.replaceAll(' ', '_').toUpperCase()}>{x.label}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-5">
                    <div className="flex flex-col">
                      <small className="mt-3 underline opacity-30">Markdown Support</small>
                    </div>
                    <button disabled={isLoading || !user} onClick={handlePrepare} className="btn btn-primary btn-sm ml-auto mt-auto flex-shrink-0">
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
