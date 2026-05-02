'use client'

import { useState } from 'react'

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

export default function RouteSelector({ allRoutes, origin, destination, apiKey }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isEnlarged, setIsEnlarged] = useState(false)

  if (!allRoutes || allRoutes.length === 0) return null

  const activeRoute = allRoutes[activeIdx] || allRoutes[0]

  return (
    <div className="grid gap-6 lg:grid-cols-3 items-start text-slate-100">
      {/* Route List Pane */}
      <div className="lg:col-span-1 flex flex-col gap-3 max-h-[700px] overflow-y-auto pr-1">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 pl-1">
          Transit Route Options
        </p>
        {allRoutes.map((routeOpt, rIndex) => (
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

      {/* Selected Route Detail View */}
      <article className="lg:col-span-2 rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-7 shadow-2xl backdrop-blur-md transition-all duration-300 max-h-[700px] overflow-y-auto flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1.5">
            <span className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.15)]">
              Selected Route Option {activeIdx + 1}
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
              {activeRoute.summary || `Alternative Option ${activeIdx + 1}`}
            </h2>
          </div>
          <div className="rounded-2xl bg-slate-900/40 border border-white/10 px-4 py-2.5 text-right font-black text-white shadow-2xl backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400 font-black mb-0.5">Estimated Time</p>
            <p className="text-xl font-black text-white">{activeRoute.duration || 'N/A'}</p>
            <p className="text-xs font-bold text-slate-400 tracking-wide mb-1 uppercase tracking-wider">{activeRoute.distance || 'N/A'}</p>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-1 text-center">
              Arrival: {formatArrivalTime(activeRoute.duration)}
            </p>
          </div>
        </div>

        {/* Estimated Fare Breakdown Details */}
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col gap-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider">
                🎫 Commuter Fare Board
              </span>
              <h3 className="text-xs font-black text-slate-400 mt-1 uppercase tracking-wider">
                Live computation for Option {activeIdx + 1}
              </h3>
            </div>
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.15)]">
              Student-Verified 2026
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Regular Fare Card */}
            <div className="relative rounded-2xl bg-white/5 p-5 border border-white/10 shadow-xl hover:-translate-y-1 transition duration-300">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Regular Commuter Fare
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black tracking-tight text-white">
                  {activeRoute.totalFareText || `₱${activeRoute.calculatedRegularFare || 0}`}
                </span>
                <span className="text-xs font-black text-slate-500 uppercase">One-way</span>
              </div>
              <p className="mt-2 text-xs text-slate-500 font-bold uppercase tracking-wider">Standard LTFRB fare matrix applied.</p>
            </div>

            {/* Student Discount Card */}
            <div className="relative rounded-2xl bg-white/5 p-5 border border-white/10 shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex justify-between">
                <span>Student Discount Rate</span>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-black px-2 py-0.5 rounded-full uppercase">20% Off</span>
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black tracking-tight text-emerald-400">
                  {activeRoute.totalFareText
                    ? `₱${Math.round(parseFloat(activeRoute.totalFareText.replace(/[^\d.]/g, '')) * 0.8 || 0)}`
                    : `₱${activeRoute.calculatedStudentFare || 0}`}
                </span>
                <span className="text-xs font-black text-emerald-500/60 uppercase">With Valid ID</span>
              </div>
              <p className="mt-2 text-xs text-emerald-600/70 font-bold uppercase tracking-wider">Valid for active Filipino students only.</p>
            </div>
          </div>
        </div>

        {/* Directly Integrated Live Google Map */}
        {apiKey && origin && destination && (
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/40 border border-white/10 p-3.5 rounded-2xl">
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">Live Navigation Map</span>
                <span className="text-[11px] text-slate-400 font-medium">Shows exactly how to commute on the transit route</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEnlarged(!isEnlarged)}
                className="inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-3.5 py-1.5 text-xs font-black text-slate-300 transition-colors shadow-sm cursor-pointer active:scale-95 uppercase tracking-wider"
              >
                {isEnlarged ? 'Shrink Map ⤬' : 'Enlarge Map ⤢'}
              </button>
            </div>

            <div className={`rounded-[24px] border border-white/10 bg-slate-950 overflow-hidden shadow-2xl transition-all duration-300 w-full ${isEnlarged ? 'h-[620px] scale-[1.01]' : 'aspect-video min-h-[320px]'}`}>
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
        <div className="grid gap-2.5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400 mb-1 pl-1">Step-by-Step Commute Guide</p>
          {activeRoute.steps.map((step, index) => {
            const trainGuide = getTrainIntermediateStations(step.departureStop, step.arrivalStop)

            return (
              <div
                key={`${step.instruction}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3.5 transition-all duration-200 hover:shadow-xl"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-black text-slate-100 leading-relaxed">
                    {index + 1}. {step.instruction}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] font-black tracking-wider uppercase text-slate-300 shadow-sm">
                      {step.mode}
                    </span>
                    {step.line && (
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-black tracking-wider uppercase text-emerald-400">
                        {step.line}
                      </span>
                    )}
                    {step.duration && (
                      <span className="rounded-full bg-white/5 border border-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        {step.duration}
                      </span>
                    )}
                    {step.distance && (
                      <span className="rounded-full bg-white/5 border border-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        {step.distance}
                      </span>
                    )}
                  </div>
                  {(step.departureStop || step.arrivalStop) && (
                    <p className="mt-1.5 text-xs font-black text-slate-400 flex items-center gap-1.5 pl-0.5 uppercase tracking-wide">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {step.departureStop || 'Departure'}{' → '}{step.arrivalStop || 'Destination'}
                    </p>
                  )}

                  {/* Detailed Train Station Guided List */}
                  {trainGuide && (
                    <div className="mt-3.5 border-t border-white/10 pt-3 flex flex-col gap-2">
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-400">
                        🚞 Intermediate Stations Breakdown
                      </p>
                      <div className="flex flex-col gap-2.5 border-l-2 border-emerald-500/40 ml-2.5 pl-3 pt-1">
                        {trainGuide.map((station, sIdx) => (
                          <div key={sIdx} className="relative flex items-center gap-2 text-xs font-bold text-slate-300">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-sm absolute -left-[18px]" />
                            <span className="font-black text-white">{station.name}</span>
                            <span className="text-[10px] bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded font-black uppercase">
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
    </div>
  )
}
