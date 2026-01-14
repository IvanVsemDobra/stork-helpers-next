'use client'

import { Formik, Form, Field, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import toast, { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

import { updateUser } from '@/services/users.service'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'
import { Loader } from '@/components/Loader/Loader'

import styles from './ProfileEditForm.module.css'

interface ProfileFormValues {
  name: string
  email: string
  theme: 'boy' | 'girl' | 'neutral'
  dueDate: string
}

const validationSchema = Yup.object({
  name: Yup.string().min(2, 'Занадто коротке').required('Обовʼязкове'),
  theme: Yup.string().oneOf(['boy', 'girl', 'neutral']).required(),
  dueDate: Yup.string().required('Оберіть дату'),
})

function ThemeWatcher() {
  const { values } = useFormikContext<ProfileFormValues>()
  const setTheme = useThemeStore(state => state.setTheme)

  useEffect(() => {
    setTheme(values.theme)
    document.documentElement.setAttribute('data-theme', values.theme)
  }, [values.theme, setTheme])

  return null
}

export default function ProfileEditForm() {
  const user = useAuthStore(state => state.user)
  const setUser = useAuthStore(state => state.setUser)
  const setTheme = useThemeStore(state => state.setTheme)

  const mutation = useMutation({
    mutationFn: (values: ProfileFormValues) => updateUser(values),
    onSuccess: data => {
      setUser(data)
      const newTheme = (data.theme as ProfileFormValues['theme']) || 'neutral'
      setTheme(newTheme)
      toast.success('Зміни збережено')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  if (!user) return null

  // Обмеження 40 тижнів
  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 280)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  return (
    <>
      <Toaster position="top-right" />
      <Formik<ProfileFormValues>
        enableReinitialize
        initialValues={{
          name: user.name || '',
          email: user.email || '',
          theme: (user.theme as ProfileFormValues['theme']) || 'neutral',
          dueDate: user.dueDate ? new Date(user.dueDate).toISOString().split('T')[0] : '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => mutation.mutate(values)}
      >
        {({ dirty, resetForm }) => (
          <Form className={styles.formLayout} noValidate>
            <ThemeWatcher />
            <div className={styles.fieldsStack}>
              <div className={styles.inputWrapper}>
                <label className={styles.label}>Імʼя</label>
                <Field name="name" className={styles.textInput} />
              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.label}>Пошта</label>
                <Field name="email" type="email" className={styles.textInput} disabled />
              </div>

              <div className={styles.gridRow}>
                <div className={styles.inputWrapper}>
                  <label className={styles.label}>Стать дитини</label>
                  <Field as="select" name="theme" className={styles.selectInput}>
                    <option value="neutral">Ще не знаю</option>
                    <option value="boy">Хлопчик</option>
                    <option value="girl">Дівчинка</option>
                  </Field>
                </div>

                <div className={styles.inputWrapper}>
                  <label className={styles.label}>Дата пологів</label>
                  <Field
                    name="dueDate"
                    type="date"
                    min={today}
                    max={maxDateStr}
                    className={styles.textInput}
                  />
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="submit"
                disabled={!dirty || mutation.isPending}
                className={styles.primaryBtn}
              >
                {mutation.isPending ? <Loader variant="inline" /> : 'Зберегти зміни'}
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={() => resetForm()}>
                Відмінити зміни
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}
