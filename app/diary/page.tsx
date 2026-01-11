'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { DiaryList } from '@/components/diary-page/diary-list.component'
import { DiaryEntryDetails } from '@/components/diary-page/diary-entry-details.component'
import { AddDiaryEntryModal } from '@/components/add-diary-entry-modal/add-diary-entry-modal'
import { DiaryEntry } from '@/interfaces/diary'
import styles from './styles.module.scss'

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  const fetchEntries = async () => {
    try {
      const { data } = await axios.get<DiaryEntry[]>(`${API_BASE}/api/diary`)
      setEntries(data)

      // Якщо є вибраний запис, оновлюємо його актуальними даними з сервера
      if (selectedEntry) {
        const updated = data.find(e => e._id === selectedEntry._id)
        setSelectedEntry(updated || null)
      }
    } catch (e) {
      console.error('Помилка завантаження списку:', e)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  return (
    <div className={styles.containersGroup}>
      <div className={styles.columnLeft}>
        <DiaryList entries={entries} onSelect={setSelectedEntry} onRefresh={fetchEntries} />
      </div>

      <div className={styles.columnRight}>
        <DiaryEntryDetails
          entry={selectedEntry}
          onDeleteSuccess={() => {
            setSelectedEntry(null)
            fetchEntries()
          }}
          onEditTrigger={() => setIsEditModalOpen(true)}
        />
      </div>

      {/* Модалка для редагування (викликається з DiaryEntryDetails) */}
      <AddDiaryEntryModal
        isOpen={isEditModalOpen}
        isEdit={true}
        initialData={selectedEntry}
        onClose={() => setIsEditModalOpen(false)}
        onSubmitSuccess={fetchEntries}
      />
    </div>
  )
}
