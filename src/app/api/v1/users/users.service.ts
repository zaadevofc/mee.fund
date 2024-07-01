import { Prisma } from '@prisma/client';
import prisma from "~/prisma"
import { MakeError, MakeQueryError } from "../[[...route]]/route"
import { exclude } from '~/libs/tools';

export type getUserProfileType = ({ username: string } | { id: string }) & {
  request_id?: string
  options?: Prisma.UserFindUniqueArgs;
}
export type getManyUsersType = {
  limit: number;
  offset: number;
  options?: Prisma.UserFindManyArgs;
}

export const USER_BASIC_SCHEMA = {
  name: true,
  username: true,
  is_verified: true,
  picture: true,
  bio: true,
}

export const getManyUsers = async (props: getManyUsersType) => {
  try {
    const users = await prisma.user.findMany({
      take: Number(props.limit || 10),
      skip: Number(props.offset || 0),
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
    const profile = await getManyUsers({
      limit: 1, offset: 0,
      options: {
        where: exclude(props, ['request_id']),
        include: {
          ...(props.request_id && { followers: { where: { follower: { id: props.request_id } } } }),
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
      }
    })

    return profile?.[0];
  } catch (e) {
    console.log("🚀 ~ getUserProfile ~ e:", e)
    MakeQueryError()
  }
}