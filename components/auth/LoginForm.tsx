'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'

import { login } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'
import css from '@/components/auth/LoginForm.module.css'

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
          <div className={css.auth_logo}>
            <Image
              className={css.auth_logo_img}
              src="/images/stork/stork.jpg"
              alt="Лелека"
              width={30}
              height={30}
              priority
              sizes="30px"
            />
            <p className={css.auth_logo_name}>Лелека</p>
          </div>
          <div className={css.auth_container}>
            <h1 className={css.auth_title}>Вхід</h1>
            <div className={css.auth_wrap_input}>
              <Field
                className={css.auth_input}
                name="email"
                maxLength={64}
                type="email"
                placeholder="Пошта"
              ></Field>
              <ErrorMessage name="email">
                {msg => <div className={css.ui_error}>{msg}</div>}
              </ErrorMessage>
              <Field
                className={css.auth_input}
                name="password"
                maxLength={128}
                type="password"
                placeholder="Пароль"
              ></Field>
              <ErrorMessage name="password">
                {msg => <div className={css.ui_error}>{msg}</div>}
              </ErrorMessage>
              <button className={css.auth_button} type="submit" disabled={isSubmitting || !isValid}>
                Увійти
              </button>
            </div>

            <div className={css.auth_text}>
              Нeмає акаунту?
              <Link className={css.auth_text_link} href="/auth/register">
                Зареєструватися
              </Link>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}
