'use client'

import { useRef } from 'react'
import { Formik, Form, Field, ErrorMessage, FormikProps } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import toast, { Toaster } from 'react-hot-toast'
import { updateUser, sendVerificationEmail } from '@/services/users.service'
import { useAuthStore } from '@/store/auth.store'
import styles from './ProfileEditForm.module.css'

interface ProfileFormValues {
  name: string
  email: string
  babyGender: 'boy' | 'girl' | 'unknown'
  dueDate: string
}

const validationSchema = Yup.object({
  name: Yup.string().min(2, 'Занадто коротке').required('Імʼя обовʼязкове'),
  email: Yup.string().email('Некоректна пошта').required('Пошта обовʼязкова'),
  babyGender: Yup.string().oneOf(['boy', 'girl', 'unknown']).required(),
  dueDate: Yup.string().required('Оберіть дату'),
})

export default function ProfileEditForm() {
  const user = useAuthStore(state => state.user)
  const setUser = useAuthStore(state => state.setUser)
  const formikRef = useRef<FormikProps<ProfileFormValues>>(null)

  const mutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const updatedUser = await updateUser(values)

      if (values.email !== user?.email) {
        await sendVerificationEmail(values.email)
        toast.success('Лист для верифікації буде надіслано')
      }

      return updatedUser
    },
    onSuccess: data => {
      setUser(data)
      toast.success('Профіль успішно оновлено')
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Помилка оновлення профілю'
      toast.error(message)
    },
  })

  if (!user) return null
  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <Toaster position="top-right" />
      <Formik
        innerRef={formikRef}
        enableReinitialize
        initialValues={{
          name: user.name,
          email: user.email,
          babyGender: user.babyGender ?? 'unknown',
          dueDate: user.dueDate ?? '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => mutation.mutate(values)}
      >
        {({ dirty, resetForm, isSubmitting }) => (
          <Form className={styles.formLayout} noValidate>
            <div className={styles.fieldsStack}>
              <div className={styles.inputWrapper}>
                <label className={styles.label}>Імʼя</label>
                <Field name="name" className={styles.textInput} />
                <ErrorMessage name="name" component="div" className={styles.error} />
              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.label}>Пошта</label>
                <Field name="email" type="email" className={styles.textInput} />
                <ErrorMessage name="email" component="div" className={styles.error} />
              </div>

              <div className={styles.gridRow}>
                <div className={styles.inputWrapper}>
                  <label className={styles.label}>Стать дитини</label>
                  <Field as="select" name="babyGender" className={styles.selectInput}>
                    <option value="unknown">Не вказано</option>
                    <option value="boy">Хлопчик</option>
                    <option value="girl">Дівчинка</option>
                  </Field>
                </div>

                <div className={styles.inputWrapper}>
                  <label className={styles.label}>Дата пологів</label>
                  <Field name="dueDate" type="date" min={today} className={styles.textInput} />
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => resetForm()}
                disabled={!dirty || isSubmitting}
                className={styles.secondaryBtn}
              >
                Відмінити
              </button>

              <button type="submit" disabled={!dirty || isSubmitting} className={styles.primaryBtn}>
                {isSubmitting ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}
