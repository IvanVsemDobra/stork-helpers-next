import css from './mom-tip-card.module.css'

interface momDailyTipsProps {
  tipIndex: number
  momDailyTips: string[]
}
export const MomTipCard = ({ tipIndex, momDailyTips }: momDailyTipsProps) => {
  return (
    <div className={css.card}>
      <h2 className={css.title}>Порада для мами</h2>
      <p className={css.text}>
        {momDailyTips[tipIndex] ? momDailyTips[tipIndex] : 'Порада відсутня'}
      </p>
    </div>
  )
}

// const MS_IN_DAY = 1000 * 60 * 60 * 24;

// const today = new Date();
// today.setHours(0, 0, 0, 0);

// const due = new Date(dueDate);
// due.setHours(0, 0, 0, 0);

// let tipIndex = null;

// if (today < due) {
//   const daysDiff = Math.floor((due - today) / MS_IN_DAY);
//   tipIndex = daysDiff % 7+1;
// }

// tipIndex === null → показуємо повідомлення замість поради
