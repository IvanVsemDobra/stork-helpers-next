import { Layout } from '@/components/layout/Layout'
import { GreetingBlock } from '@/components/diary-page/greeting-block.component'
import { DiaryList } from '@/components/diary-page/diary-list.component'
import { DiaryEntryDetails } from '@/components/diary-page/diary-entry-details.component'
import styles from './styles.module.scss'
import { DiaryEntry } from '@/interfaces/diary'

export default function DiaryPage() {
  const entries: DiaryEntry[] = []

  return (
    <Layout>
      <div className={styles.containersGroup}>
        <div className={styles.columnLeft}>
          <GreetingBlock />
          <DiaryList entries={entries} />
        </div>
        <div className={styles.columnRight}>
          <DiaryEntryDetails entry={null} />
        </div>
      </div>
    </Layout>
  )
}
