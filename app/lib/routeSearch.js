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

const computeLegFare = (step) => {
  if (!step.mode || step.mode.toLowerCase() === 'walking') return { regular: 0, student: 0 }

  const mode = step.mode.toLowerCase()
  const distanceKm = step.distance ? parseFloat(step.distance.replace(/[^\d.]/g, '')) : 1

  if (mode.includes('bus')) {
    const baseRegular = 15
    const perKm = 2.2
    const totalRegular = baseRegular + Math.max(0, distanceKm - 4) * perKm
    const totalStudent = totalRegular * 0.8
    return { regular: Math.round(totalRegular), student: Math.round(totalStudent) }
  }

  if (mode.includes('tram') || mode.includes('train') || mode.includes('subway') || mode.includes('rail')) {
    const baseRegular = 13
    const perKm = 1.2
    const totalRegular = baseRegular + distanceKm * perKm
    const totalStudent = totalRegular * 0.8
    return { regular: Math.round(totalRegular), student: Math.round(totalStudent) }
  }

  const baseRegular = 13
  const perKm = 1.8
  const totalRegular = baseRegular + Math.max(0, distanceKm - 4) * perKm
  const totalStudent = totalRegular * 0.8
  return { regular: Math.round(totalRegular), student: Math.round(totalStudent) }
}

const mapGoogleNavigation = (payload) => {
  if (!payload?.routes?.length) return null

  const allRoutes = payload.routes.map((route, routeIndex) => {
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

    let calculatedRegularFare = 0
    let calculatedStudentFare = 0

    for (const step of steps) {
      const legFare = computeLegFare(step)
      calculatedRegularFare += legFare.regular
      calculatedStudentFare += legFare.student
    }

    return {
      provider: 'Google Maps Directions',
      summary: route.summary || `Alternative Option ${routeIndex + 1}`,
      distance: leg.distance?.text || null,
      duration: leg.duration?.text || null,
      totalFareText: route.fare?.text || null,
      totalFareValue: route.fare?.value || null,
      totalFareCurrency: route.fare?.currency || null,
      originLocation: leg.start_location || null,
      destinationLocation: leg.end_location || null,
      steps,
      calculatedRegularFare,
      calculatedStudentFare,
    }
  }).filter(Boolean)

  if (!allRoutes.length) return null

  const seenSignatures = new Set()
  const deduplicatedRoutes = []

  for (const route of allRoutes) {
    const signature = `${route.summary}_${route.distance}_${route.duration}_${route.calculatedRegularFare}`
    if (!seenSignatures.has(signature)) {
      seenSignatures.add(signature)
      deduplicatedRoutes.push(route)
    }
  }

  return {
    ...deduplicatedRoutes[0],
    allRoutes: deduplicatedRoutes,
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
    if (!response.ok) return { error: `HTTP ${response.status}: ${response.statusText}` }

    const payload = await response.json()
    if (payload.status !== 'OK') {
      return { error: payload.error_message || payload.status }
    }

    const location = payload.results?.[0]?.geometry?.location
    const formattedAddress = payload.results?.[0]?.formatted_address || null
    if (!location) return null

    return {
      lat: location.lat,
      lng: location.lng,
      formattedAddress,
    }
  } catch (err) {
    return { error: err.message || 'Error fetching geocode' }
  }
}

const getNearestTransitStation = async (location, apiKey) => {
  if (!location || location.error) return null
  if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return null
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json')
  url.searchParams.set('location', `${location.lat},${location.lng}`)
  url.searchParams.set('radius', '3000')
  url.searchParams.set('type', 'transit_station')
  url.searchParams.set('key', apiKey)

  try {
    const response = await fetch(url.toString(), { cache: 'no-store' })
    if (!response.ok) return { error: `HTTP ${response.status}: ${response.statusText}` }

    const payload = await response.json()
    if (payload.status !== 'OK') {
      return { error: payload.error_message || payload.status }
    }

    if (!payload.results?.length) return null

    const station = payload.results[0]
    return {
      name: station.name || null,
      vicinity: station.vicinity || null,
      rating: station.rating || null,
      location: station.geometry?.location || null,
      placeId: station.place_id || null,
      source: 'Google Places Nearby Search',
    }
  } catch (err) {
    return { error: err.message || 'Error fetching places' }
  }
}

