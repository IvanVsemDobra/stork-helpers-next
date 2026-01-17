'use client'

import styles from './ProfileEditForm.module.css'
import { Formik, Form, Field, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'
import { useMutation } from '@tanstack/react-query'
import { updateProfile, sendVerificationEmail } from '@/services/users.service'
import type { User } from '@/types/user'

const validationSchema = Yup.object({
  name: Yup.string().required('Обовʼязкове поле'),
  email: Yup.string().email('Некоректний email').required('Обовʼязкове поле'),
  dueDate: Yup.date().required('Вкажіть дату'),
})

interface FormValues {
  name: string
  email: string
  theme: 'boy' | 'girl' | 'neutral'
  dueDate: string
}

export const ProfileEditForm = () => {
  const { user, setUser } = useAuthStore()
  const { theme: localTheme, setTheme } = useThemeStore()
  const initialEmail = user?.email
  const { mutate, isPending } = useMutation<Partial<User>, Error, Partial<User>>({
    mutationFn: updateProfile,
    onSuccess: vars => {
      if (user) {
        setUser({ ...user, ...vars })
      }
      toast.success('Профіль оновлено')
    },
    onError: error => toast.error(error.message),
  })

  const handleSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    let themeChanged = false
    if (values.theme !== localTheme) {
      setTheme(values.theme)
      themeChanged = true
    }

    const payload: Partial<User> = {}

    if (values.name !== user?.name) payload.name = values.name

    const formattedDate = values.dueDate ? new Date(values.dueDate).toISOString() : undefined
    const currentStoredDate = user?.dueDate
      ? new Date(user.dueDate).toISOString().split('T')[0]
      : ''

    if (values.dueDate !== currentStoredDate) {
      payload.dueDate = formattedDate
    }

    if (values.email !== initialEmail) {
      payload.email = values.email
    }

    const hasBackendChanges = Object.keys(payload).length > 0

    if (!hasBackendChanges && !themeChanged) {
      toast.error('Змін не виявлено')
      setSubmitting(false)
      return
    }

    if (hasBackendChanges) {
      mutate(payload, {
        onSuccess: () => {
          if (payload.email) {
            sendVerificationEmail(payload.email).catch((err: Error) => toast.error(err.message))
            toast.success('Лист для верифікації надіслано')
          }
        },
        onSettled: () => setSubmitting(false),
      })
    } else {
      toast.success('Налаштування статі збережено')
      setSubmitting(false)
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: user?.name || '',
        email: user?.email || '',
        theme: localTheme || 'neutral',
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
              <label className={styles.label}>Планова дата пологів</label>
              <Field type="date" name="dueDate" className={styles.input} />
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
