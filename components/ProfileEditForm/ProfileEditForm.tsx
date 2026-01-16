'use client'

import styles from './ProfileEditForm.module.css'
import { Formik, Form, Field } from 'formik'
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

export const ProfileEditForm = () => {
  const { user, setUser } = useAuthStore()
  const { setTheme } = useThemeStore()
  const initialEmail = user?.email
  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 280)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  const { mutate, isPending } = useMutation<User, Error, Partial<User>>({
    mutationFn: updateProfile,
    onSuccess: updatedUser => {
      setUser(updatedUser)

      if (updatedUser.email !== initialEmail && updatedUser.email) {
        sendVerificationEmail(updatedUser.email).catch(err => toast.error(err.message))
      }

      toast.success('Профіль оновлено')
    },
    onError: error => toast.error(error.message),
  })

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: user?.name || '',
        email: user?.email || '',
        theme: user?.theme || 'neutral',
        dueDate: user?.dueDate ? new Date(user.dueDate).toISOString().split('T')[0] : '',
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        const selectedTheme = values.theme as NonNullable<User['theme']>
        setTheme(selectedTheme)
        const payload: Partial<User> = {
          name: values.name,
          email: values.email,
          theme: selectedTheme,
          dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
        }

        mutate(payload)
      }}
    >
      {({ resetForm, errors, touched }) => (
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
            <button type="button" className={styles.cancel} onClick={() => resetForm()}>
              Відмінити зміни
            </button>

            <button type="submit" className={styles.submit} disabled={isPending}>
              {isPending ? 'Збереження...' : 'Зберегти зміни'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
