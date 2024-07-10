'use client';

import { MutateOptions } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { InputTextarea } from 'primereact/inputtextarea';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LuFilePlus } from 'react-icons/lu';
import { SystemContext } from '~/app/providers';
import { postMedia } from '~/libs/hooks';
import { extractTags } from '~/libs/tools';

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
        if (Number(bytes(isMediaList.reduce((a, b: any) => a + b.file.size, 0))) > Number(bytes('20MB')))
          return toast.error('Media tidak boleh lebih dari 20MB!');

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

  return (
    <>
      <div className="flex flex-col gap-3">
        <h1 className='text-lg font-semibold'>{initSubmitType?.type == 'posts' ? 'Buat postingan baru' : 'Berikan komentar'}</h1>
        <InputTextarea autoResize placeholder='Dapat hal seru di mulai dari kamu!' className='!p-0 leading-[21px]' />
        <div className='flex items-center gap-4'>
          <LuFilePlus className='text-xl flex-shrink-0' />
        </div>
      </div>
    </>
  );
});

export default ModalSubmit;
