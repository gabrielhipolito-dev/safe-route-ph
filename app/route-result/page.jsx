'use client'

const routeLegs = [
  {
    label: 'Leg 1',
    title: 'Adamson University → LRT-1 station',
    mode: 'Jeep / short ride to the rail line',
    fare: '₱13–20',
    note: 'Start with the closest LRT-1 access point used by the chosen route.',
  },
  {
    label: 'Leg 2',
    title: 'LRT-1 → Recto transfer to LRT-2',
    mode: 'Rail transfer',
    fare: 'Rail fare matrix',
    note: 'Use the current LRT fare schedule for the line-to-line ride.',
  },
  {
    label: 'Leg 3',
    title: 'LRT-2 Katipunan → UP Diliman',
    mode: 'Jeep / campus shuttle',
    fare: '₱6.50–15',
    note: 'This is the final student-friendly campus connection.',
  },
]

export default function RouteResult() {
  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">Fare breakdown</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Adamson University → UP Diliman
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            A student-verified route guide that shows the full rail-transfer path, the transfer point,
            and the 2026 fare matrix by leg.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
              Student verified
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
              2 legs
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
              Updated Apr 30, 2026
            </span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">How to get there</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">Route steps</h2>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Estimated total</p>
                  <p className="text-2xl font-black text-slate-950">₱25.50–55.00*</p>
              </div>
            </div>

            <div className="grid gap-4">
              {routeLegs.map((leg, index) => (
                <article key={leg.label} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
                          {index + 1}
                        </span>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{leg.label}</p>
                      </div>
                      <h3 className="text-lg font-bold text-slate-950">{leg.title}</h3>
                      <p className="text-sm text-slate-500">{leg.mode}</p>
                      <p className="max-w-xl text-sm leading-6 text-slate-600">{leg.note}</p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 text-left shadow-sm sm:min-w-[150px] sm:text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Fare</p>
                      <p className="text-xl font-black text-slate-950">{leg.fare}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="grid gap-4">
            <article className="rounded-[28px] border border-cyan-200 bg-cyan-50 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Verification</p>
              <h3 className="mt-1 text-xl font-bold text-slate-950">Student-verified fare matrix</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                The route is broken into exact legs so the user sees the rail transfer separately from
                the final jeep connection. The total stays transparent because each leg is shown on its own.
              </p>
              <div className="mt-4 grid gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">Last confirmed</span>
                  <span className="font-semibold text-slate-950">Today, 08:45 AM</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">Student confirmations</span>
                  <span className="font-semibold text-slate-950">24 reports</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">Fare matrix</span>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    2026
                  </span>
                </div>
              </div>
            </article>

            <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Why this works</p>
              <h3 className="mt-1 text-xl font-bold text-slate-950">Smooth UX cues</h3>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
                <li>• Clear origin and destination in the header.</li>
                <li>• Step-by-step fare breakdown instead of one flat number.</li>
                <li>• Verification metadata to support trust.</li>
              </ul>
            </article>
          </aside>
        </div>
      </div>
    </section>
  )
}