const getNearestStationsForQuery = async (from, to) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) return { error: 'Missing GOOGLE_MAPS_API_KEY environment variable.' }

  const [fromLocation, toLocation] = await Promise.all([
    getGeocodedLocation(from, apiKey),
    getGeocodedLocation(to, apiKey),
  ])

  if (fromLocation && fromLocation.error) return { error: fromLocation.error }
  if (toLocation && toLocation.error) return { error: toLocation.error }

  const [originStation, destinationStation] = await Promise.all([
    getNearestTransitStation(fromLocation, apiKey),
    getNearestTransitStation(toLocation, apiKey),
  ])

  if (originStation && originStation.error) return { error: originStation.error }
  if (destinationStation && destinationStation.error) return { error: destinationStation.error }

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
    return { error: 'Missing GOOGLE_MAPS_API_KEY environment variable.' }
  }

  const url = new URL('https://maps.googleapis.com/maps/api/directions/json')
  url.searchParams.set('origin', from)
  url.searchParams.set('destination', to)
  url.searchParams.set('mode', 'transit')
  url.searchParams.set('alternatives', 'true')
  url.searchParams.set('departure_time', 'now')
  url.searchParams.set('region', 'ph')
  url.searchParams.set('key', apiKey)

  try {
    const response = await fetch(url.toString(), { cache: 'no-store' })
    if (!response.ok) return { error: `HTTP ${response.status}: ${response.statusText}` }

    const payload = await response.json()
    if (payload.status === 'OK' && payload.routes && payload.routes.length > 0) {
      return mapGoogleNavigation(payload)
    }

    // Fallback: Try getting a walking route if no transit route is found
    url.searchParams.set('mode', 'walking')
    url.searchParams.delete('departure_time')
    url.searchParams.set('alternatives', 'true')

    const walkResponse = await fetch(url.toString(), { cache: 'no-store' })
    if (!walkResponse.ok) return { error: `HTTP ${walkResponse.status}: ${walkResponse.statusText}` }

    const walkPayload = await walkResponse.json()
    if (walkPayload.status === 'OK' && walkPayload.routes && walkPayload.routes.length > 0) {
      const mapped = mapGoogleNavigation(walkPayload)
      if (mapped && mapped.allRoutes) {
        mapped.allRoutes = mapped.allRoutes.map((r, i) => ({
          ...r,
          summary: r.summary ? `${r.summary} (Walking)` : `Walking Option ${i + 1}`
        }))
        if (mapped.summary) mapped.summary = `${mapped.summary} (Walking)`
      }
      return mapped
    }

    return { error: walkPayload.error_message || walkPayload.status || 'No transit or walking route found.' }
  } catch (err) {
    return { error: err.message || 'An error occurred during transit lookup.' }
  }
}

const normalizeLocationName = (name = '') => {
  const clean = name.trim().toLowerCase().replace(/[.,]/g, '')
  const schoolAbbr = {
    'ust': 'University of Santo Tomas, Manila',
    'adamson': 'Adamson University, Manila',
    'adu': 'Adamson University, Manila',
    'up': 'University of the Philippines Diliman',
    'upd': 'University of the Philippines Diliman',
    'up diliman': 'University of the Philippines Diliman',
    'dlsu': 'De La Salle University, Manila',
    'feu': 'Far Eastern University, Manila',
    'ue': 'University of the East, Manila',
    'pup': 'Polytechnic University of the Philippines, Manila',
    'mapua': 'Mapua University, Manila',
    'admu': 'Ateneo de Manila University',
    'plm': 'Pamantasan ng Lungsod ng Maynila',
    'nu': 'National University, Manila',
    'san beda': 'San Beda University, Manila',
    'sbca': 'San Beda College Alabang',
    'tup': 'Technological University of the Philippines, Manila',
    'rtu': 'Rizal Technological University',
    'ceu': 'Centro Escolar University, Manila',
    'um': 'University of Mindanao',
    'usc': 'University of San Carlos, Cebu',
    'usjr': 'University of San Jose-Recoletos, Cebu',
    'slu': 'Saint Louis University, Baguio',
    'cpu': 'Central Philippine University, Iloilo',
    'su': 'Silliman University, Dumaguete'
  }

  for (const [abbr, full] of Object.entries(schoolAbbr)) {
    if (clean === abbr || clean.includes(` ${abbr} `) || clean.startsWith(`${abbr} `) || clean.endsWith(` ${abbr}`)) {
      return full
    }
  }
  return name
}

export const getRouteSearchResult = async (fromInput, toInput) => {
  const from = normalizeLocationName(fromInput)
  const to = normalizeLocationName(toInput)

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

  const [navigation, nearestStations] = await Promise.all([
    getGoogleNavigation(from, to),
    getNearestStationsForQuery(from, to),
  ])

  if (navigation && navigation.error) {
    return {
      from,
      to,
      route: null,
      totals: null,
      navigation: null,
      nearestStations: null,
      hasFareData: false,
      hasNavigation: false,
      error: navigation.error,
    }
  }

  if (nearestStations && nearestStations.error) {
    return {
      from,
      to,
      route: null,
      totals: null,
      navigation: null,
      nearestStations: null,
      hasFareData: false,
      hasNavigation: false,
      error: nearestStations.error,
    }
  }

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
