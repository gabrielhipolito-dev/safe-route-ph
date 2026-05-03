'use client'

import { useState, useEffect, useMemo } from 'react'

const initialFareRows = [
  {
    route: 'Adamson University → UP Diliman',
    mode: 'LRT-1 → LRT-2 → jeep route',
    regular: '₱25.50–₱55.00',
    student: '₱22.50–₱49.50',
    updated: 'Apr 30, 2026',
    status: 'Student verified',
    breakdown: [
      'Adamson → closest LRT-1 access point: ₱13–20',
      'LRT-1 to Recto, transfer to LRT-2, then Katipunan: rail fare matrix',
      'Katipunan → UP Diliman campus jeep: ₱6.50–15',
    ],
  },
  {
    route: 'UST → SM Manila',
    mode: 'Jeepney + walk',
    regular: '₱13.00',
    student: '₱10.50',
    updated: 'Apr 28, 2026',
    status: 'Recently changed',
    breakdown: ['Direct jeepney fare: ₱13.00', 'Student discounted fare: ₱10.50'],
  },
  {
    route: 'DLSU → Lawton Terminal',
    mode: 'Jeepney / bus transfer',
    regular: '₱15.00–₱25.00',
    student: '₱12.00–₱20.00',
    updated: 'Apr 26, 2026',
    status: 'Stable',
    breakdown: ['Main leg fare: ₱15.00–₱25.00', 'Discounted range based on operator'],
  },
]

const modeFilters = ['All Modes', 'Jeepney', 'Bus', 'LRT/MRT', 'Multi-leg']

