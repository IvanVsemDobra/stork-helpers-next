'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import css from './WeekSelector.module.css'

interface WeekSelectorProps {
  currentWeek: number
}

export default function WeekSelector({ currentWeek }: WeekSelectorProps) {
  const router = useRouter()
  const params = useParams<{ weekNumber: string }>()
  const weekFromParams = params.weekNumber ? Number(params.weekNumber) : currentWeek

  const [selectedWeek, setSelectedWeek] = useState<number>(weekFromParams)

  const weeks = Array.from({ length: 40 }, (_, i) => i + 1)

  const getWeekClassName = (week: number) => {
    if (week > currentWeek) return `${css.week} ${css.disabled}`
    if (week === currentWeek) return `${css.week} ${css.current}`
    if (week === selectedWeek && week < currentWeek) return `${css.week} ${css.hovered}`
    return `${css.week} ${css.past}`
  }

  const handleWeekClick = (week: number) => {
    if (week > currentWeek) return
    if (week === currentWeek) return
    setSelectedWeek(week)
    router.push(`/journey/${week}`)
  }

  return (
    <div className={css.wrapper}>
      <div className={css.container}>
        {weeks.map(week => (
          <div key={week} className="slide">
            <button
              type="button"
              className={getWeekClassName(week)}
              onClick={() => handleWeekClick(week)}
              disabled={week > currentWeek}
            >
              <span className={css.weekNumber}>{week}</span>
              <span className={css.weekLabel}>Тиждень</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
