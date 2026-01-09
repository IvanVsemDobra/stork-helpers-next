import React from 'react'
import { DiaryListProps } from '../../interfaces/diary'
import styles from './diary-list.module.scss'

export const DiaryList: React.FC<DiaryListProps> = ({ entries = [] }) => {
  return (
    <div className={styles.diaryListContainer}>
      <div className={styles.topContainer}>
        <h3 className={styles.title}>Ваші записи</h3>
        <button className={styles.addEntryButton}>
          <p className={styles.newEntry}>Новий запис</p>
          <svg className={styles.addCircle}>
            <use href="/sprite.svg.svg#icon-add_circle" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        {entries.length === 0 ? (
          <p className="records">Список записів порожній</p>
        ) : (
          entries.map(entry => (
            <div key={entry.id}>
              <h3>{entry.title}</h3>
              <span>{entry.date}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
