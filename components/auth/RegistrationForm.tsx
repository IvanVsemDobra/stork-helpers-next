'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import axios from 'axios'

import { register } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import AppLogo from '@/components/auth/AppLogo'
import css from './RegistrationForm.module.css'

const validationSchema = Yup.object({
  name: Yup.string()
    .max(32, 'Максимум 32 символи')
    .required('Обовʼязкове поле'),
  email: Yup.string()
    .email('Некоректний email')
    .max(64, 'Максимум 64 символи')
    .required('Обовʼязкове поле'),
  password: Yup.string()
    .min(8, 'Мінімум 8 символів')
    .max(128, 'Максимум 128 символи')
    .required('Обовʼязкове поле'),
})

export const RegistrationForm = () => {
  const router = useRouter()
  const setUser = useAuthStore(state => state.setUser)

  return (
    <Formik
      initialValues={{ name: '', email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async values => {
        try {
          const user = await register(values)
          setUser(user)

          if (!user.hasCompletedOnboarding) {
            router.push('/profile/edit')
          } else {
            router.push('/')
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || 'Помилка реєстрації')
          } else {
            toast.error('Невідома помилка')
          }
        }
      }}
    >
      {({ isSubmitting, isValid }) => (
        <div className={css.auth_wraper}>
          <Form>
            <div className={css.auth_logo}>
              <AppLogo className={css.auth_logo_img} />
            </div>

            <div className={css.auth_container}>
              <h1 className={css.auth_title}>Реєстрація</h1>

              <div className={css.auth_field}>
                <label>Імʼя *</label>
                <Field name="name" className={css.auth_input} />
                <ErrorMessage name="name" component="div" className={css.ui_error} />
              </div>

              <div className={css.auth_field}>
                <label>Email *</label>
                <Field name="email" type="email" className={css.auth_input} />
                <ErrorMessage name="email" component="div" className={css.ui_error} />
              </div>

              <div className={css.auth_field}>
                <label>Пароль *</label>
                <Field name="password" type="password" className={css.auth_input} />
                <ErrorMessage name="password" component="div" className={css.ui_error} />
              </div>

              <button type="submit" disabled={!isValid || isSubmitting}>
                Зареєструватися
              </button>

              <div className={css.auth_text}>
                Вже є акаунт? <Link href="/auth/login">Увійти</Link>
              </div>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  )
}