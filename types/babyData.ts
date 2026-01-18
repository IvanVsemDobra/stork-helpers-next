export interface BabyData {
  weekNumber: number
  image: string
  imageAlt: string
  babyActivity: string
  babyDevelopment: string
}

export interface WeekData extends BabyData {
  daysToMeeting: number
  babySize: number
  babyWeight: number
  momDailyTips: string[]
}

export interface BabyInfo extends BabyData {
  analogy: string
  babySize: number
  babyWeight: number
  interestingFact: string
}

export interface ComfortTip {
  category: 'Харчування' | 'Активність' | 'Відпочинок та комфорт'
  tip: string
}

export interface MomInfo {
  weekNumber: number
  feelings: {
    states: string[]
    sensationDescr: string
  }
  comfortTips: ComfortTip[]
}

export type BabyState = {
  weekNumber: number
  analogy: string
  babySize: number
  babyWeight: number
  image: string
  babyActivity: string
  babyDevelopment: string
  interestingFact: string
}

export type MomFeelings = {
  states: string[]
  sensationDescr: string
}

export type MomComfortTip = {
  category: string
  tip: string
}

export type MomState = {
  _id: string
  weekNumber: number

  feelings: MomFeelings
  comfortTips: MomComfortTip[]
}
