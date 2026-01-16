export interface Emotion {
  _id: string
  title: string
}

export interface DiaryEntry {
  _id?: string
  title: string
  emotions: (string | Emotion)[]
  message: string
}