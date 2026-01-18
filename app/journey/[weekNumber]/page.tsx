'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GreetingBlock } from '@/components/GreetingBlock/GreetingBlock'
import JourneyDetails from '@/components/JourneyDetails/JourneyDetails'
import WeekSelector from '@/components/WeekSelector/WeekSelector'

export default function JourneyWeekPage() {
  const params = useParams()
  const router = useRouter()
  const selectedWeek = Number(params.weekNumber) || 1
  const [currentPregnancyWeek] = useState(25)
  const handleWeekSelect = (week: number) => {
    router.push(`/journey/${week}`)
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <GreetingBlock />
      <WeekSelector
        currentWeek={currentPregnancyWeek}
        selectedWeek={selectedWeek}
        onWeekSelect={handleWeekSelect}
      />
      <JourneyDetails selectedWeek={selectedWeek} />
    </div>
  )
}
