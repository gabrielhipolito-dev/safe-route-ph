'use client'

const FIRST_TIMER_TIPS = [
  {
    id: 'flag-jeepney',
    icon: '✋',
    title: 'How to Flag a Jeepney',
    description:
      'Stand near the curb and raise your hand slightly. Make eye contact with the driver. If there is space they will slow down.',
  },
  {
    id: 'boundary-meaning',
    icon: '💲',
    title: 'What is a Boundary',
    description:
      'Some drivers ask Hanggang saan meaning How far. Just say your destination clearly.',
  },
  {
    id: 'pay-fare',
    icon: '💵',
    title: 'How to Pay the Fare',
    description:
      'Pass your fare to the driver through other passengers. Say bayad po when passing money.',
  },
  {
    id: 'say-para-po',
    icon: '🛑',
    title: 'How to say Para Po',
    description:
      'When you are near your stop say Para po clearly so the driver hears you and stops.',
  },
  {
    id: 'wrong-vehicle',
    icon: '⚠️',
    title: 'Wrong Vehicle',
    description:
      'Stay calm. Ride until the next safe well lit stop. Get off and find the correct jeepney.',
  },
  {
    id: 'night-safety',
    icon: '🌙',
    title: 'Night Safety',
    description:
      'Commute in groups when possible. Sit near other passengers. Avoid isolated waiting areas after 9PM.',
  },
]

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