export default function CustomRoutePage() {
  const [customRoutes, setCustomRoutes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All Modes')

  const [newRoute, setNewRoute] = useState('')
  const [newMode, setNewMode] = useState('Multi-leg')
  const [newRegular, setNewRegular] = useState('')
  const [newStudent, setNewStudent] = useState('')
  
  const [itinerarySteps, setItinerarySteps] = useState([
    { description: '', fare: '', mode: 'Jeepney' }
  ])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('custom_commute_itineraries')
      if (stored) {
        setCustomRoutes(JSON.parse(stored))
      }
    } catch (err) {
      console.error('Failed to load local storage:', err)
    }
  }, [])

  const saveCustomRoutes = (routes) => {
    try {
      localStorage.setItem('custom_commute_itineraries', JSON.stringify(routes))
    } catch (err) {
      console.error('Failed to persist to local storage:', err)
    }
  }

  const handleAddItineraryStep = () => {
    setItinerarySteps([
      ...itinerarySteps,
      { description: '', fare: '', mode: 'Jeepney' }
    ])
  }

  const handleRemoveItineraryStep = (idx) => {
    setItinerarySteps(itinerarySteps.filter((_, i) => i !== idx))
  }

  const updateItineraryStep = (idx, field, value) => {
    const updated = itinerarySteps.map((step, i) => {
      if (i === idx) return { ...step, [field]: value }
      return step
    })
    setItinerarySteps(updated)
  }

  const handleCreateRoute = (e) => {
    e.preventDefault()
    if (!newRoute || !newRegular || !newStudent) return

    const parsedBreakdown = itinerarySteps
      .filter(s => s.description.trim() !== '')
      .map(s => `${s.description} (${s.mode}) → ${s.fare || 'Free'}`)

    const created = {
      route: newRoute,
      mode: newMode,
      regular: newRegular.startsWith('₱') ? newRegular : `₱${newRegular}`,
      student: newStudent.startsWith('₱') ? newStudent : `₱${newStudent}`,
      updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Student Added',
      breakdown: parsedBreakdown.length > 0 ? parsedBreakdown : ['Direct transport fare'],
    }

    const nextCustom = [created, ...customRoutes]
    setCustomRoutes(nextCustom)
    saveCustomRoutes(nextCustom)

    setNewRoute('')
    setNewRegular('')
    setNewStudent('')
    setNewMode('Multi-leg')
    setItinerarySteps([{ description: '', fare: '', mode: 'Jeepney' }])
  }

  const handleDeleteCustomRoute = (routeTitle) => {
    const nextCustom = customRoutes.filter(r => r.route !== routeTitle)
    setCustomRoutes(nextCustom)
    saveCustomRoutes(nextCustom)
  }

  const allFareRows = useMemo(() => {
    return [...customRoutes, ...initialFareRows]
  }, [customRoutes])

  const filteredFareRows = useMemo(() => {
    return allFareRows.filter((row) => {
      const matchSearch = row.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.mode.toLowerCase().includes(searchQuery.toLowerCase())
      const matchFilter = activeFilter === 'All Modes' || row.mode.toLowerCase().includes(activeFilter.toLowerCase())
      return matchSearch && matchFilter
    })
  }, [allFareRows, searchQuery, activeFilter])

  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 text-slate-100 min-h-screen">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl flex flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:flex-row lg:items-end lg:justify-between hover:border-white/20 transition-all duration-300">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.24em] text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Custom Routing Network
            </span>
            <h1 className="text-3xl mt-4 font-black tracking-tight text-white sm:text-4xl uppercase">
              Custom Route Planner
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base font-medium">
              Create, customize, and store custom school-to-school transit routes. Tailored with exactly the modes and fares you use.
            </p>
          </div>

          <div className="grid gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4 shadow-sm sm:min-w-[220px]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Itineraries
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                ★
              </span>
            </div>
            <p className="text-lg font-black text-white">{filteredFareRows.length} Active Routes</p>
            <p className="text-sm text-slate-400 font-medium leading-tight">Stored locally on your device for fast access.</p>
          </div>
        </div>

        <div className="grid gap-4 rounded-[24px] border border-white/10 bg-slate-900/40 p-4 shadow-xl sm:p-5 lg:grid-cols-[1.35fr_1fr] lg:items-center backdrop-blur-md">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-400 shadow-sm focus-within:border-emerald-500/50 transition">
            <span className="text-lg select-none">⌕</span>
            <input
              type="text"
              placeholder="Search custom routes e.g. Adamson University, UST, UP Diliman"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 font-bold"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {modeFilters.map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveFilter(mode)}
                className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  activeFilter === mode
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.35)] active:scale-95'
                    : 'border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/40 shadow-2xl backdrop-blur-md flex flex-col">
            <div className="hidden grid-cols-[1.8fr_1fr_1fr_1fr] gap-4 border-b border-white/10 bg-emerald-500/10 px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-emerald-400 md:grid">
              <div>Route Name</div>
              <div>Regular</div>
              <div>Student Fare</div>
              <div>Manage / Source</div>
            </div>

            <div className="divide-y divide-white/5 max-h-[760px] overflow-y-auto">
              {filteredFareRows.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-sm font-bold uppercase tracking-wider">No matching transit route found</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Use the form to the right to add your custom student itinerary.</p>
                </div>
              ) : (
                filteredFareRows.map((row, index) => (
                  <article
                    key={row.route}
                    className="grid gap-4 px-5 py-5 md:grid-cols-[1.8fr_1fr_1fr_1fr] md:items-center hover:bg-white/5 transition-all duration-200"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-black text-white sm:text-lg uppercase tracking-tight leading-tight">
                          {row.route}
                        </h2>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] shadow-sm ${
                          row.status === 'Student Added'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        }`}>
                          {row.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">
                        {row.mode}
                      </p>
                      <div className="grid gap-1 rounded-2xl bg-white/5 border border-white/5 px-4 py-3 text-sm text-slate-300 font-medium">
                        {row.breakdown.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2 text-xs">
                            <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden font-black mb-0.5">Regular</p>
                      <p className="text-xl font-black text-white">{row.regular}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden font-black mb-0.5">Student Rate</p>
                      <p className="text-xl font-black text-emerald-400">{row.student}</p>
                      <p className="mt-1 text-[10px] font-medium text-slate-500 uppercase tracking-wide">With Valid Student ID</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-start">
                      {row.status === 'Student Added' ? (
                        <button
                          onClick={() => handleDeleteCustomRoute(row.route)}
                          className="rounded-xl bg-red-500/15 border border-red-500/25 hover:bg-red-500/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-300 transition cursor-pointer select-none"
                        >
                          Delete ✖
                        </button>
                      ) : (
                        <span className="rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          Verified
                        </span>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <aside className="rounded-[32px] border border-white/10 bg-slate-900/60 p-5 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col gap-4 hover:border-white/20 transition duration-300">
            <div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                Itinerary Builder
              </span>
              <h3 className="text-lg font-black text-white mt-1.5 uppercase tracking-tight">
                Add Custom Route
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5 leading-relaxed">
                Add your own routes, transfer points, and individual transport modes to construct the ultimate commute itinerary.
              </p>
            </div>

            <form onSubmit={handleCreateRoute} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 pl-1">
                  Route Name / Label
                </span>
                <input
                  type="text"
                  placeholder="e.g., UP Manila to FEU Tech"
                  required
                  value={newRoute}
                  onChange={(e) => setNewRoute(e.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white font-bold outline-none placeholder:text-slate-600 focus:border-emerald-500/50 transition-all"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 pl-1">
                    Regular Fare
                  </span>
                  <input
                    type="text"
                    placeholder="e.g., 45.00"
                    required
                    value={newRegular}
                    onChange={(e) => setNewRegular(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white font-bold outline-none placeholder:text-slate-600 focus:border-emerald-500/50 transition-all"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 pl-1">
                    Student Fare
                  </span>
                  <input
                    type="text"
                    placeholder="e.g., 36.00"
                    required
                    value={newStudent}
                    onChange={(e) => setNewStudent(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white font-bold outline-none placeholder:text-slate-600 focus:border-emerald-500/50 transition-all"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 pl-1">
                  Transportation Mode
                </span>
                <select
                  value={newMode}
                  onChange={(e) => setNewMode(e.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-900/80 px-3.5 py-2 text-sm text-white font-bold outline-none cursor-pointer focus:border-emerald-500/50 transition-all"
                >
                  <option value="Multi-leg">Multi-leg Transfer</option>
                  <option value="Jeepney">Jeepney</option>
                  <option value="Bus">Bus</option>
                  <option value="LRT/MRT">LRT/MRT Train</option>
                </select>
              </label>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400 pl-1">
                    Step-by-step itinerary
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItineraryStep}
                    className="text-[10px] font-black uppercase tracking-wider text-emerald-300 hover:text-emerald-400 select-none cursor-pointer"
                  >
                    + Add Step
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 max-h-[180px] overflow-y-auto pr-1">
                  {itinerarySteps.map((step, sIdx) => (
                    <div key={sIdx} className="grid grid-cols-1 gap-2 rounded-xl border border-white/5 bg-white/5 p-3 relative hover:border-white/10 transition">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wide">Step {sIdx + 1}</span>
                        {itinerarySteps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItineraryStep(sIdx)}
                            className="text-[10px] font-bold text-red-400 hover:text-red-500 tracking-wider select-none cursor-pointer"
                          >
                            ✖ Remove
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="e.g., Take jeep to Recto Station"
                        required
                        value={step.description}
                        onChange={(e) => updateItineraryStep(sIdx, 'description', e.target.value)}
                        className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/40 transition"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="e.g., ₱14"
                          value={step.fare}
                          onChange={(e) => updateItineraryStep(sIdx, 'fare', e.target.value)}
                          className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/40 transition"
                        />
                        <select
                          value={step.mode}
                          onChange={(e) => updateItineraryStep(sIdx, 'mode', e.target.value)}
                          className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-emerald-500/40 transition"
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
                Submit Custom Route
              </button>
            </form>
          </aside>
        </div>
      </div>
    </section>
  )
}
