'use client'

const fareRows = [
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

export default function FaresPage() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 text-slate-100 min-h-screen">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
              Commuter transparency
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl uppercase">
              Fare Board
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Search school-to-school routes and see the full fare flow, including transfer points,
              student discounts, and the latest verified 2026 fare matrix.
            </p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm sm:min-w-[220px]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Last sync
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                ⟳
              </span>
            </div>
            <p className="text-lg font-black text-white">Today, 08:45 AM</p>
            <p className="text-sm text-slate-400 font-medium">Verified by student reports and updated fare references.</p>
          </div>
        </div>

        <div className="mb-5 grid gap-4 rounded-[24px] border border-white/10 bg-slate-900/40 p-4 shadow-xl sm:p-5 lg:grid-cols-[1.35fr_1fr] lg:items-center backdrop-blur-md">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-400 shadow-sm">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search route or destination, e.g. Adamson University to UP Diliman"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 font-bold"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {modeFilters.map((mode, index) => (
              <button
                key={mode}
                className={`rounded-full px-4 py-2 text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                  index === 0
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.35)] active:scale-95'
                    : 'border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/40 shadow-2xl backdrop-blur-md">
          <div className="hidden grid-cols-[1.7fr_1fr_1fr_0.9fr_0.8fr] gap-4 border-b border-white/10 bg-emerald-500/10 px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-emerald-400 md:grid">
            <div>Route Name</div>
            <div>Regular Fare</div>
            <div>Student Fare (20% off)</div>
            <div>Last Updated</div>
            <div>Status</div>
          </div>

          <div className="divide-y divide-white/5">
            {fareRows.map((row, index) => (
              <article
                key={row.route}
                className={`grid gap-4 px-5 py-5 md:grid-cols-[1.7fr_1fr_1fr_0.9fr_0.8fr] md:items-center hover:-translate-y-1 transition duration-300 hover:bg-white/5 ${
                  index === 0 ? 'bg-white/5' : 'bg-transparent'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-black text-white sm:text-lg uppercase tracking-tight">{row.route}</h2>
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.15)]">
                      {row.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">{row.mode}</p>
                  <div className="grid gap-1 rounded-2xl bg-white/5 border border-white/5 px-4 py-3 text-sm text-slate-300">
                    {row.breakdown.map((step) => (
                      <div key={step} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Regular Fare</p>
                  <p className="text-xl font-black text-white">{row.regular}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Student Fare</p>
                  <p className="text-xl font-black text-emerald-400">{row.student}</p>
                  {index === 0 && (
                    <p className="mt-1 text-xs font-medium text-slate-500">Shows the LRT-1, LRT-2, and jeep legs separately</p>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Last Updated</p>
                  <p className="text-sm font-bold text-slate-400">{row.updated}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Status</p>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] border bg-white/5 backdrop-blur-md ${
                    index === 0
                      ? 'border-emerald-500/30 text-emerald-400'
                      : index === 1
                        ? 'border-amber-500/30 text-amber-400'
                        : 'border-slate-500/30 text-slate-400'
                  }`}>
                    {row.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[24px] border border-white/10 bg-slate-900/60 p-5 shadow-2xl backdrop-blur-md hover:-translate-y-1 transition duration-300">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">Student-verified logic</p>
                <h3 className="mt-1 text-xl font-black text-white uppercase tracking-tight">How the route is confirmed</h3>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                2026 fare matrix
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Each result shows transfer legs, student fares, and a verification trail so users can see
              the actual route structure instead of a vague one-line estimate.
            </p>
          </article>

          <article className="rounded-[24px] border border-white/10 bg-emerald-500/10 p-5 text-white shadow-2xl hover:-translate-y-1 transition duration-300 backdrop-blur-md">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">Best for</p>
            <h3 className="mt-1 text-xl font-black uppercase tracking-tight">School-to-school commute planning</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Ideal for trips like Adamson University to UP Diliman where the fare depends on two rides,
              a transfer point, and a student discount on the final campus jeep.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
