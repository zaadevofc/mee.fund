import { default as DayJS } from 'dayjs'
import { sign, verify } from "hono/jwt";
import 'dayjs/locale/id'
import DayJSCalendar from "dayjs/plugin/calendar"
import DayJSUpdateLocale from 'dayjs/plugin/updateLocale'

DayJS.locale('id')
DayJS.extend(DayJSCalendar)
DayJS.extend(DayJSUpdateLocale)
DayJS.updateLocale('id', {
  calendar: {
    lastDay: '[kemarin] HH:mm',
    sameDay: 'HH:mm',
    nextDay: '[besok] HH:mm',
    lastWeek: 'DD MMM, HH:mm',
    nextWeek: 'DD MMM, HH:mm',
    sameElse: 'DD/MM/YYYY'
  }
})

export const dayjs = DayJS

export const getUsernameFromParams = (username: string): string =>
  decodeURIComponent(username).replace(/@/g, '')

export const generateUsername = (text: string): string =>
  `${text.split(' ')[0]}${Math.random().toString(36).substr(2, 3)}`.toLowerCase()

export const stringObj = JSON.stringify

export const exclude = (obj: Record<string, any>, keys: string[]): Record<string, any> => {
  const result: Record<string, any> = {}
  for (const key in obj) {
    if (!keys.includes(key)) result[key] = obj[key]
  }
  return result
}

export const excludeList = (objs: Record<string, any>[], keys: string[]): Record<string, any>[] =>
  objs.map(obj => exclude(obj, keys))

export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

export const compareArrays = <T>(array1: T[], array2: T[]): boolean =>
  array1.length === array2.length && array1.every((value, index) => value === array2[index])

export const extractTags = (tag: string, text: string): string[] => {
  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const rgx = new RegExp(`${escapedTag}([\\w\\u0590-\\u05ff]+)`, 'gi')
  return text.match(rgx)?.map(tag => tag.slice(1)) || []
}

export const signJWT = async (payload = {}, exp = 50): Promise<string | false> => {
  try {
    return await sign(
      { ...payload, exp: Math.floor(Date.now() / 1000) + exp },
      process.env.NEXT_PUBLIC_JWT_TOKEN!,
      "HS512"
    )
  } catch (e) {
    console.error(e)
    return false
  }
}

export const verifyJWT = async (token: string): Promise<Record<string, any> | false> => {
  try {
    const result = await verify(token, process.env.NEXT_PUBLIC_JWT_TOKEN!, "HS512")
    return exclude(result, ['exp'])
  } catch (e) {
    console.error(e)
    return false
  }
}