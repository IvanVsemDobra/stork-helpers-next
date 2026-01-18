import { GreetingBlock } from '@/components/GreetingBlock/GreetingBlock'

import JourneyDetails from '@/components/JourneyDetails/JourneyDetails'

export default function JourneyWeekPage({ params }: { params: { weekNumber: string } }) {
  const weekNumber = Number(params.weekNumber)

  return (
    <>
      <GreetingBlock />
      <JourneyDetails weekNumber={weekNumber} />
    </>
  )
}
