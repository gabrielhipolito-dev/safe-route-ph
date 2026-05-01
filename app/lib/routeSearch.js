// Real-data route lookup: only Google Directions results are used for transit steps.

const stripHtml = (value = '') =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

const mapTravelMode = (step) => {
  if (step.transit_details?.line?.vehicle?.name) {
    return step.transit_details.line.vehicle.name
  }

  const mode = step.travel_mode || 'UNKNOWN'
  if (mode === 'WALKING') return 'Walking'
  if (mode === 'TRANSIT') return 'Transit'
  if (mode === 'DRIVING') return 'Driving'
  return mode
}

const mapGoogleNavigation = (payload) => {
  if (!payload?.routes?.length) return null

  const route = payload.routes[0]
  const leg = route.legs?.[0]
  if (!leg) return null

  const steps = (leg.steps || []).map((step) => ({
    instruction: stripHtml(step.html_instructions || ''),
    mode: mapTravelMode(step),
    duration: step.duration?.text || null,
    distance: step.distance?.text || null,
    departureStop: step.transit_details?.departure_stop?.name || null,
    arrivalStop: step.transit_details?.arrival_stop?.name || null,
    line: step.transit_details?.line?.short_name || step.transit_details?.line?.name || null,
  }))

  return {
    provider: 'Google Maps Directions',
    distance: leg.distance?.text || null,
    duration: leg.duration?.text || null,
    totalFareText: route.fare?.text || null,
    totalFareValue: route.fare?.value || null,
    totalFareCurrency: route.fare?.currency || null,
    originLocation: leg.start_location || null,
    destinationLocation: leg.end_location || null,
    steps,
  }
}

const getGeocodedLocation = async (address, apiKey) => {
  if (!address) return null

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
  url.searchParams.set('address', address)
  url.searchParams.set('region', 'ph')
  url.searchParams.set('key', apiKey)

  try {
    const response = await fetch(url.toString(), { cache: 'no-store' })
    if (!response.ok) return null

    const payload = await response.json()
    if (payload.status !== 'OK') return null

    const location = payload.results?.[0]?.geometry?.location
    const formattedAddress = payload.results?.[0]?.formatted_address || null
    if (!location) return null

    return {
      lat: location.lat,
      lng: location.lng,
      formattedAddress,
    }
  } catch {
    return null
  }
}

const getNearestTransitStation = async (location, apiKey) => {
  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return null
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json')
  url.searchParams.set('location', `${location.lat},${location.lng}`)
  url.searchParams.set('radius', '3000')
  url.searchParams.set('type', 'transit_station')
  url.searchParams.set('key', apiKey)

  try {
    const response = await fetch(url.toString(), { cache: 'no-store' })
    if (!response.ok) return null

    const payload = await response.json()
    if (payload.status !== 'OK' || !payload.results?.length) return null

    const station = payload.results[0]
    return {
      name: station.name || null,
      vicinity: station.vicinity || null,
      rating: station.rating || null,
      location: station.geometry?.location || null,
      placeId: station.place_id || null,
      source: 'Google Places Nearby Search',
    }
  } catch {
    return null
  }
}

const getNearestStationsForQuery = async (from, to) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) return null

  const [fromLocation, toLocation] = await Promise.all([
    getGeocodedLocation(from, apiKey),
    getGeocodedLocation(to, apiKey),
  ])

  const [originStation, destinationStation] = await Promise.all([
    getNearestTransitStation(fromLocation, apiKey),
    getNearestTransitStation(toLocation, apiKey),
  ])

  return {
    origin: originStation
      ? { ...originStation, geocodedAddress: fromLocation?.formattedAddress || null }
      : null,
    destination: destinationStation
      ? { ...destinationStation, geocodedAddress: toLocation?.formattedAddress || null }
      : null,
    originLocation: fromLocation,
    destinationLocation: toLocation,
    source: 'Google Geocoding + Places Nearby Search',
  }
}

const getGoogleNavigation = async (from, to) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return null
  }

  const url = new URL('https://maps.googleapis.com/maps/api/directions/json')
  url.searchParams.set('origin', from)
  url.searchParams.set('destination', to)
  url.searchParams.set('mode', 'transit')
  url.searchParams.set('alternatives', 'false')
  url.searchParams.set('departure_time', 'now')
  url.searchParams.set('region', 'ph')
  url.searchParams.set('key', apiKey)

  try {
    const response = await fetch(url.toString(), { cache: 'no-store' })
    if (!response.ok) return null

    const payload = await response.json()
    if (payload.status !== 'OK') {
      return null
    }

    return mapGoogleNavigation(payload)
  } catch {
    return null
  }
}

export const getRouteSearchResult = async (from, to) => {
  // Basic validation: same origin/destination -> return error
  const normalizeForCompare = (v = '') => v.toLowerCase().replace(/\s+/g, ' ').trim()
  if (normalizeForCompare(from) === normalizeForCompare(to)) {
    return {
      from,
      to,
      route: null,
      totals: null,
      navigation: null,
      hasFareData: false,
      hasNavigation: false,
      error: 'origin_equals_destination',
    }
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  const [navigation, nearestStations] = await Promise.all([
    getGoogleNavigation(from, to),
    getNearestStationsForQuery(from, to),
  ])

  // Prefer parsed Google Directions transit steps.
  if (navigation && navigation.steps && navigation.steps.length) {
    const legs = []
    for (const step of navigation.steps) {
      if (!step.mode || step.mode.toLowerCase() === 'walking') continue

      const title = step.line
        ? `${step.departureStop || 'Stop'} → ${step.arrivalStop || 'Stop'}`
        : step.instruction.slice(0, 120)

      legs.push({
        title,
        mode: step.line ? `${step.mode} • ${step.line}` : step.mode,
        regularMin: null,
        regularMax: null,
        studentMin: null,
        studentMax: null,
        note: step.instruction,
      })
    }

    if (legs.length) {
      const route = {
        id: `google-transit-${from.replace(/\s+/g, '-')}-${to.replace(/\s+/g, '-')}`,
        from,
        to,
        isAutoGenerated: false,
        source: 'google-directions',
        verification: { matrixYear: '2026', lastConfirmed: 'Google Directions', reports: 0 },
        updatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        legs,
      }

      return {
        from,
        to,
        route,
        totals: null,
        navigation,
        nearestStations,
        hasFareData: false,
        hasNavigation: true,
      }
    }
  }

  return {
    from,
    to,
    route: null,
    totals: null,
    navigation,
    nearestStations,
    hasFareData: false,
    hasNavigation: Boolean(navigation),
    error: 'no_transit_route_found',
  }
}
