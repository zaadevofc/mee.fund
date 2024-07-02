'use server'

import { Prisma } from '@prisma/client';
import { extractTags } from './tools';
import toast from 'react-hot-toast';
import { uploadMedia } from './hosting';

export const handlePrepare = async ({ user, payload, props, setLoading, setFullCard }: any) => {
  if (!user) return;

  let media: Prisma.MediaCreateWithoutPostInput[] = [];
  let content = (globalThis as any)?.textinput.value;
  payload.content = content;
  payload.tags = extractTags('#', content);

  if (content.length == 0 && payload.media.length == 0) return toast.error('Konten minimal memiliki teks atau gambar!');
  if (props.inputMode == 'posts' && !payload.category) return toast.error('Pilih kategori postingan mu!');
  toast.loading(`Tunggu sedang mengupload files.`, { duration: 999999 });

  setLoading(true);
  setFullCard(false);

  if (payload.media.length > 0 && media.length !== payload.media.length) {
    for (const f of payload.media) {
      const file = f as any;
      const init = await uploadMedia(file.file, props.inputMode);
      console.log('🚀 ~ handlePrepare ~ init:', init);

      // media.push({
      //   url: init.cdnUrl + '/-/preview/',
      //   format: init.imageInfo?.format!,
      //   mimetype: init.mimeType!,
      //   width: init.imageInfo?.width,
      //   height: init.imageInfo?.height,
      //   file_name: init.originalFilename,
      //   file_id: init.uuid,
      //   long_size: file.size,
      //   short_size: bytes(file.size!),
      // });
    }
  }
};