import css from './page.module.css'
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

export default function DashboardPage() {
  return (
    <div className={css.container}>
      <section>GreetingBlock</section>
      <section>StatusBlock</section>
      <section>BabyTodayCard</section>
      <section>MomTipCard</section>
      <section>TasksReminderCard</section>
      <section>FeelingCheckCard</section>
    </div>
  )
}
