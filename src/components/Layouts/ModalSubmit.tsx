'use client';

import { MutateOptions } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { InputTextarea } from 'primereact/inputtextarea';
import { memo, useCallback, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { LuArrowRight, LuCheck, LuPlusCircle } from 'react-icons/lu';
import { SystemContext } from '~/app/providers';
import { POST_CATEGORY } from '~/consts';
import { extractTags } from '~/libs/tools';
import { cn } from '~/libs/utils';
import ImageContainer from '../Services/ImageContainer';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const bytesImport = import('bytes').then(mod => mod.default);
const keygenImport = import('keygen').then(mod => mod.default);
const mimeImport = import('mime-types').then(mod => mod.default);

const textLabeling = {
  posts: {
    placeholder: 'Dapat hal seru dimulai dari kamu!',
    actionLabel: 'Posting',
    successPost: 'Postingan berhasil di publikasi.',
  },
  comments: {
    placeholder: 'Beri pendapatanmu!',
    actionLabel: 'Kirim',
    successPost: 'Komentar berhasil di publikasi.',
  },
};

const ModalSubmit = memo(() => {
  const [isLoading, setLoading] = useState(false);
  const [isCanNext, setCanNext] = useState(false);
  const [isMediaList, setMediaList] = useState([]);
  const [isCategory, setCategory] = useState('');

  const { data: user }: any = useSession();
  const router = useRouter();
  const { CreateNewPost, CreateNewComment, showSubmitModal, setSubmitModal, setSubmitFinish } = useContext(SystemContext);

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
    setSubmitFinish!(false);
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
    if (showSubmitModal?.type == 'posts' && !isCategory) return toast.error('Pilih kategori postingan mu!');
    toast.loading(`Tunggu sedang mengupload files.`, { duration: 999999 });

    setLoading(true);

    if (isMediaList.length > 0 && media.length !== isMediaList.length) {
      for (const f of isMediaList) {
        const file = (f as any).file;

        if (file.size > Number(bytes('50MB'))) return;
        if (!/^image|video/.test(file.type)) return;
        if (!/^image|video/.test(mime.lookup(file.name).toString())) return;

        const { data, error } = await supabase.storage.from(showSubmitModal?.type!).upload(keygen.url(12), file, {
          cacheControl: '99999',
          upsert: false,
        });
        const config = {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL! + '/storage/v1/object/public/' + data?.fullPath,
          format: '.' + mime.extension(file.type).toString(),
          mimetype: file.type,
          file_name: file.name,
          file_id: data?.id,
          long_size: file.size,
          short_size: bytes(file.size),
          metadata: {
            user: `${user?.id}-${user?.name}-${user?.username}`,
            tags: payload.tags,
            bucket: showSubmitModal?.type!,
            category: payload.category,
          },
        };

        media.push(config);
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
          setSubmitFinish!(true);
          toast.remove();
          if (x.error) {
            toast.error('Gagal mempublikasi, silahkan coba lagi.', { duration: 5000 });
            toast.error('Jika masalah berlanjut, coba hubungi author.', { duration: 5000 });
            setLoading(false);
          }

          if (x.data) {
            toast.success(textLabeling[showSubmitModal?.type!]?.successPost);
            setCategory('');
            setMediaList([]);
            setLoading(false);
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

            if (showSubmitModal?.type == 'posts') {
              router.push(`/post/${newz.ids}`);
            }
          }
        },
      };

      let schema = {
        posts: () =>
          showSubmitModal?.type == 'posts' &&
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
          showSubmitModal?.type == 'comments' &&
          createNewComment.mutate(
            {
              data: {
                post: { connect: { ids: showSubmitModal?.post_id } },
                ...(showSubmitModal?.parent_id && { parent: { connect: { id: showSubmitModal?.parent_id } } }),
                ...defaults,
              },
            },
            handler
          ),
      };

      schema[showSubmitModal?.type!]?.();
    }
  }, [user, isMediaList, isCategory, showSubmitModal, createNewPost, createNewComment, addReplies]);

  const handleMedia = useCallback(
    (e: any) => {
      if (isMediaList.length >= 5) return toast.error('Maksimal 5 hanya media!');

      bytesImport.then(bytes => {
        if (Number(bytes(isMediaList.reduce((a, b: any) => a + b.file.size, 0))) > Number(bytes('50MB')))
          return toast.error('Media tidak boleh lebih dari 20MB!');

        for (const f of e.target.files) {
          const file = f;
          if (file.size > Number(bytes('50MB'))) return toast.error('Media tidak boleh lebih dari 20MB!');
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

  const canNext = () => {
    let content = (globalThis as any)?.textinput.value;
    let media = isMediaList.length;
    if (content.length > 0 || media > 0) {
      setCanNext(true);
    } else {
      toast.error('Konten minimal memiliki teks atau gambar!');
      setCanNext(false);
    }
  };

  return (
    <>
      <Dialog open={showSubmitModal?.open} onOpenChange={x => setSubmitModal!((p: any) => ({ ...p, open: x }))}>
        <DialogContent className='rounded-lg max-[460px]:h-dvh'>
          <div className="flex flex-col gap-3">
            <h1 className="text-lg font-semibold">{showSubmitModal?.type == 'posts' ? 'Buat postingan baru' : 'Berikan komentar'}</h1>
            <div className="flex flex-col gap-2">
              <InputTextarea
                id="textinput"
                autoResize
                disabled={isLoading || !user}
                placeholder={textLabeling[showSubmitModal?.type!]?.placeholder}
                className="!p-0 text-[15px] leading-[21px]"
              />
              <ImageContainer
                triggers={['onDoubleClick']}
                small
                media={isMediaList.map((x: any) => ({ src: x.url, type: x.file.type }))}
                onMediaClick={(x: any, i) => {
                  !isLoading && user && setMediaList(f => f.filter((y: any) => y.url != x.src));
                }}
              />
            </div>
            <div className="flex w-full items-center gap-2">
              <input onChange={handleMedia} multiple type="file" accept="image/*, video/*" id="file_upload" className="hidden" disabled={isLoading || !user} />
              <Button size={'sm'} variant={'outline'}>
                <label htmlFor="file_upload" className="flex cursor-pointer items-center gap-x-2">
                  <LuPlusCircle className="text-shade text-lg" /> Tambah File
                </label>
              </Button>
              <Dialog open={showSubmitModal?.type == 'posts' && isCanNext ? undefined : false}>
                <DialogTrigger className="ml-auto border-none p-0" disabled={isLoading || !user}>
                  <Button
                    disabled={isLoading || !user}
                    onClick={showSubmitModal?.type == 'posts' ? canNext : handlePrepare}
                    size={'sm'}
                    variant={'secondary'}
                    className="gap-x-2"
                  >
                    <LuArrowRight className="text-shade text-lg" /> {showSubmitModal?.type == 'posts' ? 'Lanjut' : 'Kirim'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-lg p-1 max-[460px]:h-dvh">
                  <div className="relative flex flex-col gap-3">
                    <h1 className="p-4 text-lg font-semibold">Pilih Kategori</h1>
                    <div className="hide-scroll flex max-h-[90dvh] flex-col items-start gap-3 overflow-y-scroll pb-20 min-[460px]:max-h-[60dvh]">
                      {POST_CATEGORY.slice(1).map((x, i) => {
                        const value = x.label.replaceAll(' ', '_').toUpperCase();
                        return (
                          <Button
                            onClick={() => setCategory(value)}
                            variant={isCategory == value ? 'secondary' : 'ghost'}
                            className="w-full justify-start gap-x-4 border-none"
                          >
                            <x.icon className="text-shade text-lg" /> {x.label}
                            {isCategory == value && <LuCheck className="text-shade ml-auto text-lg" />}
                          </Button>
                        );
                      })}
                    </div>
                    <div className={cn('absolute bottom-0 flex w-full items-center border-t bg-secondary-50 p-4', !isCategory && 'hidden')}>
                      <Button disabled={isLoading || !user} onClick={handlePrepare} size={'sm'} variant={'secondary'} className="ml-auto gap-x-2">
                        <LuArrowRight className="text-shade text-lg" /> Kirim
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default ModalSubmit;
