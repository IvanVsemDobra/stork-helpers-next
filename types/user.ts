export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  babyGender?: 'boy' | 'girl' | 'unknown'
  theme?: 'boy' | 'girl' | 'neutral'
  dueDate?: string
  hasCompletedOnboarding: boolean
}
