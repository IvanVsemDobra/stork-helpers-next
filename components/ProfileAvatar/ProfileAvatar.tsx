'use client'

import styles from './ProfileAvatar.module.css'

import { useRef } from 'react'

import toast from 'react-hot-toast'

import Image from 'next/image'

import { useAuthStore } from '@/store/auth.store'

import { useMutation } from '@tanstack/react-query'

import { updateUserAvatar } from '@/services/users.service'

import type { User } from '@/types/user'

const MAX_SIZE = 2 * 1024 * 1024

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const ProfileAvatar = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const { user, setUser } = useAuthStore()

  const { mutate, isPending } = useMutation<User, Error, File>({
    mutationFn: updateUserAvatar,

    onSuccess: updatedUser => {
      setUser(updatedUser)

      toast.success('Аватар оновлено')
    },

    onError: error => toast.error(error.message),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Дозволені лише зображення (JPEG, PNG, WEBP)')

      return
    }

    if (file.size > MAX_SIZE) {
      toast.error('Файл завеликий (макс. 2MB)')

      return
    }

    mutate(file)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.imageWrapper}>
        <Image
          src={user?.avatar || '/images/unknownAvatarImage/unknown_avatar_Image.jpg'}
          alt="Avatar"
          width={132}
          height={132}
          className={styles.avatarImg}
          priority
          unoptimized
        />
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{user?.name || 'Гість'}</p>

        <p className={styles.email}>{user?.email}</p>

        <button
          className={styles.uploadBtn}
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          type="button"
        >
          {isPending ? 'Завантаження...' : 'Завантажити нове фото'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
      />
    </div>
  )
}
