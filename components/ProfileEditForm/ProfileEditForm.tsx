'use client'

import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateProfile } from '@/services/profile.service'
import { useAuthStore } from '@/store/auth.store'
import styles from './ProfileEditForm.module.css'

export default function ProfileEditForm() {
  const { user, setUser } = useAuthStore()

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: updatedUser => {
      setUser(updatedUser)
      toast.success('Дані успішно оновлено')
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Помилка збереження')
    },
  })

  if (!user) return null

  const today = new Date().toISOString().split('T')[0]
  const maxDateObj = new Date()
  maxDateObj.setMonth(maxDateObj.getMonth() + 10)
  const maxDate = maxDateObj.toISOString().split('T')[0]

  const validationSchema = Yup.object({
    name: Yup.string().min(2, 'Занадто коротке').required("Ім'я обов'язкове"),
    email: Yup.string().email('Некоректний email').required("Email обов'язковий"),
    theme: Yup.string().oneOf(['boy', 'girl', 'neutral']).required('Оберіть стать'),
    dueDate: Yup.date().required('Оберіть дату'),
  })

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
        onSubmit={values => mutation.mutate(values)}
      >
        {({ resetForm, isSubmitting, dirty, errors, touched }) => (
          <Form className={styles.form} noValidate>
            {/* Поле: Ім'я */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Імʼя</label>
              <Field name="name">
                {({ field }: FieldProps) => (
                  <input
                    {...field}
                    className={`${styles.input} ${
                      errors.name && touched.name ? styles.inputError : ''
                    }`}
                    placeholder="Ваше ім'я"
                  />
                )}
              </Field>
              <ErrorMessage name="name" component="div" className={styles.errorText} />
            </div>

            {/* Поле: Email */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Пошта (не редагується)</label>
              <Field name="email">
                {({ field }: FieldProps) => (
                  <input
                    {...field}
                    type="email"
                    className={`${styles.input} ${styles.readOnlyInput}`}
                    readOnly
                  />
                )}
              </Field>
            </div>

            {/* Поле: Стать */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Стать дитини</label>
              <Field
                as="select"
                name="theme"
                className={`${styles.select} ${
                  errors.theme && touched.theme ? styles.inputError : ''
                }`}
              >
                <option value="neutral">Ще не знаємо</option>
                <option value="boy">Хлопчик</option>
                <option value="girl">Дівчинка</option>
              </Field>
              <ErrorMessage name="theme" component="div" className={styles.errorText} />
            </div>

            {/* Поле: Дата */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Планова дата пологів</label>
              <Field name="dueDate">
                {({ field }: FieldProps) => (
                  <input
                    {...field}
                    type="date"
                    min={today}
                    max={maxDate}
                    className={`${styles.input} ${
                      errors.dueDate && touched.dueDate ? styles.inputError : ''
                    }`}
                  />
                )}
              </Field>
              <ErrorMessage name="dueDate" component="div" className={styles.errorText} />
            </div>

            {/* Кнопки дії */}
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => resetForm()}
                disabled={!dirty || isSubmitting}
              >
                Відмінити
              </button>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={!dirty || isSubmitting || mutation.isPending}
              >
                {mutation.isPending ? 'Збереження...' : 'Зберегти зміни'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
