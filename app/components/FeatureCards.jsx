// This is a Server Component, meaning it can fetch directly from a database later without shipping extra JS to the client.
export default function FeatureCards() {
  
  // TODO: Later, you can fetch these features or platform metrics from your database
  const features = [
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 11-5.5-5.5a2 2 0 1 0-2.8 2.8L12 10.6V21"/><path d="M5 21v-3.5"/><path d="M5 13.5V5"/><path d="M12 3h.01"/><path d="M5 21h14"/></svg>, 
      title: 'Granular Transit Data', 
      desc: 'Highly detailed itineraries covering jeepneys, tricycles, UV Express, and major rail lines strictly within student perimeters.',
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>, 
      title: 'Verified Safety Metrics', 
      desc: 'Aggregated, crowd-sourced safety indices filtering metrics by time-of-day and specific street segments.',
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, 
      title: 'Real-Time Dispatch', 
      desc: 'Live terminal departure logs to prevent stranding during late-night classes or extreme weather events.',
    },
  ];

  return (
    <section className="border-t border-slate-100 bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Platform Features</h2>
          <p className="mt-4 text-lg text-slate-600">Enterprise-grade tracking and reporting tools designed specifically for the Philippine student community.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((card, idx) => (
            <div key={card.title} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
                {card.icon}
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">{card.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
