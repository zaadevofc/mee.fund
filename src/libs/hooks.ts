import { QueryFunction, UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { signJWT } from "./tools";

export const BASE_URL_API = '/api/signals'
export const fetchJson = async (uri: string) => await fetch(uri).then((x) => x.json());

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

export const CONTEXT_DATA = {
  FetchUserProfile: (username: string, status?: 'on' | 'off') => useQueryFetch(
    async () => {
      const token = await signJWT({ username }, 10)
      return await fetchJson(BASE_URL_API + `/user/profile?token=${token}`)
    },
    ['user/profile'], { enabled: (status ?? 'on') == 'on' }
  ),
}