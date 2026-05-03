'use client'

import { useState, useMemo, useEffect } from 'react'

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

const getStepDistanceKm = (step) => {
  if (!step || !step.distance) return 1
  const clean = step.distance.toLowerCase().trim()
  if (clean.includes('km')) {
    return parseFloat(clean.replace(/[^\d.]/g, '')) || 1
  }
  if (clean.includes('m')) {
    return (parseFloat(clean.replace(/[^\d.]/g, '')) || 100) / 1000
  }
  return 1
}

const getStepFare = (step) => {
  if (step && step.fare) return step.fare
  if (step && step.fareText) return step.fareText

  if (!step || !step.mode) return '₱0'

  const mode = step.mode.toLowerCase()
  const instruction = (step.instruction || '').toLowerCase()
  const durationText = (step.duration || '').toLowerCase()
  const distanceKm = getStepDistanceKm(step)

  if (mode.includes('walk')) {
    return '₱0 (Free)'
  }

  // Handle multi-hour provincial long haul trips
  const daysMatch = durationText.match(/(\d+)\s*day/i)
  const hoursMatch = durationText.match(/(\d+)\s*hr/i) || durationText.match(/(\d+)\s*hour/i)

  if (daysMatch || hoursMatch) {
    const days = daysMatch ? parseInt(daysMatch[1], 10) : 0
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0
    const totalHours = (days * 24) + hours

    if (mode.includes('bus') || instruction.includes('bus')) {
      return `₱${totalHours * 180 + 150}`
    }
    if (mode.includes('train') || instruction.includes('lrt') || instruction.includes('mrt')) {
      return `₱${totalHours * 120 + 80}`
    }
    return `₱${totalHours * 150}`
  }

  // Official May 2026 LRTA / LTFRB Rates

  // 1. Train Commute
  if (mode.includes('train') || mode.includes('tram') || mode.includes('subway') || instruction.includes('lrt') || instruction.includes('mrt')) {
    const base = 15
    const perKm = 1.21
    const total = base + distanceKm * perKm
    return `₱${Math.ceil(total)}`
  }

  // 2. Bus Commute
  if (mode.includes('bus') || instruction.includes('bus')) {
    const isAircon = instruction.includes('aircon') || instruction.includes('air-conditioned')
    const base = isAircon ? 18 : 15
    const perKm = isAircon ? 2.98 : 2.49
    const minDistance = 5
    const total = base + Math.max(0, distanceKm - minDistance) * perKm
    return `₱${Math.ceil(total)}`
  }

  // 3. Jeepney / Tricycle Commute
  if (mode.includes('jeep') || mode.includes('tricycle') || instruction.includes('jeepney') || instruction.includes('tricycle')) {
    const isModern = mode.includes('modern') || instruction.includes('modern')
    const base = isModern ? 17 : 14
    const perKm = isModern ? 2.40 : 2.00
    const minDistance = 4
    const total = base + Math.max(0, distanceKm - minDistance) * perKm
    return `₱${Math.ceil(total)}`
  }

  return `₱${Math.ceil(14 + Math.max(0, distanceKm - 4) * 2)}`
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
  const lrt2 = [
    "Recto", "Legarda", "Pureza", "V. Mapa", "J. Ruiz", "Gilmore", "Betty Go-Belmonte",
    "Araneta Center-Cubao", "Anonas", "Katipunan", "Santolan", "Marikina-Pasig", "Antipolo"
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
    } else {
      fromIdx = matchStop(lrt2, departure)
      toIdx = matchStop(lrt2, arrival)
      if (fromIdx !== -1 && toIdx !== -1) {
        stopsList = lrt2
      }
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
  const [activeStepIdx, setActiveStepIdx] = useState(0)
  const [isEnlarged, setIsEnlarged] = useState(false)

  const uniqueRoutes = useMemo(() => {
    if (!allRoutes || !allRoutes.length) return []
    const seen = new Set()
    return allRoutes.filter((route) => {
      const firstStepInst = route.steps?.[0]?.instruction || ''
      const key = `${route.duration || ''}_${route.distance || ''}_${firstStepInst}`.toLowerCase().replace(/\s+/g, '')
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [allRoutes])

  const activeRoute = uniqueRoutes[activeIdx] || uniqueRoutes[0]

  useEffect(() => {
    setActiveStepIdx(0)
  }, [activeIdx])

  const iframeSrc = useMemo(() => {
    const keyToUse = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!keyToUse) return ''

    const activeStep = activeRoute?.steps?.[activeStepIdx]
    if (activeStep && activeStep.startLocation && activeStep.endLocation) {
      const sLat = activeStep.startLocation.lat
      const sLng = activeStep.startLocation.lng
      const dLat = activeStep.endLocation.lat
      const dLng = activeStep.endLocation.lng
      const isWalk = (activeStep.mode || '').toLowerCase().includes('walk')
      const m = isWalk ? 'walking' : 'transit'

      if (sLat !== dLat || sLng !== dLng) {
        return `https://www.google.com/maps/embed/v1/directions?key=${keyToUse}&origin=${sLat},${sLng}&destination=${dLat},${dLng}&mode=${m}`
      }
    }

    let currentPos = origin || 'Manila, Philippines'
    let stepOrigin = currentPos
    let stepDest = destination || 'Manila, Philippines'
    let mode = 'transit'

    const steps = activeRoute?.steps || []
    for (let i = 0; i <= activeStepIdx; i++) {
      const step = steps[i]
      if (!step) continue

      const instr = (step.instruction || '').toLowerCase()
      let nextPos = currentPos
      const toMatch = step.instruction.match(/to\s+([^,.\n(]+)/i)

      if (step.arrivalStop) {
        nextPos = step.arrivalStop
      } else if (toMatch && toMatch[1]) {
        nextPos = toMatch[1].trim()
      } else if (step.departureStop) {
        nextPos = step.departureStop
      }

      if (i === activeStepIdx) {
        stepOrigin = currentPos
        const isWalk = (step.mode || '').toLowerCase().includes('walk') || instr.includes('walk')
        mode = isWalk ? 'walking' : 'transit'

        if (step.departureStop && step.arrivalStop) {
          stepOrigin = step.departureStop
          stepDest = step.arrivalStop
        } else {
          stepDest = nextPos
        }
      }
      currentPos = nextPos
    }

    // Safe fallback to prevent same start-and-end markers (world map bug)
    if (stepOrigin === stepDest || !stepOrigin || !stepDest) {
      return `https://www.google.com/maps/embed/v1/directions?key=${keyToUse}&origin=${encodeURIComponent(origin || 'Manila')}&destination=${encodeURIComponent(destination || 'Manila')}&mode=transit&waypoints=${encodeURIComponent(stepDest || 'Manila')}`
    }

    return `https://www.google.com/maps/embed/v1/directions?key=${keyToUse}&origin=${encodeURIComponent(stepOrigin)}&destination=${encodeURIComponent(stepDest)}&mode=${mode}`
  }, [apiKey, origin, destination, activeRoute, activeStepIdx])

  if (!uniqueRoutes || uniqueRoutes.length === 0) return null

  return (
    <div className="flex flex-col gap-6">
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
                    {origin}
                  </span>
                  <span className="text-slate-500">→</span>
                  <span className="text-emerald-100">
                    {destination}
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
      </div>

      <div className="grid gap-6 lg:grid-cols-4 items-start text-slate-100">
        <div className="lg:col-span-1 flex flex-col gap-3 max-h-[720px] overflow-y-auto pr-1">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 pl-1">
            Commute Itineraries
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
                  Option {rIndex + 1}
                </span>
                <span className="text-sm font-black tracking-tight uppercase">
                  {routeOpt.duration || 'N/A'}
                </span>
              </div>
              <span className="text-base font-black tracking-tight leading-snug line-clamp-1 uppercase">
                {routeOpt.summary || `Alternative Option ${rIndex + 1}`}
              </span>
              <div className="flex flex-wrap justify-between items-center gap-1.5 w-full mt-1 border-t border-white/10 pt-2">
                <span className={`text-xs font-bold uppercase tracking-wide ${activeIdx === rIndex ? 'text-emerald-300' : 'text-slate-500'}`}>
                  {routeOpt.distance || 'N/A'}
                </span>
                <span className="text-xs font-black uppercase tracking-wide text-emerald-400">
                  {routeOpt.totalFareText || `₱${routeOpt.calculatedRegularFare || 0} reg`}
                </span>
              </div>
            </button>
          ))}
        </div>

        <article className="lg:col-span-2 rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 shadow-2xl backdrop-blur-md transition-all duration-300 max-h-[720px] overflow-y-auto flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.15)]">
                Option {activeIdx + 1} Detail View
              </span>
              <h2 className="text-xl font-black text-white tracking-tight uppercase mt-1 leading-tight">
                {activeRoute.summary || `Alternative Option ${activeIdx + 1}`}
              </h2>
            </div>

            <div className="rounded-xl bg-slate-900/40 border border-white/10 px-3.5 py-2 text-right font-black text-white shadow-2xl backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400 font-black mb-0.5">Duration</p>
              <p className="text-lg font-black text-white leading-none">{activeRoute.duration || 'N/A'}</p>
            </div>
          </div>

          {apiKey && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/40 border border-white/10 p-3 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">Active Guidance Map</span>
                  <span className="text-[10px] text-slate-400 font-medium leading-tight">Select any step below to preview its specific map directions.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEnlarged(!isEnlarged)}
                  className="inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 text-xs font-black text-slate-300 transition-colors shadow-sm cursor-pointer active:scale-95 uppercase tracking-wider select-none"
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
                  src={iframeSrc}
                />
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 mb-0.5 pl-1">Step-by-Step Commute Guide</p>
            {activeRoute.steps.map((step, index) => {
              const estimatedFare = getStepFare(step)
              const isActiveStep = index === activeStepIdx

              return (
                <button
                  key={`${step.instruction}-${index}`}
                  onClick={() => setActiveStepIdx(index)}
                  className={`rounded-xl border hover:bg-white/10 px-3.5 py-3 transition-all duration-300 hover:shadow-xl text-left cursor-pointer w-full flex flex-col gap-2 ${
                    isActiveStep
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_rgba(52,211,153,0.15)] ring-2 ring-emerald-500/20'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-wrap items-center justify-between gap-2 w-full">
                      <p className={`text-xs font-black leading-relaxed ${isActiveStep ? 'text-emerald-300' : 'text-slate-100'}`}>
                        {index + 1}. {
                          (() => {
                            let text = step.instruction || ''
                            const lower = text.toLowerCase()
                            if (lower.includes('tram towards dr. santos') || lower.includes('tram towards baclaran') || lower.includes('tram towards roosevelt') || lower.includes('tram towards fpj')) {
                              text = text.replace(/tram/i, 'LRT-1 Train')
                            } else if (lower.includes('tram towards recto') || lower.includes('tram towards antipolo')) {
                              text = text.replace(/tram/i, 'LRT-2 Train')
                            } else if (lower.includes('tram towards north avenue') || lower.includes('tram towards taft')) {
                              text = text.replace(/tram/i, 'MRT-3 Train')
                            } else if (lower.includes('tram')) {
                              text = text.replace(/tram/i, 'LRT Train')
                            }
                            return text
                          })()
                        }
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase shrink-0 ${
                        isActiveStep ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400'
                      }`}>
                        💵 Payment: {step.fare || estimatedFare}
                      </span>
                      <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase text-slate-300 shadow-sm">
                        {(step.mode || '').toLowerCase().includes('tram') ? 'LRT Train' : step.mode}
                      </span>
                      {step.duration && (
                        <span className="rounded-full bg-slate-800/80 border border-white/10 px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase text-slate-200 shadow-sm">
                          ⏱ {step.duration}
                        </span>
                      )}
                      {step.distance && (
                        <span className="rounded-full bg-slate-800/80 border border-white/10 px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase text-slate-200 shadow-sm">
                          📏 {step.distance}
                        </span>
                      )}
                    </div>
                    {isActiveStep && !((step.mode || '').toLowerCase().includes('walk') || (step.instruction || '').toLowerCase().includes('walk')) && ((step.mode || '').toLowerCase().includes('train') || (step.mode || '').toLowerCase().includes('mrt') || (step.mode || '').toLowerCase().includes('lrt') || (step.mode || '').toLowerCase().includes('tram') || (step.mode || '').toLowerCase().includes('subway') || (step.instruction || '').toLowerCase().includes('train') || (step.instruction || '').toLowerCase().includes('lrt') || (step.instruction || '').toLowerCase().includes('mrt')) && (
                      <div className="mt-2.5 rounded-xl bg-slate-800/40 p-2.5 border border-white/5 text-[11px] font-medium text-slate-300">
                        {(() => {
                          const lower = (step.instruction || '').toLowerCase()
                          let line = 'LRT-2'
                          let allStops = [
                            'Recto', 'Legarda', 'Pureza', 'V. Mapa', 'J. Ruiz', 'Gilmore',
                            'Betty Go-Belmonte', 'Araneta Center-Cubao', 'Anonas', 'Katipunan',
                            'Santolan', 'Marikina-Pasig', 'Antipolo'
                          ]

                          if (lower.includes('lrt-1') || lower.includes('dr. santos') || lower.includes('baclaran') || lower.includes('roosevelt') || lower.includes('fpj')) {
                            line = 'LRT-1'
                            allStops = [
                              'Baclaran', 'EDSA', 'Libertad', 'Gil Puyat', 'Vito Cruz', 'Quirino',
                              'Pedro Gil', 'UN Avenue', 'Central Terminal', 'Carriedo',
                              'Doroteo Jose', 'Bambang', 'Tayuman', 'Blumentritt', 'Abad Santos',
                              'R. Papa', '5th Avenue', 'Monumento', 'Balintawak', 'Roosevelt (FPJ)',
                              'Redemptorist', 'MIA', 'Asia World', 'Ninoy Aquino', 'Dr. Santos'
                            ]
                          } else if (lower.includes('mrt-3') || lower.includes('north avenue') || lower.includes('taft')) {
                            line = 'MRT-3'
                            allStops = [
                              'North Avenue', 'Quezon Avenue', 'Kamuning', 'Araneta Center-Cubao',
                              'Santolan-Anand', 'Ortigas', 'Shaw Boulevard', 'Boni', 'Guadalupe',
                              'Buendia', 'Ayala', 'Magallanes', 'Taft Avenue'
                            ]
                          }

                          let stations = []
                          const fromIdx = step.departureStop ? allStops.findIndex(s => s.toLowerCase().includes(step.departureStop.toLowerCase()) || step.departureStop.toLowerCase().includes(s.toLowerCase())) : -1
                          const toIdx = step.arrivalStop ? allStops.findIndex(s => s.toLowerCase().includes(step.arrivalStop.toLowerCase()) || step.arrivalStop.toLowerCase().includes(s.toLowerCase())) : -1

                          if (fromIdx !== -1 && toIdx !== -1) {
                            const start = Math.min(fromIdx, toIdx)
                            const end = Math.max(fromIdx, toIdx)
                            stations = allStops.slice(start, end + 1)
                          } else {
                            stations = allStops.slice(0, 5)
                          }

                          return (
                            <>
                              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-300 mb-1">
                                🚆 {line} Station Stops:
                              </p>
                              <ul className="grid gap-1 pl-3.5 list-disc text-slate-300 font-bold text-xs mt-1">
                                {stations.map((st, sIdx) => (
                                  <li key={sIdx}>{st}</li>
                                ))}
                              </ul>
                            </>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </article>

        <aside className="lg:col-span-1 grid gap-5 content-start max-h-[720px] overflow-y-auto pr-1">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col gap-3 hover:-translate-y-1 transition duration-300">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                🎫 Fare Breakdown
              </span>
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                May 2026 Rate
              </span>
            </div>

            <div className="grid gap-3">
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
