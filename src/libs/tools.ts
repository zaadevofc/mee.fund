import { default as DayJS } from 'dayjs'
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
  return text.split(' ')[0] + Math.random().toString().slice(2, 5)
}