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
  const [isEnlarged, setIsEnlarged] = useState(false)
  const [mapMode, setMapMode] = useState('transit')

  // Manage custom-created routes state
  const [customAddedRoutes, setCustomAddedRoutes] = useState([])
  const [routeLikes, setRouteLikes] = useState({})
  const [showForm, setShowForm] = useState(false)

  // Builder Form state
  const [newRouteName, setNewRouteName] = useState('')
  const [newDuration, setNewDuration] = useState('')
  const [newDistance, setNewDistance] = useState('')
  const [customSteps, setCustomSteps] = useState([
    { instruction: '', mode: 'Jeepney', duration: '', distance: '', fare: '', commuterType: 'Student' }
  ])

  // Load custom routes and likes from localStorage
  useEffect(() => {
    try {
      const storedRoutes = localStorage.getItem('custom_added_commute_routes')
      if (storedRoutes) {
        setCustomAddedRoutes(JSON.parse(storedRoutes))
      }
      const storedLikes = localStorage.getItem('custom_route_upvotes')
      if (storedLikes) {
        setRouteLikes(JSON.parse(storedLikes))
      }
    } catch (err) {
      console.error('Failed to load locally saved state:', err)
    }
  }, [])

  const uniqueRoutes = useMemo(() => {
    const raw = [...customAddedRoutes, ...(allRoutes || [])]
    const seen = new Set()
    return raw.filter((route) => {
      const firstStepInst = route.steps?.[0]?.instruction || ''
      const key = `${route.duration || ''}_${route.distance || ''}_${firstStepInst}`.toLowerCase().replace(/\s+/g, '')
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [allRoutes, customAddedRoutes])

  const activeRoute = uniqueRoutes[activeIdx] || uniqueRoutes[0]

  const iframeSrc = useMemo(() => {
    const keyToUse = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!keyToUse) return ''

    let orig = origin || ''
    let dest = destination || ''

    if ((!orig || !dest) && activeRoute?.summary) {
      const parts = activeRoute.summary.split(/→|to/i)
      if (parts.length >= 2) {
        orig = parts[0].trim()
        dest = parts[1].trim()
      } else {
        orig = 'Manila, Philippines'
        dest = activeRoute.summary
      }
    }

    if (!orig || !dest) {
      orig = 'Manila, Philippines'
      dest = 'University of Santo Tomas, Manila'
    }

    let waypoint = ''
    if (activeRoute && activeRoute.steps && activeRoute.steps.length > 0) {
      const transitStep = activeRoute.steps.find(
        s => (s.mode || '').toLowerCase().includes('transit') || (s.mode || '').toLowerCase().includes('train') || s.departureStop
      )
      if (transitStep && transitStep.departureStop) {
        waypoint = transitStep.departureStop
      }
    }

    let src = `https://www.google.com/maps/embed/v1/directions?key=${keyToUse}&origin=${encodeURIComponent(orig)}&destination=${encodeURIComponent(dest)}&mode=${mapMode}`
    if (waypoint && mapMode === 'transit') {
      src += `&waypoints=${encodeURIComponent(waypoint)}`
    }
    return src
  }, [apiKey, origin, destination, activeRoute, mapMode])

  const handleAddStepInput = () => {
    setCustomSteps([
      ...customSteps,
      { instruction: '', mode: 'Jeepney', duration: '', distance: '', fare: '', commuterType: 'Student' }
    ])
  }

  const handleRemoveStepInput = (idx) => {
    setCustomSteps(customSteps.filter((_, i) => i !== idx))
  }

  const updateStepInput = (idx, field, value) => {
    const nextSteps = customSteps.map((s, i) => {
      if (i === idx) return { ...s, [field]: value }
      return s
    })
    setCustomSteps(nextSteps)
  }

  const handleCreateRoute = (e) => {
    e.preventDefault()
    if (!newRouteName || !newDuration) return

    let totalReg = 0
    let totalStud = 0

    const parsedSteps = customSteps
      .filter(s => s.instruction.trim() !== '')
      .map(s => {
        const fareVal = parseFloat((s.fare || '').replace(/[^\d.]/g, '')) || 0
        let stepReg = fareVal
        let stepStud = fareVal

        if (s.commuterType === 'Student') {
          stepStud = fareVal
          stepReg = Math.ceil(fareVal / 0.8)
        } else {
          stepReg = fareVal
          stepStud = Math.ceil(fareVal * 0.8)
        }

        totalReg += stepReg
        totalStud += stepStud

        return {
          instruction: s.instruction,
          mode: s.mode,
          duration: s.duration || 'N/A',
          distance: s.distance || 'N/A',
          commuterType: s.commuterType || 'Student',
          fare: `₱${stepReg}`
        }
      })

    const nextCustom = {
      summary: newRouteName,
      duration: newDuration,
      distance: newDistance || 'N/A',
      steps: parsedSteps,
      calculatedRegularFare: totalReg,
      calculatedStudentFare: totalStud,
      isCustom: true
    }

    const updated = [nextCustom, ...customAddedRoutes]
    setCustomAddedRoutes(updated)
    try {
      localStorage.setItem('custom_added_commute_routes', JSON.stringify(updated))
    } catch (err) {
      console.error(err)
    }

    setNewRouteName('')
    setNewDuration('')
    setNewDistance('')
    setCustomSteps([{ instruction: '', mode: 'Jeepney', duration: '', distance: '', fare: '', commuterType: 'Student' }])
    setActiveIdx(0)
    setShowForm(false)
  }

  const handleLikeRoute = (rTitle) => {
    const nextLikes = { ...routeLikes, [rTitle]: (routeLikes[rTitle] || 0) + 1 }
    setRouteLikes(nextLikes)
    try {
      localStorage.setItem('custom_route_upvotes', JSON.stringify(nextLikes))
    } catch (err) {
      console.error(err)
    }
  }

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
            {uniqueRoutes.length} Transit Options Available
          </span>
          <span className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300 transition-colors shadow-[0_0_10px_rgba(52,211,153,0.15)]">
            May 4, 2026 Reference
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 items-start text-slate-100">
        {/* 1. Route List Pane */}
        <div className="lg:col-span-1 flex flex-col gap-3 max-h-[720px] overflow-y-auto pr-1">
          <div className="flex justify-between items-center px-1">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 pl-1">
              Commute Itineraries
            </p>
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-[10px] font-black uppercase tracking-wider text-emerald-300 hover:text-emerald-400 select-none cursor-pointer flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl transition hover:bg-white/10 active:scale-95"
            >
              {showForm ? 'View Active Route' : '+ Add Custom Route'}
            </button>
          </div>

          {uniqueRoutes.map((routeOpt, rIndex) => (
            <button
              key={rIndex}
              onClick={() => {
                setActiveIdx(rIndex)
                setShowForm(false)
              }}
              className={`flex flex-col gap-2 p-4 rounded-[24px] transition-all duration-300 text-left border hover:-translate-y-1 ${activeIdx === rIndex && !showForm
                  ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-[0_0_25px_rgba(52,211,153,0.25)] font-black'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300 font-medium'
                }`}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] border ${activeIdx === rIndex && !showForm ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.3)]' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}>
                  Option {rIndex + 1} {routeOpt.isCustom && '• Student Custom'}
                </span>
                <span className={`text-sm font-black tracking-tight uppercase ${activeIdx === rIndex && !showForm ? 'text-white' : 'text-slate-300'}`}>
                  {routeOpt.duration || 'N/A'}
                </span>
              </div>
              <span className="text-base font-black tracking-tight leading-snug line-clamp-1 uppercase">
                {routeOpt.summary || `Alternative Option ${rIndex + 1}`}
              </span>
              <div className="flex flex-wrap justify-between items-center gap-1.5 w-full mt-1 border-t border-white/10 pt-2">
                <span className={`text-xs font-bold uppercase tracking-wide ${activeIdx === rIndex && !showForm ? 'text-emerald-300' : 'text-slate-500'}`}>
                  {routeOpt.distance || 'N/A'}
                </span>
                <span className={`text-xs font-black uppercase tracking-wide ${activeIdx === rIndex && !showForm ? 'text-emerald-400' : 'text-emerald-500'}`}>
                  {routeOpt.totalFareText || `₱${routeOpt.calculatedRegularFare || 0} reg`}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* 2. Form vs Viewing Container */}
        {showForm ? (
          <aside className="lg:col-span-2 rounded-[32px] border border-white/20 bg-slate-900/70 p-5 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col gap-4 hover:border-white/30 transition duration-300 max-h-[720px] overflow-y-auto">
            <div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                Custom Route Builder
              </span>
              <h3 className="text-lg font-black text-white mt-1.5 uppercase tracking-tight">
                Add Custom Transit Option
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5 leading-relaxed">
                Add your custom itineraries here! Total Regular and Student fares will be automatically calculated based on step fares.
              </p>
            </div>

            <form onSubmit={handleCreateRoute} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 pl-1">
                  Route Name / Summary
                </span>
                <input
                  type="text"
                  placeholder="e.g., LRT1 to Jeep Transfer to FEU"
                  required
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white font-bold outline-none placeholder:text-slate-600 focus:border-emerald-500/50 transition-all"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 pl-1">
                    Duration
                  </span>
                  <input
                    type="text"
                    placeholder="e.g., 25 mins"
                    required
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white font-bold outline-none placeholder:text-slate-600 focus:border-emerald-500/50 transition-all"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 pl-1">
                    Total Distance (optional)
                  </span>
                  <input
                    type="text"
                    placeholder="e.g., 2.5 km"
                    value={newDistance}
                    onChange={(e) => setNewDistance(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white font-bold outline-none placeholder:text-slate-600 focus:border-emerald-500/50 transition-all"
                  />
                </label>
              </div>

              {/* Dynamic Steps Inputs inside Builder Form */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400 pl-1">
                    Itinerary Steps Details
                  </span>
                  <button
                    type="button"
                    onClick={handleAddStepInput}
                    className="text-[10px] font-black uppercase tracking-wider text-emerald-300 hover:text-emerald-400 select-none cursor-pointer"
                  >
                    + Add Step
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {customSteps.map((step, sIdx) => (
                    <div key={sIdx} className="grid gap-2.5 rounded-xl border border-white/5 bg-white/5 p-3.5 hover:border-white/10 transition">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wide">Step {sIdx + 1}</span>
                        {customSteps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStepInput(sIdx)}
                            className="text-[10px] font-bold text-red-400 hover:text-red-500 tracking-wider select-none cursor-pointer"
                          >
                            ✖ Remove
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="e.g., Ride jeepney towards Quiapo"
                        required
                        value={step.instruction}
                        onChange={(e) => updateStepInput(sIdx, 'instruction', e.target.value)}
                        className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/40 transition"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Fare (₱) e.g., 14"
                          value={step.fare}
                          onChange={(e) => updateStepInput(sIdx, 'fare', e.target.value)}
                          className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/40 transition"
                        />
                        <select
                          value={step.commuterType}
                          onChange={(e) => updateStepInput(sIdx, 'commuterType', e.target.value)}
                          className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-emerald-500/40 transition font-bold"
                        >
                          <option value="Student">Student Rate</option>
                          <option value="Regular">Regular Rate</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="e.g., 3.1 km"
                          value={step.distance}
                          onChange={(e) => updateStepInput(sIdx, 'distance', e.target.value)}
                          className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/40 transition"
                        />
                        <select
                          value={step.mode}
                          onChange={(e) => updateStepInput(sIdx, 'mode', e.target.value)}
                          className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-emerald-500/40 transition font-bold"
                        >
                          <option value="Jeepney">Jeepney</option>
                          <option value="Bus">Bus</option>
                          <option value="LRT/MRT">LRT/MRT</option>
                          <option value="Walking">Walking</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 p-3 text-sm font-black uppercase tracking-wider text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.35)] transition-all active:scale-95 cursor-pointer select-none"
              >
                Submit Route Itinerary
              </button>
            </form>
          </aside>
        ) : (
          /* Route Detail Viewer */
          <article className="lg:col-span-2 rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 shadow-2xl backdrop-blur-md transition-all duration-300 max-h-[720px] overflow-y-auto flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.15)]">
                    Option {activeIdx + 1} Detail View
                  </span>
                  {activeRoute.isCustom && (
                    <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300 animate-pulse">
                      ★ Custom Itinerary
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black text-white tracking-tight uppercase mt-1 leading-tight">
                  {activeRoute.summary || `Alternative Option ${activeIdx + 1}`}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleLikeRoute(activeRoute.summary || `Option ${activeIdx + 1}`)}
                  className="rounded-xl bg-emerald-500/15 border border-emerald-500/25 hover:bg-emerald-500/30 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-emerald-300 transition-colors cursor-pointer active:scale-95 flex items-center gap-2 select-none"
                >
                  ▲ Like ({routeLikes[activeRoute.summary || `Option ${activeIdx + 1}`] || 0})
                </button>
                <div className="rounded-xl bg-slate-900/40 border border-white/10 px-3.5 py-2 text-right font-black text-white shadow-2xl backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400 font-black mb-0.5">Duration</p>
                  <p className="text-lg font-black text-white leading-none">{activeRoute.duration || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Live Visual Map Frame */}
            {apiKey && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/40 border border-white/10 p-3 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">Live Navigation Map</span>
                    <span className="text-[10px] text-slate-400 font-medium leading-tight">Accurate step-by-step route view</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                      {['transit', 'walking', 'driving'].map((m) => (
                        <button
                          key={m}
                          onClick={() => setMapMode(m)}
                          className={`px-3 py-1 text-xs font-black rounded-lg uppercase tracking-wider transition duration-200 cursor-pointer ${mapMode === m ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEnlarged(!isEnlarged)}
                      className="inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 text-xs font-black text-slate-300 transition-colors shadow-sm cursor-pointer active:scale-95 uppercase tracking-wider select-none"
                    >
                      {isEnlarged ? 'Shrink Map ⤬' : 'Enlarge Map ⤢'}
                    </button>
                  </div>
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

            {/* Turn-by-turn steps breakdown */}
            <div className="grid gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 mb-0.5 pl-1">Step-by-Step Commute Guide</p>
              {activeRoute.steps.map((step, index) => {
                const trainGuide = getTrainIntermediateStations(step.departureStop, step.arrivalStop)
                const estimatedFare = getStepFare(step)

                return (
                  <div
                    key={`${step.instruction}-${index}`}
                    className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-3 transition-all duration-200 hover:shadow-xl"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-black text-slate-100 leading-relaxed">
                          {index + 1}. {step.instruction}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase text-emerald-400 shrink-0">
                          💵 Payment: {step.fare || estimatedFare}
                        </span>
                        {step.commuterType && (
                          <span className="rounded-full bg-amber-500/15 border border-amber-500/25 px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase text-amber-400 shrink-0">
                            👤 {step.commuterType}
                          </span>
                        )}
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

                      {/* Station breakdown details */}
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
        )}

        {/* 3. Actions / Compact Sidebar Section */}
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
