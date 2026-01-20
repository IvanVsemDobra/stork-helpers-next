import { GreetingBlock } from '@/components/GreetingBlock/GreetingBlock'
import WeekSelector from '@/components/WeekSelector/WeekSelector'
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
      <WeekSelector currentWeek={weekNum} />
      <JourneyDetails weekNumber={weekNum} />
    </>
  )
}
