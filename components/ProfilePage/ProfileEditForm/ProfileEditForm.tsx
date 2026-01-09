'use client'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import styles from './ProfileEditForm.module.css'
import { updateProfile } from '@/services/profile.service'
import { useAuthStore } from '@/store/auth.store'

const validationSchema = Yup.object({
  name: Yup.string().min(2, 'Занадто коротке').required("Обов'язково"),
  theme: Yup.string().oneOf(['boy', 'girl', 'neutral']).required("Обов'язково"),
  dueDate: Yup.date().required("Обов'язково"),
})

export default function ProfileEditForm() {
  const { user, setUser } = useAuthStore()

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: updatedUser => {
      setUser(updatedUser)
      toast.success('Дані збережено успішно!')
    },
    onError: () => toast.error('Помилка при збереженні'),
  })

  if (!user) return null

  return (
    <div className={styles.container}>
      <Formik
        enableReinitialize
        initialValues={{
          name: user.name || '',
          theme: user.theme || 'neutral',
          dueDate: user.dueDate ? new Date(user.dueDate).toISOString().split('T')[0] : '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => mutate(values)}
      >
        {({ errors, touched, resetForm }) => (
          <Form className={styles.form}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Ваше ім’я</label>
              <Field name="name" className={styles.input} placeholder="Введіть ваше ім’я" />
              {touched.name && errors.name && <div className={styles.error}>{errors.name}</div>}
            </div>

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

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Очікувана дата пологів</label>
              <Field type="date" name="dueDate" className={styles.input} />
            </div>

            <div className={styles.actions}>
              <button type="button" onClick={() => resetForm()} className={styles.cancelBtn}>
                Скасувати
              </button>
              <button type="submit" className={styles.saveBtn} disabled={isPending}>
                {isPending ? 'Збереження...' : 'Зберегти зміни'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
