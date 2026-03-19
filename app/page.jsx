import SearchWidget from './components/SearchWidget';
import FeatureCards from './components/FeatureCards';
import { appStats } from './data/stats';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <main className="bg-[#0B1F3A] flex flex-col items-center justify-center px-6 py-16 lg:py-24">
        <div className="w-full max-w-2xl text-center">
          
          {/* Friendly Greeting */}
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Where are you going today?
          </h1>
          <p className="mb-10 text-base text-blue-100 sm:text-lg">
            Find the safest and easiest commute route for your campus.
          </p>

          {/* Centered Search Widget */}
          <div className="mx-auto w-full text-left">
            <SearchWidget />
          </div>
          
          {/* Stats Bar */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-medium text-blue-200 sm:gap-x-6">
            {appStats.map((stat, index) => (
              <div key={stat} className="flex items-center gap-4 sm:gap-6">
                <span>{stat}</span>
                {index < appStats.length - 1 && <span className="hidden sm:block">•</span>}
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Simplified Features Section */}
      <FeatureCards />
    </div>
  )
}