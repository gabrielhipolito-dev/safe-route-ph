'use client'

import { FIRST_TIMER_TIPS } from '../data/firstTimerTips';

export default function FirstTimerGuide() {
  return (
    <div>
      <section className="bg-[#0B1F3A] px-6 py-16 text-center text-white">
        <h1 className="mb-4 text-4xl font-extrabold sm:text-5xl">
          New to commuting in Manila? We got you.
        </h1>
        <p className="mx-auto max-w-[600px] text-[1.1rem] leading-relaxed">
          Your fellow students share everything you need to know about navigating Manila public transport
        </p>
      </section>

      <section className="bg-slate-100 px-6 py-12">
        <div className="mx-auto grid max-w-[900px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {FIRST_TIMER_TIPS.map((tip) => (
            <div
              key={tip.id}
              className="rounded-[14px] border border-[#E6ECF4] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
            >
              <div className="mb-3 text-3xl">{tip.icon}</div>
              <h3 className="mb-2 text-[1.1rem] font-semibold text-[#0B1F3A]">{tip.title}</h3>
              <p className="text-[0.95rem] leading-relaxed text-gray-600">{tip.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}