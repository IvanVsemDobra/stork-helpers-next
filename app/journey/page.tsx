'use client'

import React, { useState } from 'react'
import { GreetingBlock } from '@/components/GreetingBlock/GreetingBlock'
import JourneyDetails from '@/components/JourneyDetails/JourneyDetails'
import WeekSelector from '@/components/WeekSelector/WeekSelector'

export default function JourneyPage() {
  const [currentWeek] = useState(25)
  const [selectedWeek, setSelectedWeek] = useState(25)

  return (
    <div style={{ paddingBottom: '40px' }}>
      <GreetingBlock />
      <WeekSelector
        currentWeek={currentWeek}
        selectedWeek={selectedWeek}
        onWeekSelect={setSelectedWeek}
      />
      <JourneyDetails selectedWeek={selectedWeek} />
    </div>
  )
}
