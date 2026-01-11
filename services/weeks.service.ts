import { BabyInfo, MomInfo, WeekData } from '@/types/babyData'
import { api } from './api'

export const getFirstWeekInfo = async ():Promise<WeekData> => {
    const res = await api.get<WeekData>('/weeks/public/my-day')
    return res.data
}

export const getMyDayWeekInfo = async ():Promise<WeekData> => {
    const res = await api.get<WeekData>('/weeks/me/my-day')
    return res.data
}

export const getWeekBabyInfo = async ():Promise<BabyInfo> => {
    const res = await api.get<BabyInfo>('/weeks/me/journey/baby')
    return res.data
}

export const getWeekMomInfo = async ():Promise<MomInfo> => {
    const res = await api.get<MomInfo>('/weeks/me/journey/mom')
    return res.data
}