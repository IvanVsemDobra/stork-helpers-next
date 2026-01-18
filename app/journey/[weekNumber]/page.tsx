import { GreetingBlock } from '@/components/GreetingBlock/GreetingBlock'

import JourneyDetails from '@/components/JourneyDetails/JourneyDetails'
import { getBabyInfoByWeekNumber, getMomInfoByWeekNumber } from '@/services/server/weeks.server'

type PageProps = {
  params: { weekNumber: string }
}

export default async function JourneyWeekPage({ params }: PageProps) {
  const { weekNumber } = await params
  const week = Number(weekNumber)
  // const [baby, mom] = await Promise.all([
  //   getBabyInfoByWeekNumber(week),
  //   getMomInfoByWeekNumber(week),
  // ])

  return (
    <>
      <GreetingBlock />
      <JourneyDetails week={week} />
    </>
  )
}
