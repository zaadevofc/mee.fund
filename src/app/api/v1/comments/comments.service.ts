import { Prisma } from '@prisma/client';
import { exclude } from '~/libs/tools';
import prisma from '~/prisma';
import { MakeQueryError } from "../[[...route]]/route";
import { POST_BASIC_SCHEMA, POST_MEDIA_BASIC_SCHEMA } from '../posts/posts.service';
import { USER_BASIC_SCHEMA } from '../users/users.service';

export type getManyCommentsType = {
  limit: number;
  offset: number;
  request_id?: string;
  post_id?: string;
  options?: Prisma.CommentFindManyArgs;
}

export type createNewCommentType = {
  payload: Prisma.CommentCreateArgs;
  options?: Prisma.CommentCreateArgs;
}

export const getManyComments = async (props: getManyCommentsType) => {
  try {
    const getReplies = (depth: number): any => {
      if (depth <= 0) return {};
      return {
        select: {
          ...exclude(POST_BASIC_SCHEMA, ['category']),
          _count: { select: { likes: true, replies: true } },
          user: { select: USER_BASIC_SCHEMA },
          media: { select: POST_MEDIA_BASIC_SCHEMA },
          ...(props.request_id && { likes: { where: { user: { id: props.request_id } } } }),
          replies: getReplies(depth - 1)
        }
      };
    }

    let limit = Number(props.limit || 10);
    let offset = (Number(props.offset || 1) - 1) * limit

    let comments = await prisma.comment.findMany({
      take: limit + 1,
      skip: offset,
      orderBy: { created_at: 'desc' },
      ...getReplies(5),
      ...props.options
    })

    const hasMore = comments.length > limit
    const result = hasMore ? comments.slice(0, -1) : comments

    return { comments: result, hasMore }
  } catch (e) {
    console.log("🚀 ~ getManyComments ~ e:", e)
    MakeQueryError()
  }
}

export const createNewComment = async (props: createNewCommentType) => {
  try {
    const create = await prisma.comment.create({
      ...props.payload,
      ...props.options
    })

    return create
  } catch (e) {
    console.log("🚀 ~ createNewComment ~ e:", e)
    MakeQueryError()
  }
}