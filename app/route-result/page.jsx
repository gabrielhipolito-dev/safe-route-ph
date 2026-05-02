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
    <section className="relative min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header Hero Section with Rich Aesthetics */}
        <div className="mb-8 rounded-[32px] border border-white/10 bg-slate-900/60 p-6 text-white shadow-2xl backdrop-blur-xl sm:p-10 hover:border-white/20 transition-all duration-300">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.24em] text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Commute Routing
              </span>
              <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl leading-tight uppercase">
                {from && to ? (
                  <span className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-emerald-300">
                      {/^-?\d+\.\d+,-?\d+\.\d+$/.test((from || '').trim()) ? '📍 Current Location' : from}
                    </span>
                    <span className="text-slate-500">→</span>
                    <span className="text-emerald-100">
                      {/^-?\d+\.\d+,-?\d+\.\d+$/.test((to || '').trim()) ? '📍 Current Location' : to}
                    </span>
                  </span>
                ) : (
                  'School-to-School Commute'
                )}
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base max-w-2xl font-medium">
                Compare multiple routes, real-time transit options, and legally mandated student fares. All details are tailored for Filipino students.
              </p>
            </div>
            {navigation && (
              <div className="flex shrink-0 flex-col items-center justify-center rounded-[24px] border border-white/10 bg-white/5 p-4 text-center backdrop-blur shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-black">Estimated duration</p>
                <p className="mt-1 text-3xl font-black tracking-tight text-white">{navigation.duration || 'N/A'}</p>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-[0.1em]">{navigation.distance || 'N/A'}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
            <span className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300 transition-colors shadow-[0_0_10px_rgba(52,211,153,0.15)]">
              {searchResult?.error ? 'No direct transit' : navigation ? 'Multiple Transit Route Options' : 'Commute lookup'}
            </span>
            <span className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300 transition-colors shadow-[0_0_10px_rgba(52,211,153,0.15)]">
              {route ? `${route.legs.length} primary steps` : navigation ? 'Verified Live Data' : 'Transit Lookup'}
            </span>
            <span className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300 transition-colors shadow-[0_0_10px_rgba(52,211,153,0.15)]">
              {route ? `Updated ${route.updatedAt}` : 'Real-time computation'}
            </span>
          </div>
        </div>

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
            {searchResult.nearestStations && (searchResult.nearestStations.origin || searchResult.nearestStations.destination) && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {searchResult.nearestStations.origin && (
                  <div className="rounded-2xl bg-white/5 p-4 border border-white/10 shadow-xl backdrop-blur-md flex flex-col justify-between hover:-translate-y-1 transition duration-300">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Origin near transit</p>
                      <p className="text-base font-black text-white mt-1 uppercase tracking-tight">
                        {searchResult.nearestStations.origin?.name || 'No station found'}
                      </p>
                      {searchResult.nearestStations.origin?.vicinity && (
                        <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wide">{searchResult.nearestStations.origin.vicinity}</p>
                      )}
                    </div>
                    {searchResult.nearestStations.origin?.name && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(searchResult.nearestStations.origin.name)}&travelmode=walking`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2 text-xs font-black tracking-wide text-emerald-400 transition-all border border-emerald-500/20 active:scale-95 uppercase tracking-wider"
                      >
                        Walking Guide to Station ↗
                      </a>
                    )}
                  </div>
                )}
                {searchResult.nearestStations.destination && (
                  <div className="rounded-2xl bg-white/5 p-4 border border-white/10 shadow-xl backdrop-blur-md flex flex-col justify-between hover:-translate-y-1 transition duration-300">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Destination near transit</p>
                      <p className="text-base font-black text-white mt-1 uppercase tracking-tight">
                        {searchResult.nearestStations.destination?.name || 'No station found'}
                      </p>
                      {searchResult.nearestStations.destination?.vicinity && (
                        <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wide">{searchResult.nearestStations.destination.vicinity}</p>
                      )}
                    </div>
                    {searchResult.nearestStations.destination?.name && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(searchResult.nearestStations.destination.name)}&destination=${encodeURIComponent(to)}&travelmode=walking`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2 text-xs font-black tracking-wide text-emerald-400 transition-all border border-emerald-500/20 active:scale-95 uppercase tracking-wider"
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
                    <article className="rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-7 shadow-2xl backdrop-blur-md hover:-translate-y-1 transition duration-300">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">Live navigation</p>
                          <h2 className="mt-2 text-xl font-black text-white leading-tight uppercase tracking-tight">{navigation.provider}</h2>
                        </div>
                        <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-2 font-black text-emerald-300 text-sm">
                          {navigation.duration || 'N/A'} • {navigation.distance || 'N/A'}
                        </div>
                      </div>

                      <div className="mb-5 rounded-2xl border border-white/10 bg-emerald-500/10 p-4 shadow-sm backdrop-blur-md">
                        <h4 className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">
                          Estimated Commuter Fare
                        </h4>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2">
                          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-400 font-bold">Regular Fare</p>
                            <p className="text-xl font-black text-white mt-0.5">
                              {navigation.totalFareText || `₱${navigation.calculatedRegularFare || 0}`}
                            </p>
                          </div>
                          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-400 font-bold">Student Fare (20% Off)</p>
                            <p className="text-xl font-black text-emerald-400 mt-0.5">
                              {navigation.totalFareText
                                ? `₱${Math.round(parseFloat(navigation.totalFareText.replace(/[^\d.]/g, '')) * 0.8 || 0)}`
                                : `₱${navigation.calculatedStudentFare || 0}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        {navigation.steps.slice(0, 10).map((step, index) => (
                          <div key={`${step.instruction}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            <p className="text-sm font-black text-slate-200">{index + 1}. {step.instruction}</p>
                            <p className="mt-1 text-xs text-slate-400 font-bold uppercase tracking-wide">
                              {step.mode}
                              {step.line ? ` • Line ${step.line}` : ''}
                              {step.duration ? ` • ${step.duration}` : ''}
                              {step.distance ? ` • ${step.distance}` : ''}
                            </p>
                            {(step.departureStop || step.arrivalStop) && (
                              <p className="mt-1 text-xs font-black text-emerald-400 flex items-center gap-1 uppercase tracking-wide">
                                <span className="h-1 w-1 bg-emerald-400 rounded-full inline-block" />
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
              <article className="rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 shadow-2xl backdrop-blur-md hover:-translate-y-1 transition duration-300">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">Verification</p>
                <h3 className="mt-1 text-xl font-black text-white uppercase tracking-tight">Live commuter data</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300 font-medium">
                  This view directly leverages the latest Google Directions API routes with real-time transfer alignments.
                </p>
                <div className="mt-4 grid gap-3 rounded-2xl bg-slate-900/40 p-4 border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Primary Source</span>
                    <span className="font-black text-white uppercase text-xs tracking-wider">{navigation ? 'Google Directions' : 'Google Geocoding'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Alternative Options</span>
                    <span className="font-black text-white uppercase text-xs tracking-wider">
                      {navigation?.allRoutes?.length ? `${navigation.allRoutes.length} options` : 'Not available'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Fare Reference</span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-400">
                      Verified
                    </span>
                  </div>
                </div>
              </article>

              {nearestStations && (nearestStations.origin || nearestStations.destination) && (
                <article className="rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 shadow-2xl backdrop-blur-md hover:-translate-y-1 transition duration-300">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">Proximity stations</p>
                  <h3 className="mt-1 text-xl font-black text-white uppercase tracking-tight">Nearest points</h3>
                  <div className="mt-4 grid gap-3 rounded-2xl bg-white/5 p-4 border border-white/10">
                    {nearestStations.origin && (
                      <div className="flex flex-col justify-between min-h-[90px]">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Origin station</p>
                          <p className="text-base font-black text-white mt-1 uppercase tracking-tight">
                            {nearestStations.origin?.name || 'No station found'}
                          </p>
                          {nearestStations.origin?.vicinity && (
                            <p className="text-xs text-slate-400 mt-0.5 font-medium">{nearestStations.origin.vicinity}</p>
                          )}
                        </div>
                        {nearestStations.origin?.name && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(nearestStations.origin.name)}&travelmode=walking`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-1.5 text-xs font-black tracking-wide text-emerald-400 transition-all border border-emerald-500/20 active:scale-95 uppercase tracking-wider cursor-pointer"
                          >
                            Get Walking Guide ↗
                          </a>
                        )}
                      </div>
                    )}
                    {nearestStations.destination && (
                      <div className="border-t border-white/10 pt-3 mt-1 flex flex-col justify-between min-h-[90px]">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Destination station</p>
                          <p className="text-base font-black text-white mt-1 uppercase tracking-tight">
                            {nearestStations.destination?.name || 'No station found'}
                          </p>
                          {nearestStations.destination?.vicinity && (
                            <p className="text-xs text-slate-400 mt-0.5 font-medium">{nearestStations.destination.vicinity}</p>
                          )}
                        </div>
                        {nearestStations.destination?.name && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(nearestStations.destination.name)}&destination=${encodeURIComponent(to)}&travelmode=walking`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-1.5 text-xs font-black tracking-wide text-emerald-400 transition-all border border-emerald-500/20 active:scale-95 uppercase tracking-wider cursor-pointer"
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
              <article className="rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 shadow-2xl backdrop-blur-md hover:-translate-y-1 transition duration-300">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">Commute Guide</p>
                <h3 className="mt-1 text-xl font-black text-white leading-tight uppercase tracking-tight">Smart tips for students</h3>
                <ul className="mt-4 grid gap-2.5 text-sm font-bold leading-relaxed text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                    Compare multiple routes above to choose the fastest duration or fewest transfers.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                    Always present a valid student ID to drivers and cashiers to receive 20% off.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
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