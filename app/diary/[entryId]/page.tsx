'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import { DiaryService } from '@/services/diary.service'
import { DiaryEntryDetails } from '@/components/diary-page/diary-entry-details.component'
import { DiaryEntry, Emotion } from '@/interfaces/diary'
import styles from './styles.module.scss'

export default function DiaryEntryPage() {
  const params = useParams()
  const router = useRouter()
  const entryId = params.entryId as string

  const [entry, setEntry] = useState<DiaryEntry | null>(null)
  const [allEmotions, setAllEmotions] = useState<Emotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [emotions, entries] = await Promise.all([
          DiaryService.getEmotions(),
          DiaryService.getEntries(),
        ])

        setAllEmotions(emotions)

        const foundEntry = entries.find((e: DiaryEntry) => e._id === entryId)

        if (foundEntry) {
          setEntry(foundEntry)
        } else {
          router.push('/diary')
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Помилка завантаження даних:', error.response?.status)
        } else {
          console.error('Невідома помилка:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    if (entryId) {
      fetchData()
    }
  }, [entryId, router])

  if (loading) {
    return <div className={styles.loader}>Завантаження...</div>
  }

  if (!entry) return null

  return (
    <div className={styles.pageContainer}>
      <DiaryEntryDetails
        entry={entry}
        allEmotions={allEmotions}
        onDeleteSuccess={() => {
          router.push('/diary')
        }}
        onEditTrigger={(entryToEdit: DiaryEntry) => {
          console.log('Редагування запису:', entryToEdit._id)
        }}
      />
    </div>
  )
}
