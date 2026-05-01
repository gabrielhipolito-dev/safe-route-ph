import { getRouteSearchResult } from '../lib/routeSearch'

export default async function RouteResult({ searchParams }) {
  const params = await searchParams
  const from = (params?.from || '').trim()
  const to = (params?.to || '').trim()

  const searchResult = from && to ? await getRouteSearchResult(from, to) : null
  const route = searchResult?.route || null
  const navigation = searchResult?.navigation || null
  const nearestStations = searchResult?.nearestStations || null

  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">Fare breakdown</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {from && to ? `${from} -> ${to}` : 'School-to-school route result'}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            Real route fare data is shown leg-by-leg, and live transit navigation can be pulled from Google Maps when available.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
              {searchResult?.error ? 'No Google transit route' : navigation ? 'Google transit' : 'Route lookup'}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
              {route ? `${route.legs.length} transit steps` : navigation ? 'Navigation found' : 'Route lookup'}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
              {route ? `Updated ${route.updatedAt}` : 'Waiting for Google data'}
            </span>
          </div>
        </div>

        {!from || !to ? (
          <article className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-bold text-slate-950">Search first to see fare breakdown</h2>
            <p className="mt-3 text-slate-600">
              Go back to the homepage and enter both origin and destination schools.
            </p>
          </article>
        ) : searchResult?.error ? (
          <article className="rounded-[20px] border border-rose-200 bg-rose-50 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
            <h2 className="text-2xl font-bold text-slate-900">No Google transit route</h2>
            <p className="mt-2 text-slate-700">
              {searchResult.error === 'origin_equals_destination'
                ? 'Origin and destination are the same. Please enter two different schools.'
                : 'Google Directions did not return a transit route for this pair. We can still show nearby stations from Places below if available.'}
            </p>
            {searchResult.nearestStations && (searchResult.nearestStations.origin || searchResult.nearestStations.destination) && (
              <div className="mt-4 grid gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Origin station</p>
                  <p className="text-sm text-slate-600">{searchResult.nearestStations.origin?.name || 'No station found'}</p>
                  {searchResult.nearestStations.origin?.vicinity && (
                    <p className="text-xs text-slate-500">{searchResult.nearestStations.origin.vicinity}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Destination station</p>
                  <p className="text-sm text-slate-600">{searchResult.nearestStations.destination?.name || 'No station found'}</p>
                  {searchResult.nearestStations.destination?.vicinity && (
                    <p className="text-xs text-slate-500">{searchResult.nearestStations.destination.vicinity}</p>
                  )}
                </div>
              </div>
            )}
          </article>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4">
              {route && (
                <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Google transit</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">Route steps</h2>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Fare</p>
                  <p className="text-sm font-semibold text-slate-900">{navigation?.totalFareText || 'Not provided by Google'}</p>
                  <p className="mt-1 text-xs text-slate-500">{navigation?.duration || 'N/A'} • {navigation?.distance || 'N/A'}</p>
                </div>
              </div>

              <div className="grid gap-4">
                {route.legs.map((leg, index) => (
                  <article key={`${route.id}-${index}`} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
                            {index + 1}
                          </span>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Leg {index + 1}</p>
                        </div>
                        <h3 className="text-lg font-bold text-slate-950">{leg.title}</h3>
                        <p className="text-sm text-slate-500">{leg.mode}</p>
                        <p className="max-w-xl text-sm leading-6 text-slate-600">{leg.note}</p>
                      </div>

                      <div className="rounded-2xl bg-white px-4 py-3 text-left shadow-sm sm:min-w-[200px] sm:text-right">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Stop</p>
                        <p className="text-sm font-semibold text-slate-900">{leg.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{leg.duration || 'Duration N/A'}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
                </article>
              )}

              {navigation && (
                <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Live navigation</p>
                      <h2 className="mt-1 text-xl font-bold text-slate-950">{navigation.provider}</h2>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                      {navigation.duration || 'N/A'} • {navigation.distance || 'N/A'}
                    </div>
                  </div>

                  {navigation.totalFareText && (
                    <p className="mb-4 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-800">
                      Google transit fare: {navigation.totalFareText}
                    </p>
                  )}

                  <div className="grid gap-2">
                    {navigation.steps.slice(0, 8).map((step, index) => (
                      <div key={`${step.instruction}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-900">{index + 1}. {step.instruction}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {step.mode}
                          {step.line ? ` • Line ${step.line}` : ''}
                          {step.duration ? ` • ${step.duration}` : ''}
                          {step.distance ? ` • ${step.distance}` : ''}
                        </p>
                        {(step.departureStop || step.arrivalStop) && (
                          <p className="mt-1 text-xs text-slate-500">
                            {step.departureStop || 'Unknown stop'}{' -> '}{step.arrivalStop || 'Unknown stop'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </article>
              )}
            </div>

            <aside className="grid gap-4">
              <article className="rounded-[28px] border border-cyan-200 bg-cyan-50 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Verification</p>
                <h3 className="mt-1 text-xl font-bold text-slate-950">Google-only transit data</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  This view shows only Google Directions transit output. If Google does not return a transit route, no fake fares are shown.
                </p>
                <div className="mt-4 grid gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-500">Source</span>
                    <span className="font-semibold text-slate-950">{navigation ? 'Google Directions' : 'Google Geocoding + Places'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-500">Transit routes</span>
                    <span className="font-semibold text-slate-950">{navigation ? 'Available' : 'Not returned'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-500">Fare matrix</span>
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                      Google only
                    </span>
                  </div>
                </div>
              </article>

              {nearestStations && (nearestStations.origin || nearestStations.destination) && (
                <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Nearest stations</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-950">Places lookup</h3>
                  <div className="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Origin station</p>
                      <p className="text-sm text-slate-600">
                        {nearestStations.origin?.name || 'No station found'}
                      </p>
                      {nearestStations.origin?.vicinity && (
                        <p className="text-xs text-slate-500">{nearestStations.origin.vicinity}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Destination station</p>
                      <p className="text-sm text-slate-600">
                        {nearestStations.destination?.name || 'No station found'}
                      </p>
                      {nearestStations.destination?.vicinity && (
                        <p className="text-xs text-slate-500">{nearestStations.destination.vicinity}</p>
                      )}
                    </div>
                  </div>
                </article>
              )}

              <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Why this works</p>
                <h3 className="mt-1 text-xl font-bold text-slate-950">Real Google transit behavior</h3>
                <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
                  <li>• Google Directions supplies the transit route and steps.</li>
                  <li>• No static filler or synthetic fare legs are shown.</li>
                  <li>• If Google provides fare text, it is displayed directly.</li>
                  <li>• If Google returns no transit route, the page shows no fake result.</li>
                </ul>
              </article>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}