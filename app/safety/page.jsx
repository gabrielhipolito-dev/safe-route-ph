import SafetyClient from './SafetyClient'

export const metadata = {
  title: 'Safety Zones & Live Reports | SafeRoute PH',
  description: 'Student-verified safety reports and interactive danger/caution/safe zone maps across Manila.'
}

export default function SafetyPage() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || ''

  return <SafetyClient apiKey={apiKey} />
}