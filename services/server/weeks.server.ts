import { BabyInfo, MomInfo, WeekData } from '@/types/babyData'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!

export const getFirstWeekInfo = async (): Promise<WeekData> => {
  const res = await fetch(
    `${BASE_URL}/api/proxy/weeks/public/my-day`,
    { cache: 'no-store' }
  )

  if (!res.ok) throw new Error('Failed to fetch first week')

  return res.json()
}

export const getMyDayWeekInfo = async (): Promise<WeekData> => {
  const res = await fetch(
    `${BASE_URL}/api/proxy/weeks/me/my-day`,
    { cache: 'no-store', credentials: 'include' }
  )

  if (!res.ok) throw new Error('Failed to fetch my day')

  return res.json()
}

export const getWeekBabyInfo = async (): Promise<BabyInfo> => {
  const res = await fetch(
    `${BASE_URL}/api/proxy/weeks/me/journey/baby`,
    { cache: 'no-store', credentials: 'include' }
  )

  if (!res.ok) throw new Error('Failed to fetch baby info')

  return res.json()
}

export const getWeekMomInfo = async (): Promise<MomInfo> => {
  const res = await fetch(
    `${BASE_URL}/api/proxy/weeks/me/journey/mom`,
    { cache: 'no-store', credentials: 'include' }
  )

  if (!res.ok) throw new Error('Failed to fetch mom info')

  return res.json()
}
