import { getRouteSearchResult } from '../lib/routeSearch'
import RouteSelector from './RouteSelector'

export default async function RouteResult({ searchParams }) {
  const params = await searchParams
  const from = (params?.from || '').trim()
  const to = (params?.to || '').trim()

  const searchResult = from && to ? await getRouteSearchResult(from, to) : null
  const navigation = searchResult?.navigation || null
  const nearestStations = searchResult?.nearestStations || null

  return (
    <section className="relative min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl">
        {!from || !to ? (
          <article className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-2xl hover:border-white/20 hover:-translate-y-1 transition duration-300 backdrop-blur-md">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Search first to see full commute options</h2>
            <p className="mt-3 text-slate-400 max-w-md mx-auto font-medium">
              Please use our search tools on the home page or navigation bar to compare route duration, modes, and cost.
            </p>
          </article>
        ) : searchResult?.error ? (
          <article className="rounded-[24px] border border-rose-500/20 bg-rose-500/10 p-6 shadow-2xl backdrop-blur-md hover:border-rose-500/30 hover:-translate-y-1 transition duration-300">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">No Google transit route found</h2>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed max-w-2xl font-medium">
              {searchResult.error === 'origin_equals_destination'
                ? 'Origin and destination are the same. Please enter two different schools.'
                : searchResult.error === 'no_transit_route_found'
                ? 'Google Directions did not return a direct transit route. No worries, we can still show nearby train or bus stations below!'
                : typeof searchResult.error === 'string'
                ? searchResult.error
                : 'Google Directions did not return a transit route. Please review the locations and try again.'}
            </p>
          </article>
        ) : (
          <div className="w-full">
            {navigation && navigation.allRoutes && navigation.allRoutes.length > 0 && (
              <RouteSelector
                allRoutes={navigation.allRoutes}
                origin={from}
                destination={to}
                apiKey={process.env.GOOGLE_MAPS_API_KEY}
                nearestStations={nearestStations}
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}