import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getRouteSearchResult } from '../app/lib/routeSearch.js'

const originalApiKey = process.env.GOOGLE_MAPS_API_KEY

const buildGeocodePayload = (address, lat, lng) => ({
  status: 'OK',
  results: [
    {
      formatted_address: `${address}, Manila`,
      geometry: { location: { lat, lng } },
    },
  ],
})

const buildPlacesPayload = (name, lat, lng, placeId) => ({
  status: 'OK',
  results: [
    {
      name,
      vicinity: 'Metro Manila',
      rating: 4.5,
      geometry: { location: { lat, lng } },
      place_id: placeId,
    },
  ],
})

const directionsPayload = {
  status: 'OK',
  routes: [
    {
      summary: 'Route A',
      fare: { text: '₱20', value: 20, currency: 'PHP' },
      legs: [
        {
          distance: { text: '10 km' },
          duration: { text: '30 mins' },
          start_location: { lat: 14.5, lng: 120.9 },
          end_location: { lat: 14.6, lng: 121.0 },
          steps: [
            {
              html_instructions: 'Walk <b>to</b> &amp; go',
              travel_mode: 'WALKING',
              distance: { text: '0.4 km' },
              duration: { text: '5 mins' },
              start_location: { lat: 14.5, lng: 120.9 },
              end_location: { lat: 14.51, lng: 120.91 },
            },
            {
              html_instructions: 'Take the bus',
              travel_mode: 'TRANSIT',
              distance: { text: '10 km' },
              duration: { text: '20 mins' },
              transit_details: {
                departure_stop: { name: 'Stop A' },
                arrival_stop: { name: 'Stop B' },
                line: {
                  short_name: 'B1',
                  vehicle: { name: 'Bus' },
                },
              },
              start_location: { lat: 14.51, lng: 120.91 },
              end_location: { lat: 14.6, lng: 121.0 },
            },
          ],
        },
      ],
    },
    {
      summary: 'Route A Duplicate',
      legs: [
        {
          distance: { text: '10 km' },
          duration: { text: '30 mins' },
          steps: [
            {
              html_instructions: 'Walk <b>to</b> &amp; go',
              travel_mode: 'WALKING',
              distance: { text: '0.4 km' },
              duration: { text: '5 mins' },
            },
            {
              html_instructions: 'Take the bus',
              travel_mode: 'TRANSIT',
              distance: { text: '10 km' },
              duration: { text: '20 mins' },
              transit_details: {
                departure_stop: { name: 'Stop A' },
                arrival_stop: { name: 'Stop B' },
                line: {
                  short_name: 'B1',
                  vehicle: { name: 'Bus' },
                },
              },
            },
          ],
        },
      ],
    },
  ],
}

const mockFetchSequence = () =>
  vi.fn(async (input) => {
    const url = new URL(input.toString())
    if (url.pathname.includes('/geocode/')) {
      const address = url.searchParams.get('address')
      if (address?.includes('University of the Philippines Diliman')) {
        return {
          ok: true,
          json: async () => buildGeocodePayload(address, 14.64, 121.07),
        }
      }
      return {
        ok: true,
        json: async () => buildGeocodePayload(address, 14.61, 121.0),
      }
    }
    if (url.pathname.includes('/place/nearbysearch/')) {
      const location = url.searchParams.get('location') || ''
      if (location.startsWith('14.64')) {
        return {
          ok: true,
          json: async () => buildPlacesPayload('Origin Station', 14.65, 121.08, 'place-origin'),
        }
      }
      return {
        ok: true,
        json: async () =>
          buildPlacesPayload('Destination Station', 14.62, 121.01, 'place-destination'),
      }
    }
    if (url.pathname.includes('/directions/')) {
      return {
        ok: true,
        json: async () => directionsPayload,
      }
    }
    return { ok: false, status: 500, statusText: 'Unexpected URL' }
  })

beforeEach(() => {
  process.env.GOOGLE_MAPS_API_KEY = 'test-key'
})

afterEach(() => {
  process.env.GOOGLE_MAPS_API_KEY = originalApiKey
  vi.restoreAllMocks()
})

describe('getRouteSearchResult', () => {
  it('returns an error when origin and destination match', async () => {
    global.fetch = vi.fn(() => {
      throw new Error('fetch should not be called')
    })

    const result = await getRouteSearchResult('UPD', 'UPD')
    expect(result.error).toBe('origin_equals_destination')
    expect(result.hasNavigation).toBe(false)
  })

  it('maps directions, fares, and nearest stations', async () => {
    global.fetch = mockFetchSequence()

    const result = await getRouteSearchResult('UPD', 'UST')

    expect(result.error).toBeUndefined()
    expect(result.hasNavigation).toBe(true)
    expect(result.from).toBe('University of the Philippines Diliman')
    expect(result.to).toBe('University of Santo Tomas, Manila')
    expect(result.route?.legs).toHaveLength(1)
    expect(result.route?.legs[0].mode).toBe('Bus • B1')
    expect(result.navigation?.steps[0].instruction).toBe('Walk to & go')
    expect(result.navigation?.allRoutes).toHaveLength(1)
    expect(result.navigation?.calculatedRegularFare).toBe(28)
    expect(result.navigation?.calculatedStudentFare).toBe(23)
    expect(result.nearestStations?.origin?.name).toBe('Origin Station')
    expect(result.nearestStations?.destination?.name).toBe('Destination Station')
    expect(result.nearestStations?.origin?.geocodedAddress).toContain('University of the Philippines Diliman')
  })

  it('surfaces missing API key errors', async () => {
    process.env.GOOGLE_MAPS_API_KEY = ''
    global.fetch = vi.fn(() => {
      throw new Error('fetch should not be called')
    })

    const result = await getRouteSearchResult('UPD', 'UST')
    expect(result.error).toBe('Missing GOOGLE_MAPS_API_KEY environment variable.')
    expect(result.hasNavigation).toBe(false)
  })
})
