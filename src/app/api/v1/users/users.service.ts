import { Prisma } from '@prisma/client';
import { exclude } from '~/libs/tools';
import prisma from "~/prisma";
import { MakeQueryError } from "../[[...route]]/route";

export type getUserProfileType = {
  id?: string
  username?: string
  request_id?: string
  options?: Prisma.UserFindUniqueArgs;
}
export type getManyUsersType = {
  limit?: number;
  offset?: number;
  request_id?: string
  options?: Prisma.UserFindManyArgs;
}

export const USER_BASIC_SCHEMA = {
  id: true,
  name: true,
  role: true,
  username: true,
  is_verified: true,
  picture: true,
  visibility: true,
  bio: true,
}

export const getManyUsers = async (props: getManyUsersType) => {
  try {
    const users = await prisma.user.findMany({
      take: Number(props.limit || 10),
      skip: Number(props.offset || 0),
      select: {
        ...(props.request_id && { followers: { where: { follower: { id: props.request_id } } } }),
        ...USER_BASIC_SCHEMA,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
            post_likes: true,
            bookmarks: true,
            reposts: true,
          }
        }
      },
      ...props?.options
    });

    return users;
  } catch (e) {
    console.log("🚀 ~ getManyUsers ~ e:", e)
    MakeQueryError()
  }
}

export const getUserProfile = async (props: getUserProfileType) => {
  try {
    const post_likes = await prisma.postLike.count({
      where: { post: { user: { username: props.username } } }
    })

    const profile = await getManyUsers({
      limit: 1, offset: 0,
      options: {
        where: exclude(props, ['request_id']),
        select: {
          ...USER_BASIC_SCHEMA,
          ...(props.request_id && { followers: { where: { following: { id: props.request_id } } } }),
          posts: { select: { _count: { select: { likes: true } } } },
          _count: {
            select: {
              posts: true,
              followers: true,
              following: true,
              post_likes: true,
              bookmarks: true,
              reposts: true,
            },
          },
        },
        ...props?.options
      }
    })

    return { ...profile?.[0], _count: { ...(profile?.[0] as any)?._count, post_likes } };
  } catch (e) {
    console.log("🚀 ~ getUserProfile ~ e:", e)
    MakeQueryError()
  }
}

export type editUserProfileType = {
  opts: Prisma.UserUpdateArgs
}

export const editUserProfile = async (props: editUserProfileType) => {
  try {
    const edit = await prisma.user.update(props.opts)
    return edit
  } catch (e) {
    console.log("🚀 ~ editUserProfile ~ e:", e)
    MakeQueryError()
  }
}