'use client'

import React, { useEffect, useState, useId } from 'react'
import { Field, Form, Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { api } from '@/app/api/client'
import { Emotion, DiaryEntry } from '@/interfaces/diary'
import styles from './AddDiaryEntryForm.module.css'

interface FormValues {
  title: string
  emotions: string[]
  description: string
}

interface AddDiaryEntryFormProps {
  initialData?: DiaryEntry | null
  isEdit?: boolean
  onSubmitSuccess: () => void
  onClose: () => void
}

const validationSchema = Yup.object({
  title: Yup.string().min(2, 'Має бути щонайменше 2 символи').required('Заголовок обовʼязковий'),
  emotions: Yup.array().min(1, 'Виберіть хоча б одну емоцію').required('Оберіть емоцію'),
  description: Yup.string().min(5, 'Опишіть ваші думки детальніше').required('Поле обовʼязкове'),
})

export default function AddDiaryEntryForm({
  initialData,
  isEdit = false,
  onSubmitSuccess,
  onClose,
}: AddDiaryEntryFormProps) {
  const fieldId = useId()
  const [availableEmotions, setAvailableEmotions] = useState<Emotion[]>([])

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const { data } = await api.get<Emotion[]>('/emotions/emotions')
        setAvailableEmotions(data)
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Помилка завантаження емоцій:', error.response?.status)
        }
      }
    }
    fetchEmotions()
  }, [])

  const initialValues: FormValues = initialData
    ? {
      title: initialData.title,
      emotions: initialData.emotions.map((e: string | unknown) =>
        typeof e === 'string' ? e : (e as Emotion)._id
      ),
      description: initialData.description || '',
    }
    : {
      title: '',
      emotions: [],
      description: '',
    }

  const handleSubmit = async (values: FormValues) => {
    try {
      if (isEdit && initialData) {
        await api.patch(`/diaries/me/${initialData._id}`, values)
      } else {
        await api.post('/diaries/me', values)
      }
      onSubmitSuccess()
      onClose()
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.status === 401 ? 'Авторизуйтесь знову' : 'Помилка збереження')
      }
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
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
                  <span>{e.title}</span>
                </label>
              ))}
            </div>
            <ErrorMessage name="emotions" component="div" className={styles.errorMessage} />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor={`${fieldId}-desc`} className={styles.label}>
              Текст запису
            </label>
            <Field
              as="textarea"
              id={`${fieldId}-desc`}
              name="description"
              className={styles.textarea}
            />
            <ErrorMessage name="description" component="div" className={styles.errorMessage} />
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.buttonSecondary}>
              Скасувати
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.buttonPrimary}>
              {isSubmitting ? 'Збереження...' : isEdit ? 'Оновити' : 'Зберегти'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
