'use client'

import React from 'react'
import Image from 'next/image'
import './ProfileAvatar.module.css'

interface ProfileAvatarProps {
  avatarUrl?: string | null
  name?: string
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, name }) => {
  return (
    <div className="avatarContainer">
      <div className="imageWrapper">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name ?? 'User avatar'}
            className="avatarImage"
            fill
            sizes="120px"
          />
        ) : (
          <div className="avatarPlaceholder">{name?.[0]?.toUpperCase() ?? '?'}</div>
        )}
      </div>
      <div className="info">{name && <p className="name">{name}</p>}</div>
    </div>
  )
}
