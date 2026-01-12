'use client'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { updateProfile, uploadAvatar } from '@/services/profile.service'
import { useAuthStore } from '@/store/auth.store'

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

  const mutation = useMutation({
    mutationFn: async (values: OnboardingValues) => {
      if (values.avatar) await uploadAvatar(values.avatar)
      return updateProfile({
        name: values.name,
        theme: values.theme,
        dueDate: values.dueDate,
      })
    },
    onSuccess: user => {
      setUser(user)
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
        theme: user.theme ?? 'neutral',
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