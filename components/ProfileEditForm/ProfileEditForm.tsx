'use client'

import styles from './ProfileEditForm.module.css'
import { Formik, Form, Field, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'
import { useMutation } from '@tanstack/react-query'
import { updateProfile } from '@/services/users.service'
import { useRouter } from 'next/navigation'
import type { User } from '@/types/user'
import axios from 'axios'

interface FormValues {
  name: string
  email: string
  theme: NonNullable<User['theme']>
  dueDate: string
}

const validationSchema = Yup.object({
  name: Yup.string().required('Обовʼязкове поле'),
  email: Yup.string().email('Некоректний email').required('Обовʼязкове поле'),
  dueDate: Yup.date().required('Вкажіть дату'),
})

export const ProfileEditForm = () => {
  const { user, setUser } = useAuthStore()
  const { theme: localTheme, setTheme } = useThemeStore()
  const router = useRouter()
  const initialEmail = user?.email

  const { mutateAsync, isPending } = useMutation({ mutationFn: updateProfile })

  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 280)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      const formattedDueDate = values.dueDate ? new Date(values.dueDate).toISOString() : undefined
      const currentStoredDate = user?.dueDate
        ? new Date(user.dueDate).toISOString().split('T')[0]
        : ''

      const hasProfileChanges =
        values.name !== user?.name ||
        values.email !== initialEmail ||
        values.dueDate !== currentStoredDate

      const hasThemeChanges = values.theme !== localTheme

      if (!hasProfileChanges && !hasThemeChanges) {
        toast.error('Змін не виявлено')
        return
      }

      if (hasProfileChanges) {
        const payload: Partial<User> = { name: values.name }
        if (values.dueDate !== currentStoredDate) payload.dueDate = formattedDueDate
        if (values.email !== initialEmail) payload.email = values.email

        await mutateAsync(payload)
      }

      if (hasThemeChanges) {
        setTheme(values.theme)
      }

      setUser({
        ...user,
        name: values.name,
        dueDate: formattedDueDate,
        theme: values.theme,
        email: values.email === initialEmail ? values.email : user?.email,
      })

      toast.success('Зміни успішно збережено')
      router.refresh()
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        toast.error('Бекенд заблокував запит (ліміт 5/год). Почекайте хвилину.')
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Помилка оновлення'
        toast.error(errorMessage)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: user?.name || '',
        email: user?.email || '',
        theme: localTheme || (user?.theme as NonNullable<User['theme']>) || 'neutral',
        dueDate: user?.dueDate ? new Date(user.dueDate).toISOString().split('T')[0] : '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ resetForm, dirty, errors, touched }) => (
        <Form className={styles.form}>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Імʼя</label>
              <Field name="name" className={styles.input} />
              {touched.name && errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Пошта</label>
              <Field name="email" className={styles.input} />
              {touched.email && errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Стать дитини</label>
              <Field as="select" name="theme" className={styles.select}>
                <option value="girl">Дівчинка</option>
                <option value="boy">Хлопчик</option>
                <option value="neutral">Ще не знаю</option>
              </Field>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Дата пологів</label>
              <Field
                type="date"
                name="dueDate"
                className={styles.input}
                min={today}
                max={maxDateStr}
              />
              {touched.dueDate && errors.dueDate && (
                <span className={styles.error}>{errors.dueDate}</span>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancel}
              onClick={() => resetForm()}
              disabled={!dirty || isPending}
            >
              Відмінити
            </button>
            <button type="submit" className={styles.submit} disabled={isPending || !dirty}>
              {isPending ? 'Збереження...' : 'Зберегти зміни'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
