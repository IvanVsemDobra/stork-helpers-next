import Link from 'next/link'
import { Layout } from '@/components/layout/Layout'
import { DiaryEntryDetails } from '@/components/diary-page/diary-entry-details.component'
import { DiaryEntry } from '@/interfaces/diary'

interface PageProps {
  params: {
    entryId: string
  }
}

export default function DiaryEntryPage({ params }: PageProps) {
  const { entryId } = params
  const mockEntry: DiaryEntry = {
    id: entryId,
    title: `Запис від ${new Date().toLocaleDateString()}`,
    date: new Date().toLocaleDateString(),
    emotions: ['smile', 'sun'],
    content: `Це детальний текст запису з ID: ${entryId}. Тут ти можеш побачити повну історію своїх думок, відчуттів та нотаток за цей день.`,
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 h-full">
        <div className="mb-4">
          <Link
            href="/diary"
            className="text-blue-500 hover:underline flex items-center gap-2 font-lato"
          >
            ← Повернутися до списку
          </Link>
        </div>
        <div className="bg-white rounded-lg border shadow-sm h-[calc(100vh-150px)] overflow-hidden">
          <DiaryEntryDetails entry={mockEntry} />
        </div>
      </div>
    </Layout>
  )
}
