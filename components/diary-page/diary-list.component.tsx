'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DiaryEntry, DiaryListProps } from '../../interfaces/diary'
import { AddDiaryEntryModal } from '../add-diary-entry-modal/add-diary-entry-modal'
import styles from './diary-list.module.scss'

export const DiaryList: React.FC<DiaryListProps> = ({ entries, onSelect, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleEntryClick = (entry: DiaryEntry) => {
    // Якщо ширина екрану менше 1024px — йдемо на окрему сторінку
    if (window.innerWidth < 1024) {
      router.push(`/diary/${entry._id}`)
    } else {
      onSelect(entry)
    }
  }

  return (
    <div className={styles.diaryListContainer}>
      <div className={styles.topContainer}>
        <h3 className={styles.title}>Ваші записи</h3>
        <button className={styles.addEntryButton} onClick={() => setIsModalOpen(true)}>
          <span>Новий запис</span>
          <svg className={styles.addCircle} width="24" height="24">
            <use href="/sprite.svg#icon-add_circle" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        {entries.length === 0 ? (
          <p className="text-gray-400 text-center py-10">Щоденник порожній</p>
        ) : (
          entries.map(entry => (
            <div
              key={entry._id}
              className={styles.entryCard}
              onClick={() => handleEntryClick(entry)}
            >
              <h3 className={styles.entryTitle}>{entry.title}</h3>
              <span className={styles.entryDate}>
                {new Date(entry.date).toLocaleDateString('uk-UA')}
              </span>
            </div>
          ))
        )}
      </div>

      <AddDiaryEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={onRefresh}
      />
    </div>
  )
}
