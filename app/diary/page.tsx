import React from 'react'
import { Layout } from '@/components/layout/Layout' // Імпорт твого Layout (шлях може відрізнятись)
import { GreetingBlock } from '@/components/diary-page/GreetingBlock'
import { DiaryList } from '@/components/diary-page/DiaryList'
import { DiaryEntryDetails } from '@/components/diary-page/DiaryEntryDetails'

export default function DiaryPage() {
  // На цьому етапі масив порожній, як і просили

  return (
    <Layout>
      <div>
        {/* Ліва частина: Привітання + Список */}
        <div>
          <GreetingBlock />
          <DiaryList />
        </div>

        {/* Права частина: Деталі (відображається тільки на десктопі через CSS) */}
        <div>
          {/* Передаємо null, щоб відобразився плейсхолдер */}
          <DiaryEntryDetails entry={null} />
        </div>
      </div>
    </Layout>
  )
}
