import { MakeQueryError } from "../[[...route]]/route"
import { getRandom, parseObj } from "~/libs/tools";
import keygen from 'keygen'

export const SUPABASE_API = [
  parseObj(process.env.NEXT_PUBLIC_SUPABASE_API_1!),
  parseObj(process.env.NEXT_PUBLIC_SUPABASE_API_2!),
  parseObj(process.env.NEXT_PUBLIC_SUPABASE_API_3!),
]

export type createNewMediaType = {
  file: File;
  bucket: 'posts' | 'comments';
}

export const createNewMedia = async (props: createNewMediaType) => {
  try {
    const API = getRandom(SUPABASE_API)
    const url = `${API[0]}/storage/v1/object/${props.bucket}/${keygen.url(12)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API[1]}` },
      body: props.file,
    });

    const create = await res.json()
    const uri = API[0] + 'storage/v1/object/public/' + create.Key;

    return { ...create, uri }
  } catch (e) {
    MakeQueryError()
  }
}