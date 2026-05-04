import SearchWidget from './components/SearchWidget';
import FeatureCards from './components/FeatureCards';
import { appStats } from './data/stats';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <main className="relative overflow-hidden px-4 pb-14 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pb-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_60%)]" />
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
              Student commute dashboard
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl uppercase">
              Where are you going today?
            </h1>
            <p className="mt-3 text-base text-slate-300 sm:text-lg">
              Search school-to-school routes with transfer-aware fares and student-verified pricing.
            </p>
          </div>

          <div className="mx-auto w-full max-w-3xl text-left">
            <SearchWidget />
          </div>

          <div className="mx-auto mt-6 flex w-full max-w-3xl flex-wrap justify-center gap-2 sm:gap-3">
            {appStats.map((stat) => (
              <span
                key={stat}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-emerald-300 backdrop-blur-md uppercase tracking-wider shadow-[0_0_12px_rgba(52,211,153,0.1)] hover:border-emerald-400/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                {stat}
              </span>
            ))}
          </div>
        </div>
      </main>

      <FeatureCards />
    </div>
  )
}
