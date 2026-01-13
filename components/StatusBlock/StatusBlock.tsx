'use client'

import { useState, useEffect } from 'react'

import { api } from '../../services/api'
import CurrentWeek from './CurrentWeek/CurrentWeek'
import Countdown from './Countdown/Countdown'

import css from './StatusBlock.module.css'

interface PregnancyStatus {
  currentWeek: number
  daysLeft: number
}

interface WeekInfoResponse {
  weekNumber: number
  daysToMeeting: number
}

const StatusBlock = () => {
  const [status, setStatus] = useState<PregnancyStatus | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeekInfo = async () => {
      try {
        setIsLoading(true)

        const { data } = await api.get<WeekInfoResponse>('/weeks/me/my-day')
        setStatus({ currentWeek: data.weekNumber, daysLeft: data.daysToMeeting })
      } catch {
        setError('Не вдалося завантажити статус')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeekInfo()
  }, [])

  if (isLoading) return <div>Завантаження...</div>
  if (error) return <div>{error}</div>
  if (!status) return null

  return (
    <section className={css.container}>
      <CurrentWeek week={status.currentWeek} />
      <Countdown daysLeft={status.daysLeft} />
    </section>
  )
}

export default StatusBlock
