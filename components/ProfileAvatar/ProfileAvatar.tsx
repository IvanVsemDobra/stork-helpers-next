'use client'

import { useRef, useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import styles from './ProfileAvatar.module.css'
import { uploadAvatar } from '@/services/profile.service'
import { useAuthStore } from '@/store/auth.store'

export default function ProfileAvatar() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { user, setUser } = useAuthStore()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const { mutate, isPending } = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: updatedUser => {
      setUser(updatedUser)
      setPreviewUrl(null)
      toast.success('Фото оновлено!')
    },
    onError: () => {
      setPreviewUrl(null)
      toast.error('Помилка завантаження')
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl)

      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      mutate(file)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={
            previewUrl || user?.avatar || '/images/unknownAvatarImage/unknown_avatar_Image@2x.jpg' // Перевір літеру I!
          }
          alt="Avatar"
          fill
          sizes="132px"
          className={styles.avatarImg}
          priority
        />
      </div>
      <div className={styles.userInfo}>
        <h2 className={styles.name}>{user?.name || 'Користувач'}</h2>
        <p className={styles.email}>{user?.email || 'Немає пошти'}</p>

        <button
          type="button"
          className={styles.uploadBtn}
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
        >
          {isPending ? 'Завантаження...' : 'Завантажити нове фото'}
        </button>
        <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileChange} />
      </div>
    </div>
  )
}
