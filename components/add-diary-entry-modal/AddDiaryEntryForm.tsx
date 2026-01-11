'use client'

import axios from 'axios'
import { Field, Form, Formik, ErrorMessage } from 'formik'
import { useId } from 'react'
import * as Yup from 'yup'

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
  title: Yup.string()
    .min(2, 'Має бути щонайменше 2 символи')
    .required('Заголовок обовʼязковий'),
  emotions: Yup.array()
    .min(1, 'Виберіть хоча б одну категорію')
    .required(),
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
      <Form>
        {/* Заголовок */}
        <label htmlFor={`${fieldId}-title`}>Заголовок</label>
        <Field id={`${fieldId}-title`} name="title" />
        <ErrorMessage name="title" component="div" />

        {/* Категорії */}
        <p>Категорії</p>
        {EMOTIONS.map(e => (
          <label key={e.id}>
            <Field
              type="checkbox"
              name="emotions"
              value={e.id}
            />
            {e.label}
          </label>
        ))}
        <ErrorMessage name="emotions" component="div" />

        {/* Повідомлення */}
        <label htmlFor={`${fieldId}-message`}>Запис</label>
        <Field as="textarea" id={`${fieldId}-message`} name="message" />
        <ErrorMessage name="message" component="div" />

        <button type="submit">Зберегти</button>
      </Form>
    </Formik>
  )
}