'use client'

import styles from './ProfileAvatar.module.css'
import { useRef, ChangeEvent } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { useAuthStore } from '@/store/auth.store'
import { useMutation } from '@tanstack/react-query'
import { updateUserAvatar } from '@/services/users.service'

export const ProfileAvatar = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { user, setUser } = useAuthStore()
  const { mutate, isPending } = useMutation({
    mutationFn: updateUserAvatar,
    onSuccess: (data: { avatar: string }) => {
      setUser({ avatar: data.avatar })
      toast.success('Фото профілю оновлено')
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Помилка завантаження'
      toast.error(message)
    },
  })
  const getAvatarSrc = (): string => {
    const avatar = user?.avatar

    if (!avatar || avatar === 'avatar') {
      return '/images/unknownAvatarImage/unknown_avatar_Image.jpg'
    }

    if (avatar.length > 100 && !avatar.startsWith('data:image') && !avatar.startsWith('http')) {
      return `data:image/jpeg;base64,${avatar}`
    }

    return avatar
  }
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Файл занадто великий (макс. 2МБ)')
        return
      }
      mutate(file)
    }
  }

  return (
    <div className={styles.avatarContainer}>
      <div className={styles.imageWrapper}>
        <Image
          src={getAvatarSrc()}
          alt="User Avatar"
          width={150}
          height={150}
          className={styles.avatarImage}
          priority
          unoptimized
        />
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.uploadBtn}
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
        >
          {isPending ? 'Завантаження...' : 'Змінити фото'}
        </button>

        <input ref={inputRef} type="file" hidden accept="image/*" onChange={handleFileChange} />
      </div>
    </div>
  )
}
