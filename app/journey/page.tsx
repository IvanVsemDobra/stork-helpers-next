import { getMyDayWeekInfo } from '@/services/server/weeks.server'
import { redirect } from 'next/navigation'

export default async function JourneyPage() {
  const weekData = await getMyDayWeekInfo()
  console.log(weekData?.weekNumber)
  redirect(`/journey/${weekData?.weekNumber}`)
}
