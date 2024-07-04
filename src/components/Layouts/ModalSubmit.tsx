'use client';

import { MutateOptions } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { LuBadgeCheck, LuImagePlus, LuListChecks, LuMic } from 'react-icons/lu';
import { SystemContext } from '~/app/providers';
import { POST_CATEGORY } from '~/consts';
import { postMedia } from '~/libs/hooks';
import { extractTags } from '~/libs/tools';
import Image from '../Services/Image';

const TextareaAutosize = dynamic(() => import('react-textarea-autosize'), { ssr: false });
const ImageContainer = dynamic(() => import('../Services/ImageContainer'), { ssr: false });

const bytesImport = import('bytes').then(mod => mod.default);
const keygenImport = import('keygen').then(mod => mod.default);
const mimeImport = import('mime-types').then(mod => mod.default);

const textLabeling = {
  posts: {
    placeholder: 'Lagi mikirin apa nih?',
    actionLabel: 'Posting',
    successPost: 'Postingan berhasil di publikasi.',
  },
  comments: {
    placeholder: 'Tulis komentar...',
    actionLabel: 'Kirim',
    successPost: 'Komentar berhasil di publikasi.',
  },
};

const ModalSubmit = memo(() => {
  const [isLoading, setLoading] = useState(false);
  const [isCanWrite, setCanWrite] = useState(false);
  const [isMediaList, setMediaList] = useState([]);
  const [isCategory, setCategory] = useState('');

  const { data: user }: any = useSession();
  const { CreateNewPost, CreateNewComment, initSubmitType, setInitTempPosts, setInitTempComments } = useContext(SystemContext);

  const createNewPost = CreateNewPost();
  const createNewComment = CreateNewComment();

  const addReplies = useCallback((comments: any, parentId: any, newReply: any) => {
    const add = (c: any) => {
      for (let i = 0; i < c.length; i++) {
        if (c[i].id === parentId) {
          c[i].replies.push(newReply);
          return true;
        }
        if (c[i].replies.length > 0) {
          if (add(c[i].replies)) {
            return true;
          }
        }
      }
      return false;
    };

    const copy = JSON.parse(JSON.stringify(comments));
    const added = add(copy);

    return { success: added, comments: copy };
  }, []);

  const handlePrepare = useCallback(async () => {
    if (!user) return;

    const bytes = await bytesImport;
    const keygen = await keygenImport;
    const mime = await mimeImport;

    let media = [];
    let content = (globalThis as any)?.textinput.value;
    let payload = {
      content,
      tags: extractTags('#', content),
      category: isCategory,
      total_size: bytes(isMediaList.reduce((a, b: any) => a + b.file.size, 0)),
    };

    if (content.length == 0 && isMediaList.length == 0) return toast.error('Konten minimal memiliki teks atau gambar!');
    if (initSubmitType?.type == 'posts' && !isCategory) return toast.error('Pilih kategori postingan mu!');
    toast.loading(`Tunggu sedang mengupload files.`, { duration: 999999 });

    setLoading(true);

    if (isMediaList.length > 0 && media.length !== isMediaList.length) {
      for (const f of isMediaList) {
        const file = (f as any).file;

        if (file.size > Number(bytes('20MB'))) return;
        if (!/^image|video/.test(file.type)) return;
        if (!/^image|video/.test(mime.lookup(file.name).toString())) return;
        const init = await postMedia(file, initSubmitType?.type!);

        media.push({
          url: init.data.uri,
          format: '.' + mime.extension(file.type).toString(),
          mimetype: file.type,
          file_name: file.name,
          file_id: init.data.Id,
          long_size: file.size,
          short_size: bytes(file.size),
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

      let defaults = {
        ids: keygen.url(12),
        user: { connect: { id: user?.id } },
        content: payload.content,
        media: { create: media },
      };

      let handler: MutateOptions<unknown, unknown, unknown> = {
        onSuccess: (x: any) => {
          toast.remove();
          if (x.error) {
            toast.error('Gagal mempublikasi, silahkan coba lagi.', { duration: 5000 });
            toast.error('Jika masalah berlanjut, coba hubungi author.', { duration: 5000 });
            setLoading(false);
          }

          if (x.data) {
            toast.success(textLabeling[initSubmitType?.type!]?.successPost);
            setCategory('');
            setMediaList([]);
            setLoading(false);
            setCanWrite(false);
            const newz = {
              id: x?.data?.id,
              ids: defaults?.ids,
              content: defaults?.content,
              category: payload?.category,
              media: media,
              created_at: x?.data?.created_at,
              replies: [],
              user: {
                name: user?.name,
                username: user?.username,
                picture: user?.picture,
              },
            };
            initSubmitType?.type == 'posts' &&
              setInitTempPosts!((y: any) => {
                return [newz, ...y];
              });

            initSubmitType?.type == 'comments' &&
              setInitTempComments!((y: any) => {
                const check = initSubmitType?.parent_id ? addReplies(y, initSubmitType?.parent_id, newz).comments : [newz, ...y];
                return check;
              });
          }
        },
      };

      let schema = {
        posts: () =>
          initSubmitType?.type == 'posts' &&
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
        comments: () =>
          initSubmitType?.type == 'comments' &&
          createNewComment.mutate(
            {
              data: {
                post: { connect: { ids: initSubmitType?.post_id ?? initSubmitType?.post_id } },
                ...(initSubmitType?.parent_id && { parent: { connect: { id: initSubmitType?.parent_id } } }),
                ...defaults,
              },
            },
            handler
          ),
      };

      schema[initSubmitType?.type!]?.();
    }
  }, [user, isMediaList, isCategory, initSubmitType, createNewPost, createNewComment, addReplies]);

  const handleMedia = useCallback(
    (e: any) => {
      if (isMediaList.length >= 5) return toast.error('Maksimal 5 hanya media!');

      bytesImport.then(bytes => {
        if (Number(bytes(isMediaList.reduce((a, b: any) => a + b.file.size, 0))) > Number(bytes('20MB'))) return toast.error('Media tidak boleh lebih dari 20MB!');

        for (const f of e.target.files) {
          const file = f;
          if (file.size > Number(bytes('20MB'))) return toast.error('Media tidak boleh lebih dari 20MB!');
          if (!/^image|video/.test(file.type)) return;

          mimeImport.then(mime => {
            if (!/^image|video/.test(mime.lookup(file.name).toString())) return;

            let parse = URL.createObjectURL(f);
            setMediaList((x: any) => [...x, { file: f, url: parse }].slice(0, 5) as any);
          });
        }
      });
    },
    [isMediaList]
  );

  useEffect(() => {
    setCanWrite(true);
  }, [initSubmitType]);

  const memoizedImageContainer = useMemo(
    () => (
      <ImageContainer
        triggers={['onDoubleClick']}
        media={isMediaList.filter(x => x != '-').map((x: any) => ({ src: x.url, type: x.file.type }))}
        onMediaClick={(x: any, i) => {
          !isLoading && user && setMediaList(f => f.filter((y: any) => y.url != x.src));
        }}
      />
    ),
    [isMediaList, isLoading, user]
  );

  return (
    <>
      <input type="checkbox" id="make_post_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="hide-scroll modal-box">
          <div className="relative flex items-start gap-3">
            <Image src={user?.picture} className="size-9 rounded-full" />
            <div className="flex w-full flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1">
                  <span className="font-bold">{user?.name ?? 'MeeFund'}</span>
                  <LuBadgeCheck className={`${!user?.is_verified && 'hidden'} flex-shrink-0 fill-primary text-lg text-white`} />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <TextareaAutosize
                  id="textinput"
                  {...(!isCanWrite && { value: '' })}
                  disabled={isLoading || !user}
                  placeholder={textLabeling[initSubmitType?.type!]?.placeholder}
                  className="bg-transparent"
                />
                {memoizedImageContainer}
                <div className={`${!isMediaList.length && 'hidden'} flex w-full items-center justify-between`}>
                  <span className="text-sm text-gray-500">
                    {isMediaList.length}
                    <span className="font-semibold">/5 Files</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    {/* Implement total_size calculation here */}
                    <span className="font-semibold">/20MB</span>
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 [&_svg]:text-xl">
                <input onChange={handleMedia} multiple type="file" accept="image/*, video/*" id="file_upload" className="hidden" disabled={isLoading || !user} />
                <label htmlFor="file_upload" className="text-shade-0 hover:text-shade flex-shrink-0 cursor-pointer">
                  <LuImagePlus />
                </label>
                <LuMic className="flex-shrink-0 !cursor-not-allowed !opacity-20" />
                <LuListChecks className="flex-shrink-0 !cursor-not-allowed !opacity-20" />
                <select
                  value={isCategory}
                  disabled={isLoading || !user}
                  onChange={e => !isLoading && user && setCategory(e.target.value)}
                  className={`${initSubmitType?.type == 'posts' && '!block'} select select-bordered select-xs ml-auto hidden max-w-xs flex-shrink-0`}
                >
                  <option value={''} disabled selected>
                    Pilih Kategori
                  </option>
                  {POST_CATEGORY.map(
                    (x, i) =>
                      i > 0 && (
                        <option key={i} value={x.label.replaceAll(' ', '_').toUpperCase()}>
                          {x.label}
                        </option>
                      )
                  )}
                </select>
                <button disabled={isLoading || !user} onClick={handlePrepare} className="btn btn-primary btn-sm ml-auto flex-shrink-0">
                  {textLabeling[initSubmitType?.type!]?.['actionLabel']}
                </button>
              </div>
            </div>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="make_post_modal"></label>
      </div>
    </>
  );
});

export default ModalSubmit;
