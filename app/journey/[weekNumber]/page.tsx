import { GreetingBlock } from '@/components/GreetingBlock/GreetingBlock'
import JourneyDetails from '@/components/JourneyDetails/JourneyDetails'

export default async function JourneyPageWeekNumber({
  params,
}: {
  params: Promise<{ weekNumber: number }>
}) {
  const { weekNumber } = await params
  const weekNum = Number(weekNumber)

  return (
    <>
      <GreetingBlock />
      {/* <WeekSelector
        currentWeek={currentWeek}
        selectedWeek={selectedWeek}
        onWeekSelect={setSelectedWeek}
      /> */}
      <JourneyDetails weekNumber={weekNum} />
    </>
  )
}
