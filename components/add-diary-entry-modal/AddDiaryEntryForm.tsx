'use client'

import axios from 'axios'
import { Field, Form, Formik, ErrorMessage } from 'formik'
import { useEffect, useId, useState } from 'react'
import * as Yup from 'yup'
import styles from './AddDiaryEntryForm.module.css'

interface Emotion {
  _id: string
  title: string
}


interface DiaryEntry {
  _id: string
  title: string
  emotions: (string | Emotion)[]
  message: string
}


interface AddDiaryEntryFormProps {
  initialData?: DiaryEntry | null
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
  title: Yup.string()
    .min(2, 'Має бути щонайменше 2 символи')
    .required('Заголовок обовʼязковий'),
  emotions: Yup.array()
    .min(1, 'Виберіть хоча б одну емоцію')
    .required(),
  message: Yup.string().required('Поле обовʼязкове'),
})

export default function AddDiaryEntryForm({
  initialData,
  isEdit = false,
  onSubmitSuccess,
  onClose,
}: AddDiaryEntryFormProps) {
  const fieldId = useId()
  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  const [availableEmotions, setAvailableEmotions] = useState<Emotion[]>([])

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const { data } = await axios.get<Emotion[]>(
          `${API_BASE}/emotions`,
          { withCredentials: true }
        )
        setAvailableEmotions(data)
      } catch (error) {
        console.error('Помилка завантаження емоцій', error)
      }
    }

    fetchEmotions()
  }, [API_BASE])


  const initialValues: FormValues = initialData
    ? {
        title: initialData.title,
        emotions: initialData.emotions.map(e =>
          typeof e === 'string' ? e : e._id
        ),
        message: initialData.message,
      }
    : {
        title: '',
        emotions: [],
        message: '',
      }


  const handleSubmit = async (values: FormValues) => {
    try {
      if (isEdit && initialData) {
        await axios.patch(
          `${API_BASE}/diaries/me/${initialData._id}`,
          values,
          { withCredentials: true }
        )
      } else {
        await axios.post(
          `${API_BASE}/diaries/me`,
          values,
          { withCredentials: true }
        )
      }

      onSubmitSuccess()
      onClose()
    } catch (error) {
      alert('Помилка збереження запису')
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
        <div className={styles.fieldGroup}>
          <label htmlFor={`${fieldId}-title`} className={styles.label}>
            Заголовок
          </label>
          <Field id={`${fieldId}-title`} name="title" className={styles.input} />
          <ErrorMessage name="title" component="div" className={styles.errorMessage} />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Емоції</label>
          <div className={styles.checkboxGroup}>
            {availableEmotions.map(e => (
              <label key={e._id} className={styles.checkboxItem}>
                <Field type="checkbox" name="emotions" value={e._id} />
                {e.title}
              </label>
            ))}
          </div>
          <ErrorMessage name="emotions" component="div" className={styles.errorMessage} />
        </div>


        <div className={styles.fieldGroup}>
          <label htmlFor={`${fieldId}-message`} className={styles.label}>
            Запис
          </label>
          <Field
            as="textarea"
            id={`${fieldId}-message`}
            name="message"
            className={styles.input}
          />
          <ErrorMessage name="message" component="div" className={styles.errorMessage} />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.button}>
            Зберегти
          </button>
        </div>
      </Form>
    </Formik>
  )
}
