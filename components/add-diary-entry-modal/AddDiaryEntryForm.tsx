'use client'

import React, { useEffect, useState, useId } from 'react'
import axios from 'axios'
import { Field, Form, Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { DiaryEntry, Emotion } from '@/interfaces/diary'

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
  title: Yup.string().min(2, 'Мінімум 2 символи').required('Заголовок обовʼязковий'),
  emotions: Yup.array().min(1, 'Оберіть хоча б одну емоцію').required(),
  description: Yup.string().required('Опишіть ваші думки'),
})

export default function AddDiaryEntryForm({
  initialData,
  isEdit = false,
  onSubmitSuccess,
  onClose,
}: AddDiaryEntryFormProps) {
  const fieldId = useId()
  const [availableEmotions, setAvailableEmotions] = useState<Emotion[]>([])
  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const { data } = await axios.get<Emotion[]>(`${API_BASE}/api/emotions`)
        setAvailableEmotions(data)
      } catch (error) {
        console.error('Помилка завантаження емоцій:', error)
      }
    }
    fetchEmotions()
  }, [API_BASE])

  const initialValues: FormValues = initialData
    ? {
        title: initialData.title,
        emotions: initialData.emotions.map((e: string | Emotion) =>
          typeof e === 'string' ? e : e._id
        ),
        description: initialData.description,
      }
    : { title: '', emotions: [], description: '' }

  const handleSubmit = async (values: FormValues) => {
    try {
      if (isEdit && initialData) {
        await axios.patch(`${API_BASE}/api/diaries/me/${initialData._id}`, values, {
          withCredentials: true,
        })
      } else {
        await axios.post(`${API_BASE}/api/diaries/me`, values, {
          withCredentials: true,
        })
      }
      onSubmitSuccess()
      onClose()
    } catch {
      alert('Помилка збереження запису')
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Form className="flex flex-col gap-4">
        <div>
          <label className="font-bold" htmlFor={`${fieldId}-title`}>
            Заголовок
          </label>
          <Field id={`${fieldId}-title`} name="title" className="border p-2 w-full rounded mt-1" />
          <ErrorMessage name="title" component="div" className="text-red-500 text-xs" />
        </div>

        <div>
          <p className="font-bold mb-2">Ваші емоції</p>
          <div className="flex gap-2 flex-wrap">
            {availableEmotions.map((e: Emotion) => (
              <label
                key={e._id}
                className="flex items-center gap-1 border p-2 rounded cursor-pointer hover:bg-gray-50"
              >
                <Field type="checkbox" name="emotions" value={e._id} />
                <span>{e.title}</span>
              </label>
            ))}
          </div>
          <ErrorMessage name="emotions" component="div" className="text-red-500 text-xs" />
        </div>

        <div>
          <label className="font-bold" htmlFor={`${fieldId}-desc`}>
            Текст щоденника
          </label>
          <Field
            as="textarea"
            id={`${fieldId}-desc`}
            name="description"
            className="border p-2 w-full h-32 rounded mt-1"
          />
          <ErrorMessage name="description" component="div" className="text-red-500 text-xs" />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700"
        >
          {isEdit ? 'Оновити запис' : 'Зберегти у щоденник'}
        </button>
      </Form>
    </Formik>
  )
}
