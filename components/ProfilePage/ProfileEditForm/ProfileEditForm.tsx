'use client'

import { useEffect, useMemo } from 'react' // Додав useMemo
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import styles from './ProfileEditForm.module.css'
import { updateProfile } from '@/services/profile.service'
import { useAuthStore } from '@/store/auth.store'

// 1. Виправляємо валідацію за ТЗ
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Занадто коротке')
    .max(32, 'Максимум 32 символи') // Додано за ТЗ
    .required("Обов'язково"),
  email: Yup.string().email('Невірний формат').required("Обов'язково"),
  theme: Yup.string().oneOf(['boy', 'girl', 'neutral']).required("Обов'язково"),
  dueDate: Yup.date()
    .required("Обов'язково")
    .test('range', 'Дата має бути в межах 1-40 тижнів', value => {
      if (!value) return false
      const date = new Date(value)
      const now = new Date()
      const minDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      const maxDate = new Date(now.getTime() + 280 * 24 * 60 * 60 * 1000)
      return date >= minDate && date <= maxDate
    }),
})

export default function ProfileEditForm() {
  const { user, setUser } = useAuthStore()

  // 2. Обчислюємо межі дат для атрибутів min/max інпуту
  const dateLimits = useMemo(() => {
    const now = new Date()
    const min = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const max = new Date(now.getTime() + 280 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    return { min, max }
  }, [])

  const applyTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme)
  }

  useEffect(() => {
    if (user?.theme) applyTheme(user.theme)
  }, [user?.theme])

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: updatedUser => {
      setUser(updatedUser)
      if (updatedUser.theme) applyTheme(updatedUser.theme)
      toast.success('Дані збережено!')
    },
    onError: () => toast.error('Помилка збереження'),
  })

  if (!user) return null

  return (
    <div className={styles.container}>
      <Formik
        enableReinitialize
        initialValues={{
          name: user.name || '',
          email: user.email || '',
          theme: user.theme || 'neutral',
          dueDate: user.dueDate ? new Date(user.dueDate).toISOString().split('T')[0] : '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => mutate(values)}
      >
        {({ errors, touched, resetForm, dirty }) => (
          <Form className={styles.form}>
            {/* Поле Ім'я */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Ваше ім’я</label>
              <Field
                name="name"
                className={`${styles.input} ${
                  touched.name && errors.name ? styles.inputError : ''
                }`}
              />
              {touched.name && errors.name && <div className={styles.errorText}>{errors.name}</div>}
            </div>

            {/* Поле Email */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email</label>
              <Field
                name="email"
                className={`${styles.input} ${
                  touched.email && errors.email ? styles.inputError : ''
                }`}
              />
              {touched.email && errors.email && (
                <div className={styles.errorText}>{errors.email}</div>
              )}
            </div>

            {/* Поле Тема */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Хто у вас буде?</label>
              <div className={styles.selectWrapper}>
                <Field as="select" name="theme" className={styles.select}>
                  <option value="neutral">Ще не знаємо</option>
                  <option value="boy">Хлопчик</option>
                  <option value="girl">Дівчинка</option>
                </Field>
              </div>
            </div>

            {/* Поле Дата з обмеженням 1-40 тижнів */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Очікувана дата пологів</label>
              <Field
                type="date"
                name="dueDate"
                min={dateLimits.min} // Тепер календар не дасть вибрати дату через рік
                max={dateLimits.max}
                className={`${styles.input} ${
                  touched.dueDate && errors.dueDate ? styles.inputError : ''
                }`}
              />
              {touched.dueDate && errors.dueDate && (
                <div className={styles.errorText}>{errors.dueDate}</div>
              )}
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => resetForm()}
                className={styles.cancelBtn}
                disabled={!dirty || isPending}
              >
                Скасувати
              </button>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={isPending || !dirty} // Кнопка активна тільки якщо були зміни
              >
                {isPending ? 'Збереження...' : 'Зберегти зміни'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
