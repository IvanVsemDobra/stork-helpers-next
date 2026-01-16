import { GreetingBlock } from '@/components/GreetingBlock/GreetingBlock'
import { MomTipCard } from '@/components/MomTipCard/mom-tip-card'
import css from './page.module.css'
import { getFirstWeekInfo, getMyDayWeekInfo } from '@/services/server/weeks.server'
import { BabyTodayCard } from '@/components/BabyTodayCard/baby-today-card'
import { FeelingCheckCard } from '@/components/FeelingCheckCard/FeelingCheckCard'
import TasksList from '@/components/tasks/TasksReminderCard'

// Містить в собі компоненти:
// GreetingBlock      ✅
// StatusBlock        (Ще не підключено)
// BabyTodayCard      ✅
// MomTipCard         ✅
// TasksReminderCard  ✅ (Підключено через TasksList)
// FeelingCheckCard   ✅

export default async function DashboardPage() {
  let weekData
  try {
    weekData = await getMyDayWeekInfo()
  } catch {
    weekData = await getFirstWeekInfo()
  }
  const tipIndex = 6 - (weekData.daysToMeeting % 7)

  return (
    <div className={css.container}>
      <GreetingBlock />

      <section>StatusBlock</section>

      <BabyTodayCard
        image={weekData.image}
        imageAlt={weekData.imageAlt}
        babySize={weekData.babySize}
        babyWeight={weekData.babyWeight}
        babyActivity={weekData.babyActivity}
        babyDevelopment={weekData.babyDevelopment}
      />

      <MomTipCard tipIndex={tipIndex} momDailyTips={weekData.momDailyTips} />

      <aside className={css.tasksSidebar}>
        <TasksList isAuthenticated={true} />
      </aside>

      <section>
        <FeelingCheckCard />
      </section>
    </div>
  )
}