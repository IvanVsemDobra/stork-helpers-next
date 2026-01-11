'use client'

import { useFormikContext } from 'formik'
import Image from 'next/image'
import styles from './OnboardingAvatar.module.css'

export interface OnboardingValues {
  avatar: File | null
}

export default function OnboardingAvatar() {
  const { values, setFieldValue } = useFormikContext<OnboardingValues>()

  const avatarSrc = values.avatar
    ? URL.createObjectURL(values.avatar)
    : '/images/unknownAvatarImage/unknown_avatar_Image.jpg'

  return (
    <div className={styles.wrapper}>
      <div className={styles.imageWrapper}>
        <Image
          src={avatarSrc}
          alt="Avatar"
          width={160}
          height={160}
          className={styles.image}
        />
      </div>
      <input
        id="avatar"
        type="file"
        accept="image/*"
        onChange={e => setFieldValue('avatar', e.currentTarget.files?.[0] || null)}
        className={styles.input}
      />
      <label htmlFor="avatar" className={styles.button}>
        Завантажити
      </label>
    </div>
  )
}
