import { BabyInfo, MomInfo, WeekData, MomState, BabyState } from '@/types/babyData'
import { cookies, headers } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is missing in .env')
}

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const headerList = await headers()
  const cookie = headerList.get('cookie')
  return cookie ? { Cookie: cookie } : {}
}

export const getFirstWeekInfo = async (): Promise<WeekData> => {
  const res = await fetch(`${API_URL}/weeks/public/my-day`, {
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('Failed to fetch public week info')
  return res.json()
}

export const getMyDayWeekInfo = async (): Promise<WeekData> => {
  const authHeaders = await getAuthHeaders()

  const res = await fetch(`${API_URL}/weeks/me/my-day`, {
    cache: 'no-store',
    headers: authHeaders,
  })

  if (!res.ok) throw new Error('Failed to fetch my day')
  return res.json()
}

export const getWeekBabyInfo = async (): Promise<BabyInfo> => {
  const authHeaders = await getAuthHeaders()

  const res = await fetch(`${API_URL}/weeks/me/journey/baby`, {
    cache: 'no-store',
    headers: authHeaders,
  })

  if (!res.ok) throw new Error('Failed to fetch baby info')
  return res.json()
}

export const getWeekMomInfo = async (): Promise<MomInfo> => {
  const authHeaders = await getAuthHeaders()

  const res = await fetch(`${API_URL}/weeks/me/journey/mom`, {
    cache: 'no-store',
    headers: authHeaders,
  })

  if (!res.ok) throw new Error('Failed to fetch mom info')
  return res.json()
}

//============For Journey requests only============/

const getJourneyAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = (await cookies()).get('accessToken')?.value
  if (!token) return {}

  // даємо і Cookie, і Bearer — щоб не гадати, що бек очікує
  return {
    Cookie: `accessToken=${token}`,
    Authorization: `Bearer ${token}`,
  }
}

export const getBabyInfoByWeekNumber = async (weekNumber: number) => {
  const res = await fetch(`/api/proxy/weeks/me/journey/baby/${weekNumber}`, { cache: 'no-store' })

  if (!res.ok) {
    const text = await res.text()
    console.log('BABY STATUS:', res.status)
    console.log('BABY BODY:', text)
    throw new Error('Failed to fetch baby info')
  }

  return res.json()
}

export const getMomInfoByWeekNumber = async (weekNumber?: number): Promise<MomState> => {
  const authHeaders = await getJourneyAuthHeaders()
  const url = weekNumber
    ? `${API_URL}/weeks/me/journey/mom/${weekNumber}`
    : `${API_URL}/weeks/me/journey/mom`

  const res = await fetch(url, { cache: 'no-store', headers: authHeaders })
  if (!res.ok) throw new Error('Failed to fetch mom info')
  return res.json()
}
