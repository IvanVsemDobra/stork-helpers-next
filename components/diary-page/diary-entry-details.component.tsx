'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { DiaryEntry, Emotion } from '../../interfaces/diary'
import { FormOutlined } from '@ant-design/icons'
import { ConfirmationModal } from '../confirmation-modal/confirmation-modal.component'
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  if (!entry) return null

  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  const getEmotionTitle = (id: string) =>
    allEmotions.find((e: Emotion) => e._id === id)?.title || '...'
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_BASE}/api/diaries/me/${entry._id}`, {
        withCredentials: true,
      })
      setIsDeleteModalOpen(false)
      onDeleteSuccess()
    } catch (error: unknown) {
      console.error('Помилка при видаленні:', error)
      alert('Не вдалося видалити запис.')
    }
  }

  return (
    <>
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
          <button className={styles.deleteButton} onClick={() => setIsDeleteModalOpen(true)}>
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
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Видалити цей запис?"
        confirmText="Видалити"
        cancelText="Скасувати"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  )
}
