import { GreetingBlock } from '@/components/diary/GreetingBlock/GreetingBlock'
import { DiaryList } from '@/components/diary/DiaryList/DiaryList'
import { DiaryEntryDetails } from '@/components/diary/DiaryEntryDetails/DiaryEntryDetails'

export default function DiaryPage() {
  return (
    <div>
      <GreetingBlock />
      <DiaryList />
      <DiaryEntryDetails />
    </div>
  )
}
