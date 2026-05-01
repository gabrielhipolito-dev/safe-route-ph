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
    <div className="grid gap-6 lg:grid-cols-3 items-start">
      {/* Route List Pane (Google Maps & Moovit style) */}
      <div className="lg:col-span-1 flex flex-col gap-3 max-h-[700px] overflow-y-auto pr-1">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400 pl-1">
          Transit Route Options
        </p>
        {allRoutes.map((routeOpt, rIndex) => (
          <button
            key={rIndex}
            onClick={() => setActiveIdx(rIndex)}
            className={`flex flex-col gap-2 p-4 rounded-[24px] transition-all duration-300 text-left border ${activeIdx === rIndex
                ? 'bg-slate-900 border-slate-800 text-white shadow-[0_16px_36px_rgba(15,23,42,0.14)] font-bold scale-[1.01]'
                : 'bg-white border-slate-200/60 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800 font-medium'
              }`}
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] ${activeIdx === rIndex ? 'bg-cyan-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                }`}>
                Option {rIndex + 1} {rIndex === 0 && '• Best'}
              </span>
              <span className={`text-sm font-black tracking-tight ${activeIdx === rIndex ? 'text-white' : 'text-slate-950'}`}>
                {routeOpt.duration || 'N/A'}
              </span>
            </div>
            <span className="text-base font-black tracking-tight leading-snug line-clamp-1">
              {routeOpt.summary || `Route ${rIndex + 1}`}
            </span>
            <div className="flex flex-wrap justify-between items-center gap-1.5 w-full mt-1 border-t border-slate-100/10 pt-2">
              <span className={`text-xs font-medium ${activeIdx === rIndex ? 'text-cyan-200' : 'text-slate-500'}`}>
                {routeOpt.distance || 'N/A'}
              </span>
              <span className={`text-xs font-bold ${activeIdx === rIndex ? 'text-cyan-300' : 'text-cyan-700'}`}>
                {routeOpt.totalFareText || `₱${routeOpt.calculatedRegularFare || 0} reg`}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Route Detail View (Google Maps & Moovit style steps) */}
      <article className="lg:col-span-2 rounded-[32px] border border-cyan-200/80 bg-white p-5 sm:p-7 shadow-[0_24px_50px_rgba(15,23,42,0.08)] transition-all duration-300 max-h-[700px] overflow-y-auto flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <span className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] bg-cyan-100 text-cyan-800">
              Selected Route Option {activeIdx + 1}
            </span>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">
              {activeRoute.summary || `Alternative Option ${activeIdx + 1}`}
            </h2>
          </div>
          <div className="rounded-2xl bg-slate-50 border border-slate-100/80 px-4 py-2.5 text-right font-bold text-slate-900 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400 font-bold mb-0.5">Estimated Time</p>
            <p className="text-lg font-black text-slate-950">{activeRoute.duration || 'N/A'}</p>
            <p className="text-xs font-medium text-slate-500 tracking-wide mb-1">{activeRoute.distance || 'N/A'}</p>
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-cyan-600 bg-cyan-50/60 border border-cyan-100/50 rounded-lg px-2 py-1 text-center">
              Arrival: {formatArrivalTime(activeRoute.duration)}
            </p>
          </div>
        </div>

        {/* Estimated Fare Breakdown Details */}
        <div className="rounded-2xl border border-cyan-100/80 bg-cyan-50/40 p-4 sm:p-5 shadow-sm backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-800 mb-3">
            Estimated Trip Fare
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-3.5 border border-slate-100 hover:shadow-sm transition-all duration-200">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Regular commuter fare</p>
              <p className="text-2xl font-extrabold text-slate-950 mt-1 tracking-tight">
                {activeRoute.totalFareText || `₱${activeRoute.calculatedRegularFare || 0}`}
              </p>
              <p className="mt-1 text-xs text-slate-500 font-medium">Standard LTFRB pricing</p>
            </div>
            <div className="rounded-xl bg-white p-3.5 border border-slate-100 hover:shadow-sm transition-all duration-200">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-600">Student fare (20% discount)</p>
              <p className="text-2xl font-extrabold text-cyan-700 mt-1 tracking-tight">
                {activeRoute.totalFareText
                  ? `₱${Math.round(parseFloat(activeRoute.totalFareText.replace(/[^\d.]/g, '')) * 0.8 || 0)}`
                  : `₱${activeRoute.calculatedStudentFare || 0}`}
              </p>
              <p className="mt-1 text-xs text-slate-500 font-medium">Verified student rate</p>
            </div>
          </div>
        </div>

        {/* Directly Integrated Live Google Map with Enlarge Option */}
        {apiKey && origin && destination && (
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Live Navigation Map</span>
                <span className="text-[11px] text-slate-500 font-medium">Shows exactly how to commute on the transit route</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEnlarged(!isEnlarged)}
                className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition-colors shadow-sm cursor-pointer hover:border-cyan-300"
              >
                {isEnlarged ? 'Shrink Map ⤬' : 'Enlarge Map ⤢'}
              </button>
            </div>

            <div className={`rounded-[24px] border border-cyan-100/70 bg-slate-50 overflow-hidden shadow-sm transition-all duration-300 w-full ${isEnlarged ? 'h-[620px] scale-[1.01]' : 'aspect-video min-h-[320px]'}`}>
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
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-400 mb-1 pl-1">Step-by-Step Commute Guide</p>
          {activeRoute.steps.map((step, index) => {
            const trainGuide = getTrainIntermediateStations(step.departureStop, step.arrivalStop)

            return (
              <div
                key={`${step.instruction}-${index}`}
                className="rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 px-4 py-3.5 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-slate-950 leading-relaxed">
                    {index + 1}. {step.instruction}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase text-slate-600 shadow-sm">
                      {step.mode}
                    </span>
                    {step.line && (
                      <span className="rounded-full bg-cyan-100/60 border border-cyan-100 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase text-cyan-700">
                        {step.line}
                      </span>
                    )}
                    {step.duration && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                        {step.duration}
                      </span>
                    )}
                    {step.distance && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                        {step.distance}
                      </span>
                    )}
                  </div>
                  {(step.departureStop || step.arrivalStop) && (
                    <p className="mt-1.5 text-xs font-semibold text-slate-400 flex items-center gap-1.5 pl-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      {step.departureStop || 'Departure'}{' → '}{step.arrivalStop || 'Destination'}
                    </p>
                  )}

                  {/* Detailed Train Station Guided List */}
                  {trainGuide && (
                    <div className="mt-3.5 border-t border-slate-100 pt-3 flex flex-col gap-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">
                        🚞 Intermediate Stations Breakdown
                      </p>
                      <div className="flex flex-col gap-2.5 border-l-2 border-cyan-300/40 ml-2.5 pl-3 pt-1">
                        {trainGuide.map((station, sIdx) => (
                          <div key={sIdx} className="relative flex items-center gap-2 text-xs font-medium text-slate-700">
                            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 border-2 border-white shadow-sm absolute -left-[18px]" />
                            <span className="font-bold text-slate-900">{station.name}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">
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
