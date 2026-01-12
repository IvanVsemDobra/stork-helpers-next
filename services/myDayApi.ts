import { protectedApi } from './axios'

export const myDayApi = {
  getFirstWeekInfo: () =>
    protectedApi.get('/proxy/weeks/public/my-day'),
}