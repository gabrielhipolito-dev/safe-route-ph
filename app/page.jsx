import SearchWidget from './components/SearchWidget';
import FeatureCards from './components/FeatureCards';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-24">
        <div className="w-full max-w-2xl text-center">
          
          {/* Friendly Greeting */}
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Where are you going today?
          </h1>
          <p className="mb-8 text-base text-slate-600 sm:text-lg">
            Find the safest and easiest commute route for your campus.
          </p>

          {/* Centered Search Widget */}
          <div className="mx-auto w-full text-left">
            <SearchWidget />
          </div>
          
        </div>
      </main>

      {/* Simplified Features Section */}
      <FeatureCards />
    </div>
  )
}