'use client'

import { useState } from 'react'
import WeekSelector from '@/components/WeekSelector/WeekSelector'
import JourneyDetails from '@/components/JourneyDetails/JourneyDetails'
import { GreetingBlock } from '@/components/GreetingBlock/GreetingBlock'

interface PageProps {
  params: {
    weekNumber: string
  }
}

export default function JourneyPage({ params }: PageProps) {
  const weekNum = Number(params.weekNumber)

  const [selectedWeek, setSelectedWeek] = useState<number>(weekNum)

  return (
    <>
      <GreetingBlock />

      <WeekSelector
        currentWeek={weekNum}
        selectedWeek={selectedWeek}
        onWeekSelect={setSelectedWeek}
      />

      <JourneyDetails weekNumber={selectedWeek} />
    </>
  )
}