import SearchWidget from './components/SearchWidget';
import FeatureCards from './components/FeatureCards';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <main className="mx-auto max-w-7xl px-6 py-12 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12 items-center">
          
          {/* Left Column: Copy & Search */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Covering 50+ Philippine Universities
            </div>
            
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-[4rem] lg:leading-[1.1]">
              Your student commute, simplified.
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-slate-600 sm:text-xl">
              The industry standard for verified student transit routes, safety analytics, and real-time community updates across Metro Manila and beyond.
            </p>

            <SearchWidget />
          </div>

          {/* Right Column: Hero Graphic / Placeholder Map */}
          <div className="relative hidden w-full rounded-[2rem] bg-slate-50 lg:block lg:min-h-[640px] border border-slate-100 overflow-hidden shadow-sm">
             <div className="absolute inset-0 flex items-center justify-center">
                {/* Abstract map representation */}
                <div className="h-full w-full opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#0f172a 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
                <div className="absolute flex flex-col items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-2xl ring-1 ring-slate-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 15.007 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div className="rounded-xl bg-slate-900/90 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md">Interactive Commute Map</div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Enterprise Features Section */}
      <FeatureCards />
    </div>
  )
}