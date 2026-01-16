import { BabyInfo, MomInfo, WeekData } from '@/types/babyData'
import { headers } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is missing in .env')
}

export const getFirstWeekInfo = async (): Promise<WeekData> => {
  const res = await fetch(`${API_URL}/weeks/public/my-day`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    console.error(`Status: ${res.status} URL: ${res.url}`)
    throw new Error('Failed to fetch first week')
  }

  return res.json()
}

export const getMyDayWeekInfo = async (): Promise<WeekData> => {
  const cookieStore = (await headers()).get('cookie') || ''

  const res = await fetch(`${API_URL}/weeks/me/my-day`, {
    cache: 'no-store',
    headers: {
      Cookie: cookieStore,
    },
  })

  if (!res.ok) throw new Error('Failed to fetch my day')
  return res.json()
}

export const getWeekBabyInfo = async (): Promise<BabyInfo> => {
  const cookieStore = (await headers()).get('cookie') || ''

  const res = await fetch(`${API_URL}/weeks/me/journey/baby`, {
    cache: 'no-store',
    headers: {
      Cookie: cookieStore,
    },
  })

  if (!res.ok) throw new Error('Failed to fetch baby info')
  return res.json()
}

export const getWeekMomInfo = async (): Promise<MomInfo> => {
  const cookieStore = (await headers()).get('cookie') || ''

  const res = await fetch(`${API_URL}/weeks/me/journey/mom`, {
    cache: 'no-store',
    headers: {
      Cookie: cookieStore,
    },
  })

  if (!res.ok) throw new Error('Failed to fetch mom info')
  return res.json()
}
