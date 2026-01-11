'use client'

import axios from 'axios'
import { Field, Form, Formik, ErrorMessage } from 'formik'
import { useId } from 'react'
import * as Yup from 'yup'
import styles from './AddDiaryEntryForm.module.css'

interface AddDiaryEntryFormProps {
  initialData?: {
    title: string
    emotions: string[]
    message: string
  }
  isEdit?: boolean
  onSubmitSuccess: () => void
  onClose: () => void
}

interface FormValues {
  title: string
  emotions: string[]
  message: string
}

const validationSchema = Yup.object({
  title: Yup.string().min(2, 'Має бути щонайменше 2 символи').required('Заголовок обовʼязковий'),
  emotions: Yup.array().min(1, 'Виберіть хоча б одну категорію').required(),
  message: Yup.string().required('Поле обовʼязкове'),
})

const EMOTIONS = [
  { id: 'joy', label: 'Радість' },
  { id: 'sad', label: 'Сум' },
  { id: 'anger', label: 'Гнів' },
]

export default function AddDiaryEntryForm({
  initialData,
  isEdit = false,
  onSubmitSuccess,
  onClose,
}: AddDiaryEntryFormProps) {
  const fieldId = useId()

  const initialValues: FormValues = initialData ?? {
    title: '',
    emotions: [],
    message: '',
  }

  const handleSubmit = async (values: FormValues) => {
    try {
      if (isEdit) {
        await axios.put('/api/diary', values)
      } else {
        await axios.post('/api/diary', {
          ...values,
          date: new Date().toISOString(),
        })
      }

      onSubmitSuccess()
      onClose()
    } catch (error) {
      alert('Помилка при збереженні запису')
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      <Form className={styles.form}>
        {/* Заголовок */}
        <div className={styles.fieldGroup}>
          <label htmlFor={`${fieldId}-title`} className={styles.label}>
            Заголовок
          </label>
          <Field id={`${fieldId}-title`} name="title" className={styles.input} />
          <ErrorMessage name="title" component="div" className={styles.errorMessage} />
        </div>

        {/* Категорії */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Категорії
          </label>
          <div className={styles.checkboxGroup}>
            {EMOTIONS.map(e => (
              <label key={e.id} className={styles.checkboxItem}>
                <Field type="checkbox" name="emotions" value={e.id} />
                {e.label}
              </label>
            ))}
          </div>

          <ErrorMessage name="emotions" component="div" className={styles.errorMessage} />
        </div>

        {/* Повідомлення */}
        <div className={styles.fieldGroup}>
          <label htmlFor={`${fieldId}-message`} className={styles.label}>
            Запис
          </label>
          <Field as="textarea" id={`${fieldId}-message`} name="message" className={styles.input} />
          <ErrorMessage name="message" component="div" className={styles.errorMessage} />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={`${styles.button}`}>
              Зберегти
          </button>
        </div>
      </Form>
    </Formik>
  )
}
