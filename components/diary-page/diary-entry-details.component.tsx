'use client'

import React from 'react'
import axios from 'axios'
import { DiaryEntry, Emotion } from '../../interfaces/diary'
import { FormOutlined } from '@ant-design/icons'
import styles from './diary-entry-details.module.scss'

interface DiaryEntryDetailsProps {
  entry: DiaryEntry | null
  allEmotions: Emotion[]
  onDeleteSuccess: () => void
  onEditTrigger: (entry: DiaryEntry) => void
}

export const DiaryEntryDetails: React.FC<DiaryEntryDetailsProps> = ({
  entry,
  allEmotions,
  onDeleteSuccess,
  onEditTrigger,
}) => {
  if (!entry) return null

  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  const getEmotionTitle = (id: string) =>
    allEmotions.find((e: Emotion) => e._id === id)?.title || '...'

  const handleDelete = async () => {
    const isConfirmed = window.confirm('Ви впевнені, що хочете видалити цей запис?')

    if (isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/api/diaries/me/${entry._id}`, {
          withCredentials: true,
        })
        onDeleteSuccess()
      } catch (error: unknown) {
        console.error('Помилка при видаленні:', error)
        alert('Не вдалося видалити запис.')
      }
    }
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>{entry.title}</h2>
        <div className={styles.actions}>
          <button className={styles.button} onClick={() => onEditTrigger(entry)}>
            <FormOutlined className={styles.buttonIcon} />
          </button>
        </div>
      </div>

      <div className={styles.middleContainer}>
        <p className={styles.date}>
          {new Date(entry.date)
            .toLocaleDateString('uk-UA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
            .replace(/\s*р\.?$/, '')}
        </p>
        <button className={styles.deleteButton} onClick={handleDelete}>
          <svg width="24" height="24">
            <use href="/sprite.svg#icon-delete_forever" />
          </svg>
        </button>
      </div>

      {entry.emotions.length > 0 && (
        <div className={styles.emotionsList}>
          <p className={styles.mainText}>{entry.description}</p>

          <div className={styles.emotions}>
            {entry.emotions.map((id: string) => (
              <span key={id} className={styles.emotionBadge}>
                {getEmotionTitle(id)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
