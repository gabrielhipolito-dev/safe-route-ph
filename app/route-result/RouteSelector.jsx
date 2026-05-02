'use client'

import { useState, useMemo } from 'react'

const formatArrivalTime = (durationText = '') => {
  if (!durationText) return 'N/A'

  const hoursMatch = durationText.match(/(\d+)\s*hr/i) || durationText.match(/(\d+)\s*hour/i)
  const minsMatch = durationText.match(/(\d+)\s*min/i)

  let totalMins = 0
  if (hoursMatch) totalMins += parseInt(hoursMatch[1]) * 60
  if (minsMatch) totalMins += parseInt(minsMatch[1])

  if (totalMins === 0) return 'N/A'

  const now = new Date()
  now.setMinutes(now.getMinutes() + totalMins)

  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

const getTrainIntermediateStations = (departure, arrival) => {
  if (!departure || !arrival) return null

  const lrt1 = [
    "Roosevelt", "Balintawak", "Monumento", "5th Avenue", "R. Papa",
    "Abad Santos", "Blumentritt", "Tayuman", "Bambang", "D. Jose",
    "Carriedo", "Central Terminal", "United Nations", "Pedro Gil",
    "Quirino", "Vito Cruz", "Gil Puyat", "Libertad", "EDSA", "Baclaran"
  ];
  const mrt3 = [
    "North Avenue", "Quezon Avenue", "GMA-Kamuning", "Araneta Center-Cubao",
    "Santolan-Annas", "Ortigas", "Shaw Boulevard", "Boni", "Guadalupe",
    "Buendia", "Ayala", "Magallanes", "Taft Avenue"
  ];

  const matchStop = (stops, term) => {
    const clean = term.toLowerCase().replace(/station/g, '').trim()
    return stops.findIndex(s => s.toLowerCase().includes(clean) || clean.includes(s.toLowerCase()))
  }

  let stopsList = null
  let fromIdx = matchStop(lrt1, departure)
  let toIdx = matchStop(lrt1, arrival)

  if (fromIdx !== -1 && toIdx !== -1) {
    stopsList = lrt1
  } else {
    fromIdx = matchStop(mrt3, departure)
    toIdx = matchStop(mrt3, arrival)
    if (fromIdx !== -1 && toIdx !== -1) {
      stopsList = mrt3
    }
  }

  if (stopsList && fromIdx !== -1 && toIdx !== -1) {
    let sliced = []
    if (fromIdx <= toIdx) {
      sliced = stopsList.slice(fromIdx, toIdx + 1)
    } else {
      sliced = stopsList.slice(toIdx, fromIdx + 1).reverse()
    }

    return sliced.map((stop, i) => ({
      name: stop,
      estMinutes: i * 2
    }))
  }

  return null
}

export default function RouteSelector({ allRoutes, origin, destination, apiKey, nearestStations }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isEnlarged, setIsEnlarged] = useState(false)

  const uniqueRoutes = useMemo(() => {
    if (!allRoutes || !allRoutes.length) return []
    const seen = new Set()
    return allRoutes.filter((route) => {
      // deduplicate strictly by duration, distance, and the first step instruction
      const firstStepInst = route.steps?.[0]?.instruction || ''
      const key = `${route.duration || ''}_${route.distance || ''}_${firstStepInst}`.toLowerCase().replace(/\s+/g, '')
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [allRoutes])

  if (!uniqueRoutes || uniqueRoutes.length === 0) return null

  const activeRoute = uniqueRoutes[activeIdx] || uniqueRoutes[0]

  return (
    <div className="flex flex-col gap-6">
      {/* Header Hero Section with Rich Aesthetics - Now dynamic based on selected route option */}
      <div className="mb-2 rounded-[32px] border border-white/10 bg-slate-900/60 p-6 text-white shadow-2xl backdrop-blur-xl sm:p-10 hover:border-white/20 transition-all duration-300 w-full">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.24em] text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Commute Routing
            </span>
            <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl leading-tight uppercase">
              {origin && destination ? (
                <span className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-emerald-300">
                    {/^-?\d+\.\d+,-?\d+\.\d+$/.test((origin || '').trim()) ? '📍 Current Location' : origin}
                  </span>
                  <span className="text-slate-500">→</span>
                  <span className="text-emerald-100">
                    {/^-?\d+\.\d+,-?\d+\.\d+$/.test((destination || '').trim()) ? '📍 Current Location' : destination}
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

          <div className="flex shrink-0 flex-col items-center justify-center rounded-[24px] border border-white/10 bg-white/5 p-4 text-center backdrop-blur shadow-[0_0_15px_rgba(52,211,153,0.1)] min-w-[200px]">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-black">Estimated duration</p>
            <p className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-white">{activeRoute.duration || 'N/A'}</p>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-[0.1em]">{activeRoute.distance || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
          <span className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300 transition-colors shadow-[0_0_10px_rgba(52,211,153,0.15)]">
            {uniqueRoutes.length} Transit Route Options
          </span>
          <span className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300 transition-colors shadow-[0_0_10px_rgba(52,211,153,0.15)]">
            {activeRoute.steps?.length || 0} Primary Steps
          </span>
          <span className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300 transition-colors shadow-[0_0_10px_rgba(52,211,153,0.15)]">
            Updated May 3, 2026
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 items-start text-slate-100">
        {/* 1. Route List Pane */}
        <div className="lg:col-span-1 flex flex-col gap-3 max-h-[720px] overflow-y-auto pr-1">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 pl-1">
            Transit Route Options
          </p>
          {uniqueRoutes.map((routeOpt, rIndex) => (
            <button
              key={rIndex}
              onClick={() => setActiveIdx(rIndex)}
              className={`flex flex-col gap-2 p-4 rounded-[24px] transition-all duration-300 text-left border hover:-translate-y-1 ${activeIdx === rIndex
                  ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-[0_0_25px_rgba(52,211,153,0.25)] font-black'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300 font-medium'
                }`}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] border ${activeIdx === rIndex ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.3)]' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}>
                  Option {rIndex + 1} {rIndex === 0 && '• Best'}
                </span>
                <span className={`text-sm font-black tracking-tight uppercase ${activeIdx === rIndex ? 'text-white' : 'text-slate-300'}`}>
                  {routeOpt.duration || 'N/A'}
                </span>
              </div>
              <span className="text-base font-black tracking-tight leading-snug line-clamp-1 uppercase">
                {routeOpt.summary || `Route ${rIndex + 1}`}
              </span>
              <div className="flex flex-wrap justify-between items-center gap-1.5 w-full mt-1 border-t border-white/10 pt-2">
                <span className={`text-xs font-bold uppercase tracking-wide ${activeIdx === rIndex ? 'text-emerald-300' : 'text-slate-500'}`}>
                  {routeOpt.distance || 'N/A'}
                </span>
                <span className={`text-xs font-black uppercase tracking-wide ${activeIdx === rIndex ? 'text-emerald-400' : 'text-emerald-500'}`}>
                  {routeOpt.totalFareText || `₱${routeOpt.calculatedRegularFare || 0} reg`}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* 2. Selected Route Detail View */}
        <article className="lg:col-span-2 rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 shadow-2xl backdrop-blur-md transition-all duration-300 max-h-[720px] overflow-y-auto flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.15)]">
                Selected Route Option {activeIdx + 1}
              </span>
              <h2 className="text-xl font-black text-white tracking-tight uppercase mt-1">
                {activeRoute.summary || `Alternative Option ${activeIdx + 1}`}
              </h2>
            </div>
            <div className="rounded-xl bg-slate-900/40 border border-white/10 px-3.5 py-2 text-right font-black text-white shadow-2xl backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400 font-black mb-0.5">Time</p>
              <p className="text-lg font-black text-white leading-none">{activeRoute.duration || 'N/A'}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{activeRoute.distance || 'N/A'}</p>
            </div>
          </div>

          {/* Directly Integrated Live Google Map */}
          {apiKey && origin && destination && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/40 border border-white/10 p-3 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">Live Navigation Map</span>
                  <span className="text-[10px] text-slate-400 font-medium leading-tight">Interactive Google transit route map</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEnlarged(!isEnlarged)}
                  className="inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 text-xs font-black text-slate-300 transition-colors shadow-sm cursor-pointer active:scale-95 uppercase tracking-wider"
                >
                  {isEnlarged ? 'Shrink Map ⤬' : 'Enlarge Map ⤢'}
                </button>
              </div>

              <div className={`rounded-[24px] border border-white/10 bg-slate-950 overflow-hidden shadow-2xl transition-all duration-300 w-full ${isEnlarged ? 'h-[500px] scale-[1.01]' : 'aspect-video min-h-[220px]'}`}>
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=transit`}
                />
              </div>
            </div>
          )}

          {/* Turn-by-turn steps */}
          <div className="grid gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 mb-0.5 pl-1">Step-by-Step Commute Guide</p>
            {activeRoute.steps.map((step, index) => {
              const trainGuide = getTrainIntermediateStations(step.departureStop, step.arrivalStop)

              return (
                <div
                  key={`${step.instruction}-${index}`}
                  className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-3 transition-all duration-200 hover:shadow-xl"
                >
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-black text-slate-100 leading-relaxed">
                      {index + 1}. {step.instruction}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase text-slate-300 shadow-sm">
                        {step.mode}
                      </span>
                      {step.line && (
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase text-emerald-400">
                          {step.line}
                        </span>
                      )}
                      {step.duration && (
                        <span className="rounded-full bg-white/5 border border-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          {step.duration}
                        </span>
                      )}
                    </div>
                    {(step.departureStop || step.arrivalStop) && (
                      <p className="mt-1 text-[10px] font-black text-slate-400 flex items-center gap-1.5 pl-0.5 uppercase tracking-wide">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {step.departureStop || 'Departure'}{' → '}{step.arrivalStop || 'Destination'}
                      </p>
                    )}

                    {/* Detailed Train Station Guided List */}
                    {trainGuide && (
                      <div className="mt-2.5 border-t border-white/10 pt-2.5 flex flex-col gap-1.5">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                          🚞 Stations Breakdown
                        </p>
                        <div className="flex flex-col gap-2 border-l-2 border-emerald-500/40 ml-2.5 pl-3 pt-0.5">
                          {trainGuide.map((station, sIdx) => (
                            <div key={sIdx} className="relative flex items-center gap-2 text-xs font-bold text-slate-300">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-sm absolute -left-[17px]" />
                              <span className="font-black text-white text-[11px]">{station.name}</span>
                              <span className="text-[9px] bg-white/5 border border-white/10 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase">
                                +{station.estMinutes}m
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        {/* 3. Compact Action & Sidebar Context */}
        <aside className="lg:col-span-1 grid gap-5 content-start max-h-[720px] overflow-y-auto pr-1">
          {/* Swapped Fare Section Here - Reduces bloat and puts fees upfront */}
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col gap-3 hover:-translate-y-1 transition duration-300">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                🎫 Fare breakdown
              </span>
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                2026 Rate
              </span>
            </div>

            <div className="grid gap-3">
              {/* Regular Fare Card */}
              <div className="relative rounded-xl bg-white/5 p-3.5 border border-white/10 hover:-translate-y-0.5 transition duration-300">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Regular Commuter
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-3xl font-black tracking-tight text-white">
                    {activeRoute.totalFareText || `₱${activeRoute.calculatedRegularFare || 0}`}
                  </span>
                  <span className="text-[10px] font-black text-slate-500 uppercase">One-way</span>
                </div>
              </div>

              {/* Student Discount Card */}
              <div className="relative rounded-xl bg-white/5 p-3.5 border border-white/10 hover:-translate-y-0.5 transition duration-300">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex justify-between">
                  <span>Student Rate</span>
                  <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-black px-2 py-0.5 rounded-full uppercase">20% Off</span>
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black tracking-tight text-emerald-400">
                    {activeRoute.totalFareText
                      ? `₱${Math.round(parseFloat(activeRoute.totalFareText.replace(/[^\d.]/g, '')) * 0.8 || 0)}`
                      : `₱${activeRoute.calculatedStudentFare || 0}`}
                  </span>
                  <span className="text-[10px] font-black text-emerald-500/60 uppercase">With valid ID</span>
                </div>
              </div>
            </div>
          </div>

          {/* Proximity Stations Fixed Section */}
          {nearestStations && (nearestStations.origin || nearestStations.destination) && (
            <article className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-5 shadow-2xl backdrop-blur-md hover:-translate-y-1 transition duration-300">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">Proximity Stations</p>
              <h3 className="mt-0.5 text-base font-black text-white uppercase tracking-tight">Nearest Points</h3>
              <div className="mt-3 grid gap-3 rounded-xl bg-white/5 p-3.5 border border-white/10">
                {nearestStations.origin && (
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Origin station</p>
                      <p className="text-sm font-black text-white mt-0.5 uppercase tracking-tight">
                        {nearestStations.origin?.name || 'No station found'}
                      </p>
                    </div>
                    {nearestStations.origin?.name && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(nearestStations.origin.name)}&travelmode=walking`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2.5 inline-flex items-center justify-center rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-xs font-black tracking-wide text-emerald-400 transition-all border border-emerald-500/20 active:scale-95 uppercase tracking-wider cursor-pointer"
                      >
                        Walking Guide ↗
                      </a>
                    )}
                  </div>
                )}
                {nearestStations.destination && (
                  <div className="border-t border-white/10 pt-2.5 mt-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Destination station</p>
                      <p className="text-sm font-black text-white mt-0.5 uppercase tracking-tight">
                        {nearestStations.destination?.name || 'No station found'}
                      </p>
                    </div>
                    {nearestStations.destination?.name && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(nearestStations.destination.name)}&destination=${encodeURIComponent(destination)}&travelmode=walking`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2.5 inline-flex items-center justify-center rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-xs font-black tracking-wide text-emerald-400 transition-all border border-emerald-500/20 active:scale-95 uppercase tracking-wider cursor-pointer"
                      >
                        Walking Guide ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          )}
        </aside>
      </div>
    </div>
  )
}
