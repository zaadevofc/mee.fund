import { Prisma } from '@prisma/client';
import { QueryFunction, UndefinedInitialDataOptions, UseMutationOptions, useMutation, useQuery } from "@tanstack/react-query";
import { exclude, signJWT } from "./tools";
import useSWR from 'swr';
import { getManyUsersType, getUserProfileType } from '~/app/api/v1/users/users.service';
import { createNewPostType, getManyPostsType, getPostDetailType } from '~/app/api/v1/posts/posts.service';
import { createNewCommentType, getManyCommentsType } from '~/app/api/v1/comments/comments.service';
import { makeActionsType } from '~/app/api/v1/actions/actions.service';
import { cache } from 'react';

export const BASE_URL_API = '/api/v1'
const SecretKey = { secret: process.env.NEXT_PUBLIC_APIKEY! }

export const fetchJson = async (url: string) => {
  const auth = await signJWT(SecretKey, 180);
  return await fetch(url, {
    headers: { 'Authorization': `Bearer ${auth}` },
  }).then((x) => x.json());
}

export const postJson = async (url: string, data: unknown) => {
  const auth = await signJWT(SecretKey, 180);
  return await fetch(url, {
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
    refetchIntervalInBackground: true,
    // refetchOnReconnect: true,
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

export type CONTEXT_DATAType = {
  showAsideLeft: boolean
  setShowAsideLeft: (data: any) => any
  makePlaceholder: any
  setMakePlaceholder: (data: any) => any
  initTempPosts: any
  setInitTempPosts: (data: any) => any
  initTempComments: any
  setInitTempComments: (data: any) => any
  initSubmitType: { type: 'posts' | 'comments', post_id?: string; parent_id?: string }
  setInitSubmitType: (data: CONTEXT_DATAType['initSubmitType']) => any
}

export const CONTEXT_DATA = (props?: CONTEXT_DATAType) => {
  return {
    // HANDLE EXTERNAL
    ...props,

    // HANDLE USERS
    FetchUserProfile: (props: getUserProfileType, status?: 'on' | 'off') => useQueryFetch(
      async () => {
        const token = await signJWT(props, 60)
        return cache(async () => await fetchJson(BASE_URL_API + `/users/profile?token=${token}`))()
      },
      ['users/profile/' + Object.values(props).join('/')], { enabled: (status ?? 'on') == 'on' }
    ),
    FetchUserSuggestions: (props: getManyUsersType, status?: 'on' | 'off') => useQueryFetch(
      async () => {
        const token = await signJWT(props, 60)
        return cache(async () => await fetchJson(BASE_URL_API + `/users/suggestions?token=${token}`))()
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
        return cache(async () => await fetchJson(BASE_URL_API + `/posts?token=${token}`))()
      },
      ['posts/' + Object.values(props).join('/')], { enabled: (status ?? 'on') == 'on' }
    ),
    FetchCommentsPost: (props: getManyCommentsType, status?: 'on' | 'off') => useQueryFetch(
      async () => {
        const token = await signJWT(props, 60)
        return cache(async () => await fetchJson(BASE_URL_API + `/posts/comments?token=${token}`))()
      },
      ['posts/comments/' + Object.values(props).join('/')], { enabled: (status ?? 'on') == 'on' }
    ),
    FetchDetailPost: (props: getPostDetailType, status?: 'on' | 'off') => useQueryFetch(
      async () => {
        const token = await signJWT(props, 60)
        return cache(async () => await fetchJson(BASE_URL_API + `/posts/detail?token=${token}`))()
      },
      ['posts/detail/' + Object.values(props).join('/')], { enabled: (status ?? 'on') == 'on' }
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
        return await postJson(BASE_URL_API + `/comments/new`, { token })
      },
      ['comments/new']
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
        return cache(async () => await fetchJson(BASE_URL_API + `/comments?token=${token}`))()
      },
      ['comments/' + props.post_id], { enabled: (status ?? 'on') == 'on' }
    ),
    FetchTrendingTags: (props: FetchTrendingTagsType, status?: 'on' | 'off') => useQueryFetch(
      async () => {
        const token = await signJWT(props, 60)
        return cache(async () => await fetchJson(BASE_URL_API + `/tags/trending?token=${token}`))()
      },
      ['tags/trending'], { enabled: (status ?? 'on') == 'on' }
    ),

    // HANDLE ACTIONS
    CreateNewActions: () => useMutationFetch<makeActionsType>(
      async (payload) => {
        const token = await signJWT(payload, 180)
        return await postJson(BASE_URL_API + `/actions/${payload.type}/${payload.actions}`, { token })
      },
      ['actions/']
    ),
  }
}