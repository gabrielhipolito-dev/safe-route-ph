'use client'

import { fareGuide } from '../data/fares';

export default function FaresPage() {
  return (
    <section className="mx-auto max-w-[980px] px-6 py-10">
      <h1 className="mb-2 text-3xl font-bold text-[#0B1F3A]">
        Basic Fare Information
      </h1>
      <p className="mb-6 leading-relaxed text-gray-600">
        These are estimated fares for common transport options around Metro Manila.
        Actual costs may vary by route, distance, time, and operator policy.
      </p>

      <div className="grid gap-4">
        {fareGuide.map((item) => (
          <article
            key={item.ride}
            className="rounded-xl border border-gray-200 bg-white px-[18px] py-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
          >
            <h2 className="mb-2.5 text-[1.15rem] font-semibold text-[#0B1F3A]">
              {item.ride}
            </h2>
            <p className="mb-1.5 text-gray-800">
              Regular Fare: <strong>{item.regular}</strong>
            </p>
            <p className="text-gray-800">
              Student Fare: <strong>{item.student}</strong>
            </p>
          </article>
        ))}
      </div>

      <div className="mt-7 rounded-lg border-l-4 border-blue-700 bg-blue-50 px-4 py-3 text-blue-900">
        Tip: Bring your valid school ID to ask for student discount when available.
      </div>
    </section>
  )
}
