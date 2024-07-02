import { Prisma } from '@prisma/client';
import { QueryFunction, UndefinedInitialDataOptions, UseMutationOptions, useMutation, useQuery } from "@tanstack/react-query";
import { exclude, signJWT } from "./tools";
import { getManyUsersType, getUserProfileType } from '~/app/api/v1/users/users.service';
import { createNewPostType, getManyPostsType } from '~/app/api/v1/posts/posts.service';
import { createNewCommentType } from '~/app/api/v1/comments/comments.service';

export const BASE_URL_API = '/api/v1'
const SecretKey = { secret: process.env.NEXT_PUBLIC_APIKEY! }

export const fetchJson = async (uri: string) => {
  const auth = await signJWT(SecretKey, 180);
  return await fetch(uri, {
    headers: { 'Authorization': `Bearer ${auth}` },
  }).then((x) => x.json());
}

export const postJson = async (uri: string, data: unknown) => {
  const auth = await signJWT(SecretKey, 180);
  return await fetch(uri, {
    body: JSON.stringify(data),
    method: "POST",
    headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${auth}` },
  }).then((x) => x.json());
}

export const postMedia = async (file: File, bucket: string) => {
  const auth = await signJWT(SecretKey, 180);

  const formData = new FormData()
  formData.append('file', file)
  formData.append('bucket', bucket)
  formData.append('token', auth.toString())

  return await fetch(BASE_URL_API + '/media/upload', {
    body: formData,
    method: "POST",
    headers: { 'Authorization': `Bearer ${auth}` },
  }).then((x) => x.json());
}

export const useQueryFetch = (fn: QueryFunction, key: string[], opts?: Partial<UndefinedInitialDataOptions>) =>
  useQuery({
    queryKey: key,
    queryFn: fn,
    refetchInterval: 30000,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true,
    // refetchOnWindowFocus: true,
    // gcTime: Infinity,
    ...opts,
  })

export const useMutationFetch = <T>(fn: (data: T) => Promise<T>, key: string[], opts?: Partial<UseMutationOptions<T, unknown, T, unknown>>) =>
  useMutation({
    mutationKey: key,
    mutationFn: fn as any,
    ...opts,
  })

export type FetchPostsType = {
  limit: number
  offset: number
  category: Prisma.NestedEnumPOST_CATEGORYFilter['equals']
  options: "default" | "newest" | "reposts" | "likes" | "bookmarks";
  [key: string]: unknown;
}

export type FetchCommentsType = {
  limit: number
  offset: number
  post_id: string
  [key: string]: unknown;
}

export type FetchTrendingTagsType = {
  limit: number
  offset: number
  [key: string]: unknown;
}

type FetchDetailPostType = {
  ids: string;
}

type PostLikeActionsType = {
  user_id: string
  post_id?: string
}

type PostRepostActionsType = {
  user_id: string
  post_id: string
}

type PostBookMarkActionsType = {
  user_id: string
  post_id: string
}

type CommentLikeActionsType = {
  user_id: string
  comment_id?: string
}

type CONTEXT_DATAType = {
  reqRefecth: "post" | "comment" | "reply" | "-";
  setReqRefecth: (data: "post" | "reply" | "comment" | "-") => void;
}

export const CONTEXT_DATA = (props?: CONTEXT_DATAType) => {
  return {
    // HANDLE EXTERNAL
    ...props,

    // HANDLE USERS
    FetchUserProfile: (props: getUserProfileType, status?: 'on' | 'off') => useQueryFetch(
      async () => {
        const token = await signJWT(props, 60)
        return await fetchJson(BASE_URL_API + `/users/profile?token=${token}`)
      },
      ['users/profile/' + Object.values(props).join('/')], { enabled: (status ?? 'on') == 'on' }
    ),
    FetchUserSuggestions: (props: getManyUsersType, status?: 'on' | 'off') => useQueryFetch(
      async () => {
        const token = await signJWT(props, 60)
        return await fetchJson(BASE_URL_API + `/users/suggestions?token=${token}`)
      },
      ['users/suggestions'], { enabled: (status ?? 'on') == 'on' }
    ),

    // HANDLE POSTS
    CreateNewPost: () => useMutationFetch<createNewPostType['payload']>(
      async (payload) => {
        const token = await signJWT({ payload }, 180)
        return await postJson(BASE_URL_API + `/posts/new`, { token })
      },
      ['post/new']
    ),
    FetchPosts: (props: getManyPostsType, status?: 'on' | 'off') => useQueryFetch(
      async () => {
        const token = await signJWT(props, 60)
        return await fetchJson(BASE_URL_API + `/posts?token=${token}`)
      },
      ['posts/' + Object.values(props).join('/')], { enabled: (status ?? 'on') == 'on' }
    ),
    FetchDetailPost: (props: FetchDetailPostType, status?: 'on' | 'off') => useQueryFetch(
      async () => {
        const token = await signJWT(props, 60)
        return await fetchJson(BASE_URL_API + `/post/detail?token=${token}`)
      },
      ['post/detail/' + props.ids], { enabled: (status ?? 'on') == 'on' }
    ),
    PostLikeActions: () => useMutationFetch<PostLikeActionsType>(
      async (data) => {
        const token = await signJWT(data, 180)
        return await postJson(BASE_URL_API + '/post/actions/likes', { token })
      },
      ['post/actions/likes']
    ),
    PostRepostActions: () => useMutationFetch<PostRepostActionsType>(
      async (data) => {
        const token = await signJWT(data, 180)
        return await postJson(BASE_URL_API + '/post/actions/reposts', { token })
      },
      ['post/actions/reposts']
    ),
    PostBookMarkActions: () => useMutationFetch<PostBookMarkActionsType>(
      async (data) => {
        const token = await signJWT(data, 180)
        return await postJson(BASE_URL_API + '/post/actions/bookmarks', { token })
      },
      ['post/actions/bookmarks']
    ),

    // HANDLE COMMENTS
    CreateNewComment: () => useMutationFetch<createNewCommentType['payload']>(
      async (payload) => {
        const token = await signJWT({ payload }, 180)
        return await postJson(BASE_URL_API + `/comment/new`, { token })
      },
      ['comment/new']
    ),
    CommentLikeActions: () => useMutationFetch<CommentLikeActionsType>(
      async (data) => {
        const token = await signJWT(data, 180)
        return await postJson(BASE_URL_API + '/comment/actions/likes', { token })
      },
      ['comment/actions/likes']
    ),
    FetchComments: (props: FetchCommentsType, status?: 'on' | 'off') => useQueryFetch(
      async () => {
        const token = await signJWT(props, 60)
        return await fetchJson(BASE_URL_API + `/comments?token=${token}`)
      },
      ['comments/' + props.post_id], { enabled: (status ?? 'on') == 'on' }
    ),
    FetchTrendingTags: (props: FetchTrendingTagsType, status?: 'on' | 'off') => useQueryFetch(
      async () => {
        const token = await signJWT(props, 60)
        return await fetchJson(BASE_URL_API + `/tags/trending?token=${token}`)
      },
      ['tags/trending'], { enabled: (status ?? 'on') == 'on' }
    ),
  }
}