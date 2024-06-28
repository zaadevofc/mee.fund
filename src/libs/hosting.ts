import keygen from 'keygen'
import { createClient } from '@supabase/supabase-js'
import { uploadFile } from "@uploadcare/upload-client";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!,
)

export const uploadMedia = async (file: File, { type, alt, tags }: { type?: string; alt?: string; tags?: any }) => {
  return await uploadFile(file, {
    publicKey: process.env.NEXT_PUBLIC_HOSTING_KEY!,
    store: "auto",
    source: 'publics',
    fileName: keygen.url(12),
    integration: 'uploadcare',
    metadata: {
      part: "meefund.storage",
      url: "https://mee.fund",
      type: type!,
      alt: alt!,
      tags: tags
    },
  });
}

// export const uploadFile = async (file: File, { bucket }: { bucket: string }) => {
//   const { data, error } = await supabase.storage
//     .from(bucket)
//     .upload(`${keygen.url(12)}`, file, {
//       cacheControl: '9999999',
//       upsert: false
//     })
//   if (error) {
//     console.log(error)
//   }
//   console.log({ file_upload: data })
//   return data
// }