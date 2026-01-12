'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { api } from '@/app/api/client'
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
  const checkIsDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 1440
  const fetchEntries = useCallback(async () => {
    try {
      const { data } = await api.get<DiaryEntry[]>('/diaries/me')
      setEntries(data)

      if (selectedEntry) {
        const updated = data.find((e: DiaryEntry) => e._id === selectedEntry._id)
        setSelectedEntry(updated || (checkIsDesktop() ? data[0] : null))
      } else if (checkIsDesktop() && data.length > 0) {
        setSelectedEntry(data[0])
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error('Помилка завантаження списку:', e.response?.status, e.message)
      }
    }
  }, [selectedEntry])

  useEffect(() => {
    let isIgnore = false

    async function initData() {
      try {
        const [emotionsRes, entriesRes] = await Promise.all([
          api.get<Emotion[]>('/emotions/emotions'),
          api.get<DiaryEntry[]>('/diaries/me'),
        ])

        if (!isIgnore) {
          setAllEmotions(emotionsRes.data)
          setEntries(entriesRes.data)

          if (checkIsDesktop() && entriesRes.data.length > 0 && !selectedEntry) {
            setSelectedEntry(entriesRes.data[0])
          }
        }
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          console.error('Помилка при ініціалізації даних:', e.response?.status)
        }
      }
    }

    initData()
    return () => {
      isIgnore = true
    }
  }, [selectedEntry])

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
          onEditTrigger={(entry: DiaryEntry) => {
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
