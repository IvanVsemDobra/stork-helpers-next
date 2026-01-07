'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'

import { login } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import Link from 'next/link'
import toast from 'react-hot-toast'

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Некоректний email')
    .max(64, 'Максимум 64 символи')
    .required('Обовʼязкове поле'),
  password: Yup.string()
    .min(8, 'Мінімум 8 символів')
    .max(128, 'Максимум 128 символів')
    .required('Обовʼязкове поле'),
})

export const LoginForm = () => {
  const router = useRouter()
  const setUser = useAuthStore(state => state.setUser)

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async values => {
        try {
          const user = await login(values)
          setUser(user)
          router.push('/my-day')
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message)
          } else {
            toast.error('Сталася невідома помилка')
          }
        }
      }}
    >
      {({ isSubmitting, isValid }) => (
        <Form>
          {/* logo */}
          {/* тут твої інпути з UI Kit */}
          <div className="logo">
            <img src="#" alt="Лелеко" />
          </div>
          <h1>Вхід</h1>

          <Field name="email" maxLength={64} type="email" placeholder="Пошта"></Field>
          <ErrorMessage name="email">{msg => <div className="ui-error">{msg}</div>}</ErrorMessage>

          <Field name="password" maxLength={128} type="password" placeholder="Пароль"></Field>
          <ErrorMessage name="password">
            {msg => <div className="ui-error">{msg}</div>}
          </ErrorMessage>

          <button type="submit" disabled={isSubmitting || !isValid}>
            Увійти
          </button>
          <div className="login">
            Нeмає акаунту? <Link href="/auth/register">Зареєструватися</Link>
          </div>
        </Form>
      )}
    </Formik>
  )
}
