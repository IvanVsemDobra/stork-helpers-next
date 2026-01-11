'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { DiaryList } from '@/components/diary-page/diary-list.component'
import { DiaryEntryDetails } from '@/components/diary-page/diary-entry-details.component'
import { AddDiaryEntryModal } from '@/components/add-diary-entry-modal/add-diary-entry-modal'
import { DiaryEntry, Emotion } from '@/interfaces/diary'
import styles from './styles.module.scss'

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [allEmotions, setAllEmotions] = useState<Emotion[]>([])
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const API_BASE = process.env.NEXT_PUBLIC_API_URL
  const fetchEntries = useCallback(async () => {
    try {
      const { data } = await axios.get<DiaryEntry[]>(`${API_BASE}/api/diaries/me`, {
        withCredentials: true,
      })
      setEntries(data)

      if (selectedEntry) {
        const updated = data.find(e => e._id === selectedEntry._id)
        if (updated) setSelectedEntry(updated)
      }
    } catch (e: unknown) {
      console.error('Помилка завантаження списку:', e)
    }
  }, [API_BASE, selectedEntry])

  useEffect(() => {
    let isIgnore = false

    async function initData() {
      try {
        const [emotionsRes, entriesRes] = await Promise.all([
          axios.get<Emotion[]>(`${API_BASE}/api/emotions`, { withCredentials: true }),
          axios.get<DiaryEntry[]>(`${API_BASE}/api/diaries/me`, { withCredentials: true }),
        ])

        if (!isIgnore) {
          setAllEmotions(emotionsRes.data)
          setEntries(entriesRes.data)
        }
      } catch (e: unknown) {
        console.error('Помилка при ініціалізації даних:', e)
      }
    }

    initData()

    return () => {
      isIgnore = true
    }
  }, [API_BASE])

  return (
    <div className={styles.containersGroup}>
      <div className={styles.columnLeft}>
        <DiaryList
          entries={entries}
          allEmotions={allEmotions}
          onSelect={setSelectedEntry}
          onRefresh={fetchEntries}
        />
      </div>

      <div className={styles.columnRight}>
        <DiaryEntryDetails
          entry={selectedEntry}
          allEmotions={allEmotions}
          onDeleteSuccess={() => {
            setSelectedEntry(null)
            fetchEntries()
          }}
          onEditTrigger={entry => {
            setSelectedEntry(entry)
            setIsEditModalOpen(true)
          }}
        />
      </div>

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
