import { Prisma } from '@prisma/client';
import prisma from '~/prisma';
import { MakeQueryError } from "../[[...route]]/route";
import { POST_MEDIA_BASIC_SCHEMA } from '../posts/posts.service';

export type getManyMediaType = {
  limit?: number;
  offset?: number;
  options?: Prisma.MediaFindManyArgs;
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