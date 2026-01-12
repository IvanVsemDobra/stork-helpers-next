import { GreetingBlock } from '@/components/GreetingBlock/GreetingBlock'
import { MomTipCard } from '@/components/MomTipCard/mom-tip-card'
import css from './page.module.css'
<<<<<<< HEAD
import { getFirstWeekInfo, getMyDayWeekInfo } from '@/services/server/weeks.server'
import { BabyTodayCard } from '@/components/BabyTodayCard/baby-today-card'
import StatusBlock from '@/components/StatusBlock/StatusBlock'
import { FeelingCheckCard } from '@/components/FeelingCheckCard/FeelingCheckCard'
import TasksList from '@/components/tasks/TasksReminderCard'
=======
import {
  getFirstWeekInfo,
  getMyDayWeekInfo,
} from '@/services/server/weeks.server'
// Містить в собі компоненти:
// GreetingBlock,
// StatusBlock,
// BabyTodayCard,
// MomTipCard,
// TasksReminderCard,
// FeelingCheckCard,

// Загальна поведінка блоків на сторінці:
// Десктоп:
// Всі блоки-компоненти на цій сторінці повинні мати статичну (фіксовану) висоту згідно з макетом. У разі, якщо внутрішній контент перевищує висоту блоку, всередині блоку повинен з'являтись вертикальний скрол.
// Планшет та мобілка:
// Висота блоків динамічно змінюється відповідно до кількості контенту.
>>>>>>> 6927bbe (Revert "Merge pull request #44 from IvanVsemDobra/feature/baby-today-card")

export default async function DashboardPage() {
  let weekData
  try {
    weekData = await getMyDayWeekInfo()
  } catch {
    weekData = await getFirstWeekInfo()
  }
<<<<<<< HEAD

  // Містить в собі компоненти:
  // GreetingBlock      ✅
  // StatusBlock        (Ще не підключено)
  // BabyTodayCard      ✅
  // MomTipCard         ✅
  // TasksReminderCard  ✅ (Підключено через TasksList)
  // FeelingCheckCard   ✅

  const tipIndex = 6 - (weekData.daysToMeeting % 7)

  return (
    <div className={css.container}>
      <GreetingBlock />
      <StatusBlock currentWeek={weekData.weekNumber} daysLeft={weekData.daysToMeeting} />
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
        <TasksList />
      </aside>

      <section>
        <FeelingCheckCard />
      </section>
=======
  const tipIndex = (6 - weekData.daysToMeeting % 7)
  return (
    <div className={css.container}>
      <section>GreetingBlock</section>
      <section>StatusBlock</section>
      <section>BabyTodayCard</section>
      <section>
        <MomTipCard tipIndex={tipIndex} momDailyTips={weekData.momDailyTips} />
      </section>
      <section>TasksReminderCard</section>
      <section>FeelingCheckCard</section>
>>>>>>> 6927bbe (Revert "Merge pull request #44 from IvanVsemDobra/feature/baby-today-card")
    </div>
  )
}
