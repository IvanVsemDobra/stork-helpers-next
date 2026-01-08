import React from 'react'
import Link from 'next/link'
import { Layout } from '@/components/layout/Layout' // Перевір шлях до Layout
import { DiaryEntryDetails } from '@/components/diary-page/DiaryEntryDetails' // Перевір шлях до компонента
import { DiaryEntry } from '@/interfaces/diary' // Перевір шлях до інтерфейсів

interface PageProps {
  params: {
    entryId: string
  }
}

export default function DiaryEntryPage({ params }: PageProps) {
  // 1. Імітуємо отримання даних з бекенду по ID
  // У майбутньому тут буде запит: const entry = await getEntryById(params.entryId)
  const mockEntry: DiaryEntry = {
    id: params.entryId,
    title: `Запис від ${new Date().toLocaleDateString()}`, // Динамічний заголовок для прикладу
    date: new Date().toLocaleDateString(),
    emotions: ['smile', 'sun'], // Приклад списку емоцій
    content: `Це детальний текст запису з ID: ${params.entryId}. Тут ти можеш побачити повну історію своїх думок, відчуттів та нотаток за цей день.`,
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 h-full">
        {/* Кнопка "Назад" - важлива для мобільної версії */}
        <div className="mb-4">
          <Link
            href="/diary"
            className="text-blue-500 hover:underline flex items-center gap-2 font-lato"
          >
            ← Повернутися до списку
          </Link>
        </div>

        {/* Відображаємо компонент деталей */}
        <div className="bg-white rounded-lg border shadow-sm h-[calc(100vh-150px)] overflow-hidden">
          <DiaryEntryDetails entry={mockEntry} />
        </div>
      </div>
    </Layout>
  )
}
