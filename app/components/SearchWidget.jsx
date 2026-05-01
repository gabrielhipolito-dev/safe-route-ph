'use client'

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { philippineSchools, popularSchools } from '../data/schools';

export default function SearchWidget() {
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activeField, setActiveField] = useState('from');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickPicks = useMemo(() => {
    const routeHints = ['Adamson University', 'UP Diliman', 'UST', 'DLSU Manila'];
    return [...new Set([...routeHints, ...popularSchools])].slice(0, 6);
  }, []);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setError('');
  };

  const handleSearch = () => {
    const cleanFrom = from.trim();
    const cleanTo = to.trim();

    if (!cleanFrom || !cleanTo) {
      setError('Enter both origin and destination to continue.');
      return;
    }

    if (cleanFrom.toLowerCase() === cleanTo.toLowerCase()) {
      setError('Origin and destination must be different.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    router.push(`/route-result?from=${encodeURIComponent(cleanFrom)}&to=${encodeURIComponent(cleanTo)}`);
  };

  const handlePopularClick = (school) => {
    setError('');

    if (activeField === 'from') {
      setFrom(school);
      if (!to) setActiveField('to'); 
    } else {
      setTo(school);
      if (!from) setActiveField('from');
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setError('Fetching current location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coordsString = `${latitude},${longitude}`;
        setFrom(coordsString);
        setError('');
      },
      (err) => {
        setError(err.message || 'Error accessing geolocation.');
      }
    );
  };

  return (
    <div className="w-full">
      <div className="rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Dynamic fare finder
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
              Search school-to-school fares
            </h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            Student verified
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <label className={`rounded-2xl border px-4 py-3 transition flex flex-col justify-between min-h-[82px] ${activeField === 'from' ? 'border-cyan-500 bg-cyan-50 shadow-sm' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex justify-between items-center w-full mb-1">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Origin</span>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-[10px] bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-700 px-2.5 py-0.5 rounded-full border border-cyan-500/20 font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Use my current GPS location"
              >
                📍 Use My Location
              </button>
            </div>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              onFocus={() => setActiveField('from')}
              placeholder="e.g. Adamson University"
              aria-label="Origin school"
              list="philippine-school-list"
              className="w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="flex items-center justify-center">
            <button
              onClick={handleSwap}
              className="flex min-h-11 items-center justify-center gap-1 rounded-full border border-slate-200 bg-white px-3 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700 md:h-11 md:w-11 md:px-0"
              title="Swap origin and destination"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 16 4 4 4-4" />
                <path d="M7 20V4" />
                <path d="m21 8-4-4-4 4" />
                <path d="M17 4v16" />
              </svg>
              <span className="text-xs font-medium md:hidden">Swap</span>
            </button>
          </div>

          <label className={`rounded-2xl border px-4 py-3 transition flex flex-col justify-between min-h-[82px] ${activeField === 'to' ? 'border-cyan-500 bg-cyan-50 shadow-sm' : 'border-slate-200 bg-slate-50'}`}>
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Destination</span>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => setActiveField('to')}
              placeholder="e.g. UP Diliman"
              aria-label="Destination school"
              list="philippine-school-list"
              className="w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <datalist id="philippine-school-list">
          {philippineSchools.map((school) => (
            <option key={school} value={school} />
          ))}
        </datalist>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {quickPicks.map((hint) => (
              <button
                key={hint}
                onClick={() => handlePopularClick(hint)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
              >
                {hint}
              </button>
            ))}
          </div>

          <button
            onClick={handleSearch}
            disabled={isSubmitting}
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Opening route...' : 'Find fare breakdown'}
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Start typing to see PH schools in autocomplete, tap a campus chip, or use the pin button to pull your exact location.
        </p>

        {error && (
          <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
            {error}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">Transfers included</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">Student discount aware</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">2026 fare matrix</span>
        </div>
      </div>
    </div>
  );
}
