'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'

import { register } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import Link from 'next/link'
import toast from 'react-hot-toast'
import axios from 'axios'

const validationSchema = Yup.object({
  name: Yup.string().max(32, 'Максимум 32 символи').required('Обовʼязкове поле'),
  email: Yup.string()
    .email('Некоректний email')
    .max(64, 'Максимум 64 символи')
    .required('Обовʼязкове поле'),
  password: Yup.string()
    .min(8, 'Мінімум 8 символів')
    .max(128, 'Максимум 128 символів')
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
          router.push('/my-day')
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || 'Помилка реєстрації. Спробуйте пізніше')
          } else if (error instanceof Error) {
            toast.error(error.message)
          } else {
            toast.error('Невідома помилка')
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
          <h1>Реєстрація</h1>
          <Field name="name" maxLength={32} type="text" placeholder="Ваше імʼя"></Field>
          <ErrorMessage name="name">{msg => <div className="ui-error">{msg}</div>}</ErrorMessage>

          <Field name="email" maxLength={64} type="email" placeholder="Пошта"></Field>
          <ErrorMessage name="email">{msg => <div className="ui-error">{msg}</div>}</ErrorMessage>

          <Field name="password" maxLength={128} type="password" placeholder="Пароль"></Field>
          <ErrorMessage name="password">
            {msg => <div className="ui-error">{msg}</div>}
          </ErrorMessage>

          <button type="submit" disabled={isSubmitting || !isValid}>
            Зареєструватися
          </button>
          <div className="login">
            Ви вже маєте акаунт? <Link href="/auth/login">Увійти</Link>
          </div>
        </Form>
      )}
    </Formik>
  )
}
