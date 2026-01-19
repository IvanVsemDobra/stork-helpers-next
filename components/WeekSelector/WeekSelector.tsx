'use client'
import css from './WeekSelector.module.css'

import { useRouter, useParams } from 'next/navigation'

interface WeekSelectorProps {
  currentWeek: number
}

export default function WeekSelector({ currentWeek }: WeekSelectorProps) {
  const router = useRouter()

  const weeks = Array.from({ length: 40 }, (_, i) => i + 1)
  const params = useParams<{ weekNumber: string }>()
  const selectedWeek = Number(params.weekNumber) || currentWeek

  const getWeekClassName = (week: number) => {
    if (week > currentWeek) return css.future
    if (week === selectedWeek) return css.active
    if (week === currentWeek) return css.current
    return css.past
  }

  const handleWeekClick = (week: number) => {
    if (week > currentWeek) return // майбутні тижні неактивні
    if (week === selectedWeek) return // клік по активному — нічого не робимо
    router.push(`/journey/${week}`)
  }

  console.log('currentWeek prop:', currentWeek, 'selectedWeek:', selectedWeek)

  return (
    <ul className={css.list}>
      {weeks.map(week => {
        const isFuture = week > currentWeek

        return (
          <li key={week} className={`${css.week} ${getWeekClassName(week)}`}>
            <button
              type="button"
              className={css.weekBtn}
              onClick={() => handleWeekClick(week)}
              disabled={isFuture}
              aria-current={week === selectedWeek ? 'page' : undefined}
            >
              <span className={css.value}>{week}</span>
              <span className={css.text}>Тиждень</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
