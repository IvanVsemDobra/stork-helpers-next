'use client'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { updateProfile, updateUserAvatar } from '@/services/users.service'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'
import type { User } from '@/types/user'

import OnboardingAvatar from '@/components/OnboardingAvatar/OnboardingAvatar'
import OnboardingCustomDate from '@/components/OnboardingCustomDate/OnboardingCustomDate'
import OnboardingCustomSelect from '@/components/OnboardingCustomSelect/OnboardingCustomSelect'
import styles from './OnboardingForm.module.css'

export interface OnboardingValues {
  name: string
  theme: 'boy' | 'girl' | 'neutral'
  dueDate: string
  avatar: File | null
}

const schema = Yup.object({
  name: Yup.string().min(2).required(),
  theme: Yup.string().oneOf(['boy', 'girl', 'neutral']).required(),
  dueDate: Yup.date().required(),
})

export default function OnboardingForm() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const setTheme = useThemeStore(state => state.setTheme)

  const mutation = useMutation({
    mutationFn: async (values: OnboardingValues) => {
      let newAvatarUrl = user?.avatar

      if (values.avatar) {
        const avatarRes = await updateUserAvatar(values.avatar)
        if (avatarRes.avatar) {
          newAvatarUrl = avatarRes.avatar
        }
      }

      await updateProfile({
        name: values.name,
        theme: values.theme,
        dueDate: values.dueDate,
      })

      const updatedData: Partial<User> = {
        name: values.name,
        theme: values.theme,
        dueDate: values.dueDate,
        avatar: newAvatarUrl,
      }

      return updatedData
    },
    onSuccess: updatedData => {
      if (user) {
        setUser({ ...user, ...updatedData })
      } else {
        setUser(updatedData as User)
      }

      setTheme(updatedData.theme ?? 'neutral')
      toast.success('Онбординг завершено')
      router.push('/diary')
    },
    onError: () => toast.error('Помилка збереження'),
  })

  if (!user) return null

  return (
    <Formik<OnboardingValues>
      initialValues={{
        name: user.name ?? '',
        theme: (user.theme as 'boy' | 'girl' | 'neutral') || 'neutral',
        dueDate: user.dueDate ? new Date(user.dueDate).toISOString().split('T')[0] : '',
        avatar: null,
      }}
      validationSchema={schema}
      onSubmit={values => mutation.mutate(values)}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <OnboardingAvatar />
          <OnboardingCustomSelect />
          <OnboardingCustomDate />
          <button type="submit" disabled={isSubmitting} className={styles.submit}>
            Зберегти
          </button>
        </Form>
      )}
    </Formik>
  )
}
