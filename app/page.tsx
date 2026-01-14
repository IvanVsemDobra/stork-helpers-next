import TasksList from '@/components/tasks/TasksList'
import css from './page.module.css'
import { getFirstWeekInfo, getMyDayWeekInfo } from '@/services/server/weeks.server'
import { BabyTodayCard } from '@/components/BabyTodayCard/baby-today-card'
import { FeelingCheckCard } from '@/components/FeelingCheckCard/FeelingCheckCard'
// Містить в собі компоненти:
// GreetingBlock      ✅
// StatusBlock        (Ще не підключено)
// BabyTodayCard      ✅
// MomTipCard         ✅
// TasksReminderCard  (Ще не підключено)
// FeelingCheckCard   ✅

// Загальна поведінка блоків на сторінці:
// Десктоп:
// Всі блоки-компоненти на цій сторінці повинні мати статичну (фіксовану) висоту згідно з макетом. У разі, якщо внутрішній контент перевищує висоту блоку, всередині блоку повинен з'являтись вертикальний скрол.
// Планшет та мобілка:
// Висота блоків динамічно змінюється відповідно до кількості контенту.

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
      {/* в компонентах огортайте розмітку в <section></section>, а при 
      додаванні компонентів сюди теги <section></section> прибирайте */}
      <GreetingBlock />
      <section>StatusBlock</section>
      <section>BabyTodayCard</section>
      <section>MomTipCard</section>
      <aside className={css.tasksSidebar}>
        <TasksList isAuthenticated={true} /> </aside>
      <section>FeelingCheckCard</section>
    </div>
  )
}
