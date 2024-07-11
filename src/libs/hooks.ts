import { Prisma } from '@prisma/client';
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import useSWR from 'swr';
import { makeActionsType } from '~/app/api/v1/actions/actions.service';
import { createNewCommentType, getManyCommentsType } from '~/app/api/v1/comments/comments.service';
import { createNewPostType, getManyPostsType } from '~/app/api/v1/posts/posts.service';
import { MakeSearchType } from '~/app/api/v1/search/search.service';
import { getManyTagsType } from '~/app/api/v1/tags/tags.service';
import { getManyUsersType, getUserProfileType } from '~/app/api/v1/users/users.service';
import { signJWT } from "./tools";

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

  return await fetch(process.env.NEXT_PUBLIC_HOST_UPLOAD_URL!, {
    body: formData,
    method: "POST",
    headers: { 'Authorization': `Bearer ${auth}` },
    cache: 'force-cache'
  }).then((x) => x.json());
}

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

export type CONTEXT_DATAType = {
  showAuthModal: boolean
  setAuthModal: (data: any) => any
  isSubmitFinish: boolean
  setSubmitFinish: (data: any) => any
  showSubmitModal: {
    open: boolean;
    type?: 'posts' | 'comments';
    post_id?: string;
    parent_id?: string;
  }
  setSubmitModal: (data: any) => any
  activeVideoId: string | null;
  setActiveVideo: (id: string | null) => void;
}

export const CONTEXT_DATA = (props?: CONTEXT_DATAType) => {
  return {
    // HANDLE EXTERNAL
    ...props,

    // HANDLE POSTS
    CreateNewPost: () => useMutationFetch<createNewPostType['payload']>(
      async (payload) => {
        const token = await signJWT({ payload }, 180)
        return await postJson(BASE_URL_API + `/posts/new`, { token })
      },
      ['post/new']
    ),

    // HANDLE COMMENTS
    CreateNewComment: () => useMutationFetch<createNewCommentType['payload']>(
      async (payload) => {
        const token = await signJWT({ payload }, 180)
        return await postJson(BASE_URL_API + `/comments/new`, { token })
      },
      ['comments/new']
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

export const fetchAPi = async ([url, payload]: any) => {
  const token = await signJWT(payload, 180)
  const uri = BASE_URL_API + url + '?token=' + token
  const auth = await signJWT(SecretKey, 180);
  return await fetch(uri, {
    headers: { 'Authorization': `Bearer ${auth}` },
  }).then((x) => x.json());
}

type HookType = {
  disabled?: boolean
}

export const usePosts = (payload: getManyPostsType, opts?: HookType) => {
  return useSWR(!opts?.disabled && [`/posts/${payload.ids || ''}`, payload], fetchAPi, { revalidateOnFocus: false })
}

export const useComments = (payload: getManyCommentsType, opts?: HookType) => {
  return useSWR(!opts?.disabled && [`/posts/${payload.post_id || ''}/comments`, payload], fetchAPi, { revalidateOnFocus: false })
}

export const useTopTags = (payload: getManyTagsType, opts?: HookType) => {
  return useSWR(!opts?.disabled && [`/tags/trending`, payload], fetchAPi, { revalidateOnFocus: false })
}

export const useTopUsers = (payload: getManyUsersType, opts?: HookType) => {
  return useSWR(!opts?.disabled && [`/users/suggestions`, payload], fetchAPi, { revalidateOnFocus: false })
}

export const useUsers = (payload: getUserProfileType, opts?: HookType) => {
  return useSWR(!opts?.disabled && [`/users/${payload.username || ''}`, payload], fetchAPi, { revalidateOnFocus: false })
}

export const useSearch = (payload: MakeSearchType, opts?: HookType) => {
  return useSWR(!opts?.disabled && [`/search`, payload], fetchAPi, { revalidateOnFocus: false })
}