import { Prisma } from '@prisma/client';
import keygen from 'keygen';
import { getRandom, parseObj } from "~/libs/tools";
import prisma from '~/prisma';
import { MakeQueryError } from "../[[...route]]/route";
import { POST_MEDIA_BASIC_SCHEMA } from '../posts/posts.service';

export const SUPABASE_API = [
  parseObj(process.env.NEXT_PUBLIC_SUPABASE_API_1!),
  parseObj(process.env.NEXT_PUBLIC_SUPABASE_API_2!),
  parseObj(process.env.NEXT_PUBLIC_SUPABASE_API_3!),
]

export type createNewMediaType = {
  file: File;
  bucket: 'posts' | 'comments';
}

export type getManyMediaType = {
  limit?: number;
  offset?: number;
  options?: Prisma.MediaFindManyArgs;
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
    console.log("🚀 ~ createNewMedia ~ e:", e)
    MakeQueryError()
  }
}

export const getManyMedia = async (props: getManyMediaType) => {
  try {
    const media = await prisma.media.findMany({
      take: Number(props.limit || 10),
      skip: Number(props.offset || 0),
      select: POST_MEDIA_BASIC_SCHEMA,
      ...props?.options
    });

    return media;
  } catch (e) {
    console.log("🚀 ~ getManyMedia ~ e:", e)
    MakeQueryError()
  }
}