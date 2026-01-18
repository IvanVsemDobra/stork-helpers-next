import { redirect } from 'next/navigation'

export default function JourneyIndexPage() {
  const currentWeek = 12 // тимчасово
  redirect(`/journey/${currentWeek}`)
}
