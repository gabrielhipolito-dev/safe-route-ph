import Link from 'next/link';
import { features } from '../data/features';

const featureLinks = ['/route-result', '/safety', '/last-trip'];

export default function FeatureCards() {
  return (
    <section className="bg-slate-950 py-14 sm:py-16 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="mb-2 text-2xl font-black text-white uppercase tracking-tight">Your commute toolkit</h2>
        <p className="mx-auto mb-10 max-w-2xl text-sm leading-6 text-slate-400 font-medium">
          Each section is built for a specific commute decision, from safer route planning to last-trip checks.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((card, index) => (
            <Link
              key={card.title}
              href={featureLinks[index] ?? '/'}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] active:scale-95 flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black shadow-[0_0_12px_rgba(52,211,153,0.25)]">
                  {card.icon}
                </div>
                <h3 className="mb-2 text-lg font-black text-white uppercase tracking-tight">{card.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">{card.desc}</p>
              </div>
              <p className="mt-4 text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1 group-hover:text-emerald-300">
                Explore section <span className="transition-transform group-hover:translate-x-1 duration-200">→</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
