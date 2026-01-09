import React from 'react'
import { DiaryEntryDetailsProps } from '../../interfaces/diary'
import styles from './diary-entry-details.module.scss'

export const DiaryEntryDetails: React.FC<DiaryEntryDetailsProps> = ({ entry }) => {
  if (!entry) {
    return (
      <div className={styles.emptyEntry}>
        <p>Наразі записи у щоденнику відсутні</p>
      </div>
    )
  }

  return (
    <div>
      <div>
        <div>
          <h2>{entry.title}</h2>
          <p>{entry.date}</p>
        </div>
        <div>
          <button>Редагувати</button>
          <button>Видалити</button>
        </div>
      </div>

      <div>
        <span>[Список емоцій]</span>
      </div>

      <div>{entry.content}</div>
    </div>
  )
}
