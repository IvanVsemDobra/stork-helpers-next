'use client'

import { useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { toast } from 'react-toastify'
import styles from './ProfileAvatar.module.css'
import { uploadAvatar } from '@/services/profile.service'
import { useAuthStore } from '@/store/auth.store'

export default function ProfileAvatar() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { user, setUser } = useAuthStore()

  const { mutate, isPending } = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: updatedUser => {
      setUser(updatedUser)
      toast.success('Фото оновлено!')
    },
    onError: () => toast.error('Помилка завантаження'),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) mutate(file)
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={user?.avatar || '/images/unknownAvatarImage/unknown_avatar_image@2x.jpg'}
          alt="Avatar"
          fill
          className={styles.avatarImg}
          priority
        />
      </div>
      <h2 className={styles.name}>{user?.name || 'Гість'}</h2>
      <p className={styles.email}>{user?.email}</p>

      <button
        type="button"
        className={styles.uploadBtn}
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
      >
        {isPending ? 'Завантаження...' : 'Змінити фото'}
      </button>
      <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileChange} />
    </div>
  )
}
