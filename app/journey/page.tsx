'use client'

import { GreetingBlock } from '@/components/GreetingBlock/GreetingBlock'
import JourneyDetails from '@/components/JourneyDetails/JourneyDetails'
import WeekSelector from '@/components/WeekSelector/WeekSelector'

export default function JourneyPage() {
  return (
    <div>
      <GreetingBlock />
      <WeekSelector currentWeek={4} selectedWeek={5} onWeekSelect={() => {}} />

      <JourneyDetails />
    </div>
  )
}
