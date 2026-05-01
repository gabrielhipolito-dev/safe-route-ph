import SearchWidget from './components/SearchWidget';
import FeatureCards from './components/FeatureCards';
import { appStats } from './data/stats';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <main className="relative overflow-hidden bg-[#0B1F3A] px-4 pb-14 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pb-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_62%)]" />
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Student commute dashboard
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Where are you going today?
            </h1>
            <p className="mt-3 text-base text-blue-100 sm:text-lg">
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
                className="rounded-full border border-white/20 bg-white/8 px-3.5 py-2 text-sm font-medium text-blue-100 backdrop-blur"
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
