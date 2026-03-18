'use client'

export default function Home() {
  return (
    <div>
      <section className="bg-[#0B1F3A] px-6 py-20 text-center text-white">
        <h1 className="mb-4 text-4xl font-extrabold sm:text-5xl">
          Find Your Safest Way Home
        </h1>
        <p className="mb-8 text-lg sm:text-xl">
          Student-verified commute routes, safety ratings, and real-time updates
        </p>
        <div className="mx-auto flex w-full max-w-4xl flex-col items-stretch gap-4 rounded-2xl bg-white p-6 sm:flex-row sm:items-center">
          <input
            placeholder="From (your school)"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-3 text-base text-slate-800 outline-none transition focus:border-blue-600"
          />
          <input
            placeholder="To (your destination)"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-3 text-base text-slate-800 outline-none transition focus:border-blue-600"
          />
          <button className="rounded-lg bg-blue-700 px-6 py-3 text-base font-bold text-white transition hover:bg-blue-800">
            Search Routes
          </button>
        </div>
      </section>

      <section className="flex flex-wrap justify-center gap-6 px-6 py-16">
        {[
          { icon: '📍', title: 'Route Finder', desc: 'Step-by-step jeepney and UV Express guides' },
          { icon: '🛡️', title: 'Safety Ratings', desc: 'Day and night safety scores from students' },
          { icon: '⏰', title: 'Last Trip Tracker', desc: 'Community-reported last departure times' },
        ].map(card => (
          <div
            key={card.title}
            className="w-[280px] rounded-2xl border border-[#E6ECF4] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          >
            <div className="mb-3 text-3xl">{card.icon}</div>
            <h3 className="mb-2 text-lg font-semibold text-[#0B1F3A]">{card.title}</h3>
            <p className="text-[0.95rem] text-gray-600">{card.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}