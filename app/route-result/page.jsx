import { getRouteSearchResult } from '../lib/routeSearch'
import RouteSelector from './RouteSelector'

export default async function RouteResult({ searchParams }) {
  const params = await searchParams
  const from = (params?.from || '').trim()
  const to = (params?.to || '').trim()

  const searchResult = from && to ? await getRouteSearchResult(from, to) : null
  const route = searchResult?.route || null
  const navigation = searchResult?.navigation || null
  const nearestStations = searchResult?.nearestStations || null

  return (
    <section className="relative min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Dynamic Design background gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.14),_rgba(59,130,246,0.03),_transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header Hero Section with Rich Aesthetics */}
        <div className="mb-8 rounded-[32px] border border-slate-200/60 bg-slate-900/95 p-6 text-white shadow-[0_32px_64px_rgba(15,23,42,0.18)] backdrop-blur sm:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                Live Commute Routing
              </span>
              <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl leading-tight">
                {from && to ? (
                  <span className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-cyan-200">
                      {/^-?\d+\.\d+,-?\d+\.\d+$/.test((from || '').trim()) ? '📍 Current Location' : from}
                    </span>
                    <span className="text-slate-500">→</span>
                    <span className="text-cyan-100">
                      {/^-?\d+\.\d+,-?\d+\.\d+$/.test((to || '').trim()) ? '📍 Current Location' : to}
                    </span>
                  </span>
                ) : (
                  'School-to-School Commute'
                )}
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base max-w-2xl">
                Compare multiple routes, real-time transit options, and legally mandated student fares. All details are tailored for Filipino students.
              </p>
            </div>
            {navigation && (
              <div className="flex shrink-0 flex-col items-center justify-center rounded-[24px] border border-white/10 bg-white/5 p-4 text-center backdrop-blur shadow-inner">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-bold">Estimated duration</p>
                <p className="mt-1 text-2xl font-black tracking-tight text-white">{navigation.duration || 'N/A'}</p>
                <p className="text-xs text-slate-300 font-medium mt-1 uppercase tracking-[0.1em]">{navigation.distance || 'N/A'}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800 pt-5">
            <span className="rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-200 transition-colors">
              {searchResult?.error ? 'No direct transit' : navigation ? 'Multiple Transit Route Options' : 'Commute lookup'}
            </span>
            <span className="rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-200 transition-colors">
              {route ? `${route.legs.length} primary steps` : navigation ? 'Verified Live Data' : 'Transit Lookup'}
            </span>
            <span className="rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-200 transition-colors">
              {route ? `Updated ${route.updatedAt}` : 'Real-time computation'}
            </span>
          </div>
        </div>

        {!from || !to ? (
          <article className="rounded-[32px] border border-slate-200/80 bg-white p-8 text-center shadow-[0_24px_50px_rgba(15,23,42,0.06)] hover:shadow-[0_32px_60px_rgba(15,23,42,0.08)] transition-all">
            <h2 className="text-2xl font-bold text-slate-950">Search first to see full commute options</h2>
            <p className="mt-3 text-slate-600 max-w-md mx-auto">
              Please use our search tools on the home page or navigation bar to compare route duration, modes, and cost.
            </p>
          </article>
        ) : searchResult?.error ? (
          <article className="rounded-[24px] border border-rose-200/80 bg-rose-50/50 p-6 shadow-[0_20px_40px_rgba(15,23,42,0.04)] hover:shadow-[0_24px_50px_rgba(15,23,42,0.06)] transition-all">
            <h2 className="text-2xl font-bold text-slate-950">No Google transit route found</h2>
            <p className="mt-3 text-slate-700 text-sm leading-relaxed max-w-2xl">
              {searchResult.error === 'origin_equals_destination'
                ? 'Origin and destination are the same. Please enter two different schools.'
                : searchResult.error === 'no_transit_route_found'
                ? 'Google Directions did not return a direct transit route. No worries, we can still show nearby train or bus stations below!'
                : typeof searchResult.error === 'string'
                ? searchResult.error
                : 'Google Directions did not return a transit route. Please review the locations and try again.'}
            </p>
            {searchResult.nearestStations && (searchResult.nearestStations.origin || searchResult.nearestStations.destination) && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {searchResult.nearestStations.origin && (
                  <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">Origin near transit</p>
                      <p className="text-base font-bold text-slate-900 mt-1">
                        {searchResult.nearestStations.origin?.name || 'No station found'}
                      </p>
                      {searchResult.nearestStations.origin?.vicinity && (
                        <p className="text-xs text-slate-500 mt-1 font-medium">{searchResult.nearestStations.origin.vicinity}</p>
                      )}
                    </div>
                    {searchResult.nearestStations.origin?.name && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(searchResult.nearestStations.origin.name)}&travelmode=walking`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center justify-center rounded-xl bg-cyan-50 hover:bg-cyan-100 px-3.5 py-2 text-xs font-bold tracking-wide text-cyan-700 transition-colors border border-cyan-100/60"
                      >
                        Walking Guide to Station ↗
                      </a>
                    )}
                  </div>
                )}
                {searchResult.nearestStations.destination && (
                  <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">Destination near transit</p>
                      <p className="text-base font-bold text-slate-900 mt-1">
                        {searchResult.nearestStations.destination?.name || 'No station found'}
                      </p>
                      {searchResult.nearestStations.destination?.vicinity && (
                        <p className="text-xs text-slate-500 mt-1 font-medium">{searchResult.nearestStations.destination.vicinity}</p>
                      )}
                    </div>
                    {searchResult.nearestStations.destination?.name && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(searchResult.nearestStations.destination.name)}&destination=${encodeURIComponent(to)}&travelmode=walking`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center justify-center rounded-xl bg-cyan-50 hover:bg-cyan-100 px-3.5 py-2 text-xs font-bold tracking-wide text-cyan-700 transition-colors border border-cyan-100/60"
                      >
                        Walking Guide to End ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </article>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="grid gap-6">
              {/* Premium Multiple Route Options view */}
              {navigation && (
                <div className="grid gap-6">
                  {navigation.allRoutes && navigation.allRoutes.length > 0 ? (
                    <RouteSelector allRoutes={navigation.allRoutes} origin={from} destination={to} apiKey={process.env.GOOGLE_MAPS_API_KEY} />
                  ) : (
                    <article className="rounded-[32px] border border-slate-200 bg-white p-5 sm:p-7 shadow-[0_24px_50px_rgba(15,23,42,0.08)]">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700">Live navigation</p>
                          <h2 className="mt-2 text-xl font-black text-slate-950 leading-tight">{navigation.provider}</h2>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-2 font-bold text-slate-700 text-sm border border-slate-100">
                          {navigation.duration || 'N/A'} • {navigation.distance || 'N/A'}
                        </div>
                      </div>

                      <div className="mb-5 rounded-2xl border border-cyan-100 bg-cyan-50/50 p-4 shadow-sm backdrop-blur">
                        <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-800">
                          Estimated Commuter Fare
                        </h4>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2">
                          <div className="rounded-xl bg-white p-3 border border-slate-100">
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-400 font-bold">Regular Fare</p>
                            <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                              {navigation.totalFareText || `₱${navigation.calculatedRegularFare || 0}`}
                            </p>
                          </div>
                          <div className="rounded-xl bg-white p-3 border border-slate-100">
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-400 font-bold">Student Fare (20% Off)</p>
                            <p className="text-xl font-extrabold text-cyan-700 mt-0.5">
                              {navigation.totalFareText
                                ? `₱${Math.round(parseFloat(navigation.totalFareText.replace(/[^\d.]/g, '')) * 0.8 || 0)}`
                                : `₱${navigation.calculatedStudentFare || 0}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        {navigation.steps.slice(0, 10).map((step, index) => (
                          <div key={`${step.instruction}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-sm font-bold text-slate-950">{index + 1}. {step.instruction}</p>
                            <p className="mt-1 text-xs text-slate-500 font-medium">
                              {step.mode}
                              {step.line ? ` • Line ${step.line}` : ''}
                              {step.duration ? ` • ${step.duration}` : ''}
                              {step.distance ? ` • ${step.distance}` : ''}
                            </p>
                            {(step.departureStop || step.arrivalStop) && (
                              <p className="mt-1 text-xs font-semibold text-slate-400 flex items-center gap-1">
                                <span className="h-1 w-1 bg-cyan-400 rounded-full inline-block" />
                                {step.departureStop || 'Departure'}{' → '}{step.arrivalStop || 'Destination'}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </article>
                  )}
                </div>
              )}
            </div>

            <aside className="grid gap-6 content-start">
              {/* Premium Data Verification Block */}
              <article className="rounded-[32px] border border-cyan-100/80 bg-cyan-50/30 p-5 sm:p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition-all">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-cyan-700">Verification</p>
                <h3 className="mt-1 text-xl font-black text-slate-950">Live commuter data</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 font-medium">
                  This view directly leverages the latest Google Directions API routes with real-time transfer alignments.
                </p>
                <div className="mt-4 grid gap-3 rounded-2xl bg-white p-4 border border-slate-100/80 shadow-sm">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-500 font-medium">Primary Source</span>
                    <span className="font-bold text-slate-950">{navigation ? 'Google Directions' : 'Google Geocoding'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-500 font-medium">Alternative Options</span>
                    <span className="font-bold text-slate-950">
                      {navigation?.allRoutes?.length ? `${navigation.allRoutes.length} options` : 'Not available'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-500 font-medium">Fare Reference</span>
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                      Verified
                    </span>
                  </div>
                </div>
              </article>

               {nearestStations && (nearestStations.origin || nearestStations.destination) && (
                <article className="rounded-[32px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-cyan-700">Proximity stations</p>
                  <h3 className="mt-1 text-xl font-black text-slate-950">Nearest points</h3>
                  <div className="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    {nearestStations.origin && (
                      <div className="flex flex-col justify-between min-h-[90px]">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Origin station</p>
                          <p className="text-base font-bold text-slate-950 mt-1">
                            {nearestStations.origin?.name || 'No station found'}
                          </p>
                          {nearestStations.origin?.vicinity && (
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">{nearestStations.origin.vicinity}</p>
                          )}
                        </div>
                        {nearestStations.origin?.name && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(nearestStations.origin.name)}&travelmode=walking`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center justify-center rounded-xl bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 text-xs font-bold tracking-wide text-cyan-700 transition-colors border border-cyan-100/60"
                          >
                            Get Walking Guide ↗
                          </a>
                        )}
                      </div>
                    )}
                    {nearestStations.destination && (
                      <div className="border-t border-slate-200/60 pt-3 mt-1 flex flex-col justify-between min-h-[90px]">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Destination station</p>
                          <p className="text-base font-bold text-slate-950 mt-1">
                            {nearestStations.destination?.name || 'No station found'}
                          </p>
                          {nearestStations.destination?.vicinity && (
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">{nearestStations.destination.vicinity}</p>
                          )}
                        </div>
                        {nearestStations.destination?.name && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(nearestStations.destination.name)}&destination=${encodeURIComponent(to)}&travelmode=walking`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center justify-center rounded-xl bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 text-xs font-bold tracking-wide text-cyan-700 transition-colors border border-cyan-100/60"
                          >
                            Get Walking Guide ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              )}

              {/* COMMUTE TRANSIT ADVICE */}
              <article className="rounded-[32px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-cyan-700">Commute Guide</p>
                <h3 className="mt-1 text-xl font-black text-slate-950 leading-tight">Smart tips for students</h3>
                <ul className="mt-4 grid gap-2.5 text-sm font-medium leading-6 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-500 shrink-0" />
                    Compare multiple routes above to choose the fastest duration or fewest transfers.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-500 shrink-0" />
                    Always present a valid student ID to drivers and cashiers to receive 20% off.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-500 shrink-0" />
                    Commuter fares match the 2026 Philippine transport guidelines.
                  </li>
                </ul>
              </article>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}