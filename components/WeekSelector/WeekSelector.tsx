'use client'

import css from './WeekSelector.module.css'

interface WeekSelectorProps {
  currentWeek: number
  selectedWeek: number
  onWeekSelect: (week: number) => void
}

const TOTAL_WEEKS = 40

const WeekSelector = ({ currentWeek, selectedWeek, onWeekSelect }: WeekSelectorProps) => {
  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1)

  const handleWeekClick = (week: number) => {
    if (week > currentWeek) return
    onWeekSelect(week)
  }

  const getWeekClassName = (week: number) => {
    if (week > currentWeek) return css.future
    if (week === selectedWeek) return css.active
    if (week === currentWeek) return css.current
    return css.past
  }

  return (
    <ul className={css.list}>
      {weeks.map(week => (
        <li
          key={week}
          className={`${css.week} ${getWeekClassName(week)}`}
          onClick={() => handleWeekClick(week)}
        >
          <span className={css.value}>{week}</span>
          <span className={css.text}>Тиждень</span>
        </li>
      ))}
    </ul>
  )
}

export default WeekSelector
