import Link from 'next/link';
import { features } from '../data/features';

const featureLinks = ['/route-result', '/safety', '/last-trip'];

export default function FeatureCards() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Your commute toolkit</h2>
        <p className="mx-auto mb-10 max-w-2xl text-sm leading-6 text-slate-600">
          Each section is built for a specific commute decision, from safer route planning to last-trip checks.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((card, index) => (
            <Link
              key={card.title}
              href={featureLinks[index] ?? '/'}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-200 hover:bg-cyan-50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-white">
                {card.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">{card.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
              <p className="mt-4 text-sm font-semibold text-cyan-700">Explore section →</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
