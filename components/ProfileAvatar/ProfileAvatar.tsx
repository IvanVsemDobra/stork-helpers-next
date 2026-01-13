'use client'

import { useRef, useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import type { User } from '@/types/user'
import { updateUserAvatar } from '@/services/users.service'
import { useAuthStore } from '@/store/auth.store'
import styles from './ProfileAvatar.module.css'

export default function ProfileAvatar() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, setUser } = useAuthStore()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Очищення URL після демонтажу для запобігання витоку пам'яті
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const mutation = useMutation<User, Error, File>({
    mutationFn: updateUserAvatar,
    onSuccess: (updatedUser: User) => {
      setUser(updatedUser) // Zustand store оновлення
      setPreviewUrl(null)
      toast.success('Фото оновлено')
    },
    onError: (err: Error) => {
      setPreviewUrl(null)
      toast.error(err.message || 'Помилка завантаження')
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
    mutation.mutate(file)
  }

  if (!user) return null

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={
            previewUrl || user.avatar || '/images/unknownAvatarImage/unknown_avatar_Image@2x.jpg'
          }
          alt="Avatar"
          fill
          sizes="132px"
          className={styles.avatarImg}
        />
      </div>

      <div className={styles.userInfo}>
        <h2 className={styles.name}>{user.name}</h2>
        <p className={styles.email}>{user.email}</p>

        <button
          type="button"
          className={styles.uploadBtn}
          onClick={() => fileInputRef.current?.click()}
          disabled={mutation.isPending} // Виправлено: isPending замість isMutating
        >
          {mutation.isPending ? 'Завантаження...' : 'Завантажити нове фото'}
        </button>

        <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileChange} />
      </div>
    </div>
  )
}
