import { Prisma } from '@prisma/client';
import { MutationFunction, QueryFunction, UndefinedInitialDataOptions, UseMutationOptions, useMutation, useQuery } from "@tanstack/react-query";
import { signJWT } from "./tools";

export const BASE_URL_API = '/api/signals'
export const fetchJson = async (uri: string) => await fetch(uri).then((x) => x.json());
export const postJson = async (uri: string, data: unknown) =>
  await fetch(uri, {
    body: JSON.stringify(data),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).then((x) => x.json());

export const useQueryFetch = (fn: QueryFunction, key: string[], opts?: Partial<UndefinedInitialDataOptions>) =>
  useQuery({
    queryKey: key,
    queryFn: fn,
    refetchInterval: 10000,
    gcTime: Infinity,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
    ...opts,
  })

export const useMutationFetch = (fn: MutationFunction, key: string[], opts?: Partial<UseMutationOptions>) =>
  useMutation({
    mutationKey: key,
    mutationFn: fn,
    ...opts,
  })

type FetchUserProfileType = {
  username: string
}

export type FetchPostsType = {
  limit: number
  offset: number
  category: Prisma.NestedEnumPOST_CATEGORYFilter['equals']
  options: "default" | "newest" | "reposts" | "likes" | "bookmarks";
  [key: string]: unknown;
}

type FetchDetailPostType = {
  ids: string;
}

export const CONTEXT_DATA = {
  FetchUserProfile: (props: FetchUserProfileType, status?: 'on' | 'off') => useQueryFetch(
    async () => {
      const token = await signJWT(props, 60)
      return await fetchJson(BASE_URL_API + `/user/profile?token=${token}`)
    },
    ['user/profile/' + props.username], { enabled: (status ?? 'on') == 'on' }
  ),
  CreateNewPost: () => useMutationFetch(
    async (payload: unknown) => {
      const token = await signJWT({ payload }, 180)
      return await postJson(BASE_URL_API + `/post/new`, { token })
    },
    ['post/new']
  ),
  FetchPosts: (props: FetchPostsType, status?: 'on' | 'off') => useQueryFetch(
    async () => {
      const token = await signJWT(props, 60)
      console.log("🚀 ~ props:", props)
      return await fetchJson(BASE_URL_API + `/posts?token=${token}`)
    },
    ['posts/' + props.category + '/' + props.options + '/' + props?.username], { enabled: (status ?? 'on') == 'on' }
  ),
  FetchDetailPost: (props: FetchDetailPostType, status?: 'on' | 'off') => useQueryFetch(
    async () => {
      const token = await signJWT(props, 60)
      return await fetchJson(BASE_URL_API + `/post/detail?token=${token}`)
    },
    ['post/detail/' + props.ids], { enabled: (status ?? 'on') == 'on' }
  ),
}