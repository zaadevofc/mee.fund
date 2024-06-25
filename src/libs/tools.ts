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
    lastDay: '[kemarin pada] HH:mm',
    sameDay: '[hari ini] HH:mm',
    nextDay: '[Besok pada] HH:mm',
    lastWeek: '[hari] dddd [pada] HH:mm',
    nextWeek: '[hari] dddd [pada] HH:mm',
    sameElse: 'baru saja'
  }
})

export const dayjs = DayJS

export const getUsernameFromParams = (username: any) => {
  return decodeURIComponent(username).replaceAll('@', '')
}

export const generateUsername = (text: string) => {
  return (text.split(' ')[0] + Math.random().toString().slice(2, 5)).toLowerCase()
}

export const stringObj = (arr: any) => JSON.stringify(arr);

export const exclude = (obj: any, keys: any) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  );

export function excludeList(obj: any, keys: any) {
  return obj.map((obj: any) => exclude(obj, keys));
}

export function compareArrays(array1: any, array2: any) {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
}

export const signJWT = async (payload = {}, exp = 50) => {
  try {
    return await sign(
      { ...payload, exp: Math.floor(Date.now() / 1000) + exp },
      process.env.NEXT_PUBLIC_JWT_TOKEN!,
      "HS512"
    );
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const verifyJWT = async (token: string) => {
  try {
    let result = await verify(token, process.env.NEXT_PUBLIC_JWT_TOKEN!, "HS512")    
    return exclude(result, ['exp']);
  } catch (e) {
    console.log(e);
    return false;
  }
};