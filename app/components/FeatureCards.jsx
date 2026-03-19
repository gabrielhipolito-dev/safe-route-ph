import { features } from '../data/features';

export default function FeatureCards() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="mb-10 text-2xl font-bold text-slate-900">Why use SafeRoute?</h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((card, idx) => (
            <div key={card.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm transition-transform hover:-translate-y-1">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                {card.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">{card.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
