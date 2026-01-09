import { Layout } from '@/components/layout/Layout'
import { GreetingBlock } from '@/components/diary-page/greeting-block.component'
import { DiaryList } from '@/components/diary-page/diary-list.component'
import { DiaryEntryDetails } from '@/components/diary-page/diary-entry-details.component'
import styles from './styles.module.scss'

export default function DiaryPage() {
  return (
    <Layout>
      <div className={styles.containersGroup}>
        <div>
          <GreetingBlock />
          <DiaryList />
        </div>
        <div>
          <DiaryEntryDetails entry={null} />
        </div>
      </div>
    </Layout>
  )
}
