import { Prisma } from '@prisma/client';
import { exclude } from '~/libs/tools';
import prisma from '~/prisma';
import { MakeQueryError } from '../[[...route]]/route';
import { USER_BASIC_SCHEMA } from "../users/users.service";

export type getManyPostsType = {
  limit: number;
  offset: number;
  username?: string;
  request_id?: string;
  type?: "random" | "reposts" | "likes" | "bookmarks" | undefined;
  category?: Prisma.NestedEnumPOST_CATEGORYFilter['equals']
  options?: Prisma.PostFindManyArgs;
}

export type createNewPostType = {
  payload: Prisma.PostCreateArgs;
  options?: Prisma.PostCreateArgs;
}

export type getPostDetailType = ({ ids: string } | { id: string }) & {
  request_id?: string;
}

export const POST_COUNT_BASIC_SCHEMA = {
  likes: true,
  comments: true,
  bookmarks: true,
  reposts: true,
}

export const POST_MEDIA_BASIC_SCHEMA = {
  url: true,
  width: true,
  height: true,
  orientation: true,
  mimetype: true,
}

export const POST_BASIC_SCHEMA = {
  id: true,
  ids: true,
  content: true,
  category: true,
  created_at: true,
  updated_at: true,
}

export const getManyPosts = async (props: getManyPostsType) => {
  try {
    let limit = Number(props.limit || 10);
    let offset = (Number(props.offset || 1) - 1) * limit

    let posts = await prisma.post.findMany({
      take: limit + 1,
      skip: offset,
      orderBy: { created_at: 'desc' },
      select: {
        ...POST_BASIC_SCHEMA,
        _count: { select: POST_COUNT_BASIC_SCHEMA },
        media: { select: POST_MEDIA_BASIC_SCHEMA },
        user: { select: USER_BASIC_SCHEMA },

        ...(props.request_id && { likes: { where: { user: { id: props.request_id } } } }),
        ...(props.request_id && { bookmarks: { where: { user: { id: props.request_id } } } }),
        ...(props.request_id && { reposts: { where: { user: { id: props.request_id } } } }),

        comments: {
          orderBy: { likes: { _count: 'desc' } },
          take: 1,
          select: {
            _count: { select: { likes: true } },
            user: { select: USER_BASIC_SCHEMA },
            content: true,
            created_at: true
          }
        }
      },
      ...props.options
    })

    posts = posts.map((post: any) => ({
      ...post,
      comments: post.comments.filter((c: any) => c._count.likes >= 10)
    }));

    const hasMore = posts.length > limit
    const result = hasMore ? posts.slice(0, -1) : posts

    return { posts: result, hasMore }
  } catch (e) {
    console.log("🚀 ~ getManyPosts ~ e:", e)
    MakeQueryError()
  }
}

export const createNewPost = async (props: createNewPostType) => {
  try {
    const create = await prisma.post.create({
      ...props.payload,
      ...props.options
    })

    return create
  } catch (e) {
    console.log("🚀 ~ createNewPost ~ e:", e)
    MakeQueryError()
  }
}

export const getPostDetail = async (props: getPostDetailType) => {
  try {
    const { request_id } = props;
    const post = await getManyPosts({
      limit: 1, offset: 0, request_id, options: {
        where: { ...exclude(props, ['request_id']) }
      }
    })

    return post?.posts?.[0]
  } catch (e) {
    console.log("🚀 ~ getPostDetail ~ e:", e)
    MakeQueryError()
  }
}