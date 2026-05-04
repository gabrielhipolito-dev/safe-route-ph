'use client'

import { FIRST_TIMER_TIPS } from '../data/firstTimerTips';

export default function FirstTimerGuide() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 pb-16">
      <section className="relative overflow-hidden bg-slate-900/60 border-b border-white/10 px-6 py-16 text-center text-white backdrop-blur-xl max-w-5xl mx-auto rounded-b-[24px] shadow-2xl mb-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_60%)]" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.24em] text-emerald-400 border border-emerald-500/30 mb-4 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
          🔰 Student Handbook
        </span>
        <h1 className="mb-4 text-3xl font-black sm:text-5xl uppercase tracking-tight">
          New to commuting in Manila? We got you.
        </h1>
        <p className="mx-auto max-w-[600px] text-sm text-slate-300 font-medium leading-relaxed">
          Your fellow students share everything you need to know about navigating Manila public transport.
        </p>
      </section>

      <section className="px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {FIRST_TIMER_TIPS.map((tip) => (
            <div
              key={tip.id}
              className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-2xl hover:border-white/20 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition duration-300 flex flex-col gap-3"
            >
              <div className="text-4xl">{tip.icon}</div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">{tip.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400 font-medium">{tip.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}