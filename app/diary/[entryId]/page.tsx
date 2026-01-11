'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
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

  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [emotionsRes, entriesRes] = await Promise.all([
          axios.get<Emotion[]>(`${API_BASE}/api/emotions`, { withCredentials: true }),
          axios.get<DiaryEntry[]>(`${API_BASE}/api/diaries/me`, { withCredentials: true }),
        ])

        setAllEmotions(emotionsRes.data)

        const foundEntry = entriesRes.data.find((e: DiaryEntry) => e._id === entryId)

        if (foundEntry) {
          setEntry(foundEntry)
        } else {
          router.push('/diary')
        }
      } catch (error) {
        console.error('Помилка при завантаженні даних запису:', error)
      } finally {
        setLoading(false)
      }
    }

    if (entryId) {
      fetchData()
    }
  }, [entryId, API_BASE, router])

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
          console.log('Редагування:', entryToEdit)
        }}
      />
    </div>
  )
}
