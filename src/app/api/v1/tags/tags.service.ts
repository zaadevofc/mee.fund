import { Prisma } from '@prisma/client';
import { MakeError, MakeQueryError } from "../[[...route]]/route"
import prisma from '~/prisma';

export type getManyTagsType = {
  limit?: number;
  offset?: number;
  options?: Prisma.TagFindManyArgs;
}

export const getManyTags = async (props: getManyTagsType) => {
  try {
    const tags = await prisma.tag.findMany({
      take: Number(props.limit || 10),
      skip: Number(props.offset || 0),
      ...props.options
    })

    return tags;
  } catch (e) {
    console.log("🚀 ~ getManyTags ~ e:", e)
    MakeQueryError()
  }
}