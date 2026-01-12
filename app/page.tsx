import { MomTipCard } from '@/components/MomTipCard/mom-tip-card'
import css from './page.module.css'
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

export default async function DashboardPage() {
  let weekData
  try {
    weekData = await getMyDayWeekInfo()
  } catch {
    weekData = await getFirstWeekInfo()
  }
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
    </div>
  )
}
