'use client'

import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { updateUserAvatar } from '@/services/users.service'
import { useAuthStore } from '@/store/auth.store'
import { Loader } from '@/components/Loader/Loader'
import styles from './ProfileAvatar.module.css'

export default function ProfileAvatar() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, setUser } = useAuthStore()
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (file: File) => updateUserAvatar(file),
    onSuccess: updatedUser => {
      setUser(updatedUser)
      toast.success('Фото оновлено')
      // Не видаляємо localPreview миттєво, даємо браузеру час підтягнути нове фото з URL
      setTimeout(() => setLocalPreview(null), 1000)
    },
    onError: () => {
      setLocalPreview(null)
      toast.error('Не вдалося завантажити фото')
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Створюємо тимчасовий URL для миттєвого відображення
    const objectUrl = URL.createObjectURL(file)
    setLocalPreview(objectUrl)

    mutation.mutate(file)
  }

  if (!user) return null

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={
            localPreview || user.avatar || '/images/unknownAvatarImage/unknown_avatar_Image@2x.jpg'
          }
          alt="Avatar"
          fill
          unoptimized // Важливо для аватарів, що часто змінюються
          className={styles.avatarImg}
        />
        {mutation.isPending && (
          <div className={styles.loaderOverlay}>
            <Loader variant="inline" />
          </div>
        )}
      </div>

      <div className={styles.userInfo}>
        <h2 className={styles.name}>{user.name}</h2>
        <p className={styles.email}>{user.email}</p>

        <button
          type="button"
          className={styles.uploadBtn}
          onClick={() => fileInputRef.current?.click()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Збереження...' : 'Завантажити нове фото'}
        </button>

        <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileChange} />
      </div>
    </div>
  )
}
