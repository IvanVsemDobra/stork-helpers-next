'use client'

import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
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
  const [isEmotionsOpen, setIsEmotionsOpen] = useState(false)

  const emotionsWrapRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (emotionsWrapRef.current && !emotionsWrapRef.current.contains(target)) {
        setIsEmotionsOpen(false)
      }
    }

    const onDocKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsEmotionsOpen(false)
    }

    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onDocKeyDown)

    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onDocKeyDown)
    }
  }, [])

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

  const emotionTitleById = useMemo(() => {
    const m = new Map<string, string>()
    for (const e of availableEmotions) m.set(e._id, e.title)
    return m
  }, [availableEmotions])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, values, setFieldValue }) => {
        const selected = values.emotions
          .map(id => ({ id, title: emotionTitleById.get(id) }))
          .filter((x): x is { id: string; title: string } => Boolean(x.title))

        const toggleEmotion = (emotionId: string) => {
          const exists = values.emotions.includes(emotionId)
          const next = exists
            ? values.emotions.filter(id => id !== emotionId)
            : [...values.emotions, emotionId]
          setFieldValue('emotions', next)
        }

        return (
          <Form className={styles.form}>
            {/* Заголовок */}
            <div className={styles.fieldGroup}>
              <label htmlFor={`${fieldId}-title`} className={styles.label}>
                Заголовок
              </label>

              <Field
                id={`${fieldId}-title`}
                name="title"
                className={styles.input}
                placeholder="Введіть заголовок запису"
              />

              <ErrorMessage name="title" component="div" className={styles.errorMessage} />
            </div>

            {/* Категорії */}
            <div
              className={`${styles.fieldGroup} ${styles.fieldGroupCategories}`}
              ref={emotionsWrapRef}
            >
              <label className={styles.label}>Категорії</label>

              {/* ✅ FIX: новий wrapper для кнопки + панелі */}
              <div className={styles.dropdownWrapper}>
                <button
                  type="button"
                  className={`${styles.dropdownControl} ${
                    isEmotionsOpen ? styles.dropdownControlOpen : ''
                  }`}
                  onClick={() => setIsEmotionsOpen(v => !v)}
                  aria-expanded={isEmotionsOpen}
                >
                  <div className={styles.dropdownValue}>
                    {selected.length === 0 ? (
                      <span className={styles.dropdownPlaceholder}>Оберіть категорію</span>
                    ) : (
                      <div className={styles.chips} aria-label="Вибрані категорії">
                        {selected.map(item => (
                          <span key={item.id} className={styles.chip}>
                            {item.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <svg
                    className={`${styles.chevronIcon} ${
                      isEmotionsOpen ? styles.chevronIconOpen : ''
                    }`}
                    aria-hidden="true"
                  >
                    <use href="/sprite.svg#icon-chevron_right" />
                  </svg>
                </button>

                {/* Dropdown panel */}
                {isEmotionsOpen && (
                  <div className={styles.dropdownPanel} role="listbox">
                    <div className={styles.dropdownScroll}>
                      {availableEmotions.map(e => {
                        const checked = values.emotions.includes(e._id)

                        return (
                          <label
                            key={e._id}
                            className={`${styles.optionRow} ${
                              checked ? styles.optionRowChecked : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleEmotion(e._id)}
                              className={styles.nativeCheckbox}
                            />

                            <span
                              className={`${styles.checkboxBox} ${
                                checked ? styles.checkboxBoxChecked : ''
                              }`}
                              aria-hidden="true"
                            >
                              {checked && (
                                <svg className={styles.checkboxTick} viewBox="0 0 24 24">
                                  <path
                                    d="M9.0 16.2L4.8 12l-1.4 1.4L9 19 20.6 7.4 19.2 6z"
                                    fill="currentColor"
                                  />
                                </svg>
                              )}
                            </span>

                            <span className={styles.optionText}>{e.title}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <ErrorMessage name="emotions" component="div" className={styles.errorMessage} />
            </div>

            {/* Запис */}
            <div className={`${styles.fieldGroup} ${styles.fieldGroupTextarea}`}>
              <label htmlFor={`${fieldId}-desc`} className={styles.label}>
                Запис
              </label>

              <Field
                as="textarea"
                id={`${fieldId}-desc`}
                name="description"
                className={styles.textarea}
                placeholder="Запишіть, як ви себе відчуваєте"
              />

              <ErrorMessage name="description" component="div" className={styles.errorMessage} />
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit" disabled={isSubmitting} className={styles.buttonPrimary}>
                {isSubmitting ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
