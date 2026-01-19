// import { redirect } from 'next/navigation'

// export default function JourneyPage() {
//   redirect('/journey/1')
// }

'use client'

import React, { useState } from 'react'
import { GreetingBlock } from '@/components/GreetingBlock/GreetingBlock'
import JourneyDetails from '@/components/JourneyDetails/JourneyDetails'
import WeekSelector from '@/components/WeekSelector/WeekSelector'
// import css from './JourneyPage.module.css'

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
      <JourneyDetails weekNumber={selectedWeek} />
    </div>
  )
}
