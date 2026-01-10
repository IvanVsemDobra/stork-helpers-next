'use client'

import { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Image from 'next/image'

import { updateProfile, uploadAvatar } from '@/services/profile.service'
import { useAuthStore, User } from '@/store/auth.store'
import styles from './ProfileEditForm.module.css'

interface ProfileFormValues {
  name: string
  theme: 'boy' | 'girl' | 'neutral'
  dueDate: string
  avatar: File | null
}

function AvatarPreview({ defaultAvatar, setPreview }: { defaultAvatar: string; setPreview: (src: string) => void }) {
  const { values } = useFormikContext<ProfileFormValues>()

  useEffect(() => {
    if (values.avatar) {
      const url = URL.createObjectURL(values.avatar)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreview(defaultAvatar)
    }
  }, [values.avatar, defaultAvatar, setPreview])

  return null
}

export default function ProfileEditForm() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const defaultAvatar = '/images/plant/plant.jpg' 
  const [preview, setPreview] = useState(defaultAvatar)

  const mutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (values.avatar) {
        const updatedUser = await uploadAvatar(values.avatar)
        setUser(updatedUser)
      }

      const updatedUser = await updateProfile({
        name: values.name,
        theme: values.theme,
        dueDate: values.dueDate,
      })
      return updatedUser
    },
    onSuccess: (updatedUser: User) => {
      setUser(updatedUser)
      toast.success('Профіль збережено')
      router.push('/diary')
    },
    onError: () => toast.error('Помилка збереження'),
  })

  if (!user) return null

  const validationSchema = Yup.object({
    name: Yup.string().min(2, 'Занадто коротке').required("Обов'язково"),
    theme: Yup.string().oneOf(['boy', 'girl', 'neutral']).required("Обов'язково"),
    dueDate: Yup.date().required("Обов'язково"),
  })

  return (
    <div className={styles.container}>
      <Formik<ProfileFormValues>
        enableReinitialize
        initialValues={{
          name: user.name || '',
          theme: user.theme || 'neutral',
          dueDate: user.dueDate ? new Date(user.dueDate).toISOString().split('T')[0] : '',
          avatar: null,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => mutation.mutate(values)}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className={styles.form}>
            <AvatarPreview defaultAvatar={defaultAvatar} setPreview={setPreview} />

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Аватар</label>
              <div className={styles.avatarWrapper}>
                <Image
                  src={preview} 
                  alt="Avatar"
                  width={164}
                  height={164}
                  className={styles.avatarImage}
                />
                <label className={styles.uploadLabel}>
                  Завантажити фото
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setFieldValue('avatar', e.currentTarget.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Імʼя</label>
              <Field name="name" className={styles.input} />
              <ErrorMessage name="name" component="div" className={styles.errorText} />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Стать дитини</label>
              <div className={styles.selectWrapper}>
                <Field as="select" name="theme" className={styles.select}>
                  <option value="neutral">Ще не знаємо</option>
                  <option value="boy">Хлопчик</option>
                  <option value="girl">Дівчинка</option>
                </Field>
              </div>
              <ErrorMessage name="theme" component="div" className={styles.errorText} />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Очікувана дата пологів</label>
              <Field type="date" name="dueDate" className={styles.input} />
              <ErrorMessage name="dueDate" component="div" className={styles.errorText} />
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.saveBtn} disabled={isSubmitting || mutation.isPending}>
                {mutation.isPending ? 'Збереження...' : 'Зберегти зміни'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}