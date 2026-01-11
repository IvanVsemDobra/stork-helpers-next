'use client'

import React from 'react'
import axios from 'axios'
import { DiaryEntryDetailsProps } from '../../interfaces/diary'
import styles from './diary-entry-details.module.scss'

export const DiaryEntryDetails: React.FC<DiaryEntryDetailsProps> = ({
  entry,
  onDeleteSuccess,
  onEditTrigger,
}) => {
  if (!entry) {
    return (
      <div className={styles.emptyEntry}>
        <p>Наразі записи у щоденнику відсутні</p>
      </div>
    )
  }

  const handleDelete = async () => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей запис?')) return

    try {
      // Ендпоїнт: deleteDiaryNote
      await axios.delete(`/api/diary/${entry._id}`)
      onDeleteSuccess()
    } catch (error) {
      console.error(error)
      alert('Помилка при видаленні')
    }
  }

  return (
    <div className={styles.detailsWrapper}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.mainTitle}>{entry.title}</h2>
          <p className={styles.dateText}>{new Date(entry.date).toLocaleDateString('uk-UA')}</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={() => onEditTrigger(entry)}>
            Редагувати
          </button>
          <button className={styles.deleteBtn} onClick={handleDelete}>
            Видалити
          </button>
        </div>
      </div>

      <div className={styles.emotionsList}>
        <strong>Емоції:</strong> {entry.emotions.join(', ')}
      </div>

      <div className={styles.messageContent}>{entry.message}</div>
    </div>
  )
}
