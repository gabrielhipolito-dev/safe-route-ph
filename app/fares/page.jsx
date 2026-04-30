'use client'

const fareRows = [
  {
    route: 'Adamson University → UP Diliman',
    mode: 'Multi-leg student route',
    regular: '₱41.50–₱66.50',
    student: '₱35.50–₱60.50',
    updated: 'Apr 30, 2026',
    status: 'Student verified',
    breakdown: ['Adamson → Philcoa: ₱35–60', 'Philcoa → UP Campus jeep: ₱6.50'],
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
    <section className="relative overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
              Commuter transparency
            </p>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Fare Board
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Search school-to-school routes and see the full fare flow, including transfer points,
              student discounts, and the latest verified 2026 fare matrix.
            </p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:min-w-[220px]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                Last sync
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                ⟳
              </span>
            </div>
            <p className="text-lg font-semibold text-slate-950">Today, 08:45 AM</p>
            <p className="text-sm text-slate-500">Verified by student reports and updated fare references.</p>
          </div>
        </div>

        <div className="mb-5 grid gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-5 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 shadow-sm">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search route or destination, e.g. Adamson University to UP Diliman"
              className="w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {modeFilters.map((mode, index) => (
              <button
                key={mode}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  index === 0
                    ? 'bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)]'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="hidden grid-cols-[1.7fr_1fr_1fr_0.9fr_0.8fr] gap-4 border-b border-slate-200 bg-cyan-700 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white md:grid">
            <div>Route Name</div>
            <div>Regular Fare</div>
            <div>Student Fare (20% off)</div>
            <div>Last Updated</div>
            <div>Status</div>
          </div>

          <div className="divide-y divide-slate-200">
            {fareRows.map((row, index) => (
              <article
                key={row.route}
                className={`grid gap-4 px-5 py-5 md:grid-cols-[1.7fr_1fr_1fr_0.9fr_0.8fr] md:items-center ${
                  index === 0 ? 'bg-slate-50/70' : 'bg-white'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-slate-950 sm:text-lg">{row.route}</h2>
                    <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-800">
                      {row.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{row.mode}</p>
                  <div className="grid gap-1 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    {row.breakdown.map((step) => (
                      <div key={step} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-500" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Regular Fare</p>
                  <p className="text-lg font-semibold text-slate-950">{row.regular}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Student Fare</p>
                  <p className="text-lg font-semibold text-cyan-700">{row.student}</p>
                  {index === 0 && (
                    <p className="mt-1 text-xs font-medium text-slate-500">Includes the Adamson → Philcoa + Philcoa → UP split</p>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Last Updated</p>
                  <p className="text-sm font-medium text-slate-600">{row.updated}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 md:hidden">Status</p>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                    index === 0
                      ? 'bg-emerald-100 text-emerald-700'
                      : index === 1
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}>
                    {row.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Student-verified logic</p>
                <h3 className="mt-1 text-xl font-bold text-slate-950">How the route is confirmed</h3>
              </div>
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                2026 fare matrix
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Each result can show transfer legs, student fares, and a verification trail so users can see
              whether the trip was confirmed by other students, updated fares, or a recently changed operator price.
            </p>
          </article>

          <article className="rounded-[24px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Best for</p>
            <h3 className="mt-1 text-xl font-bold">School-to-school commute planning</h3>
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
