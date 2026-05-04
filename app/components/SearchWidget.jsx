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
      <div className="rounded-[24px] sm:rounded-[28px] border border-white/10 bg-slate-900/60 p-3 sm:p-5 shadow-2xl backdrop-blur-md hover:border-white/15 transition duration-300">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.22em] text-emerald-400">
              Dynamic fare finder
            </p>
            <h2 className="mt-0.5 text-lg font-black text-white sm:text-2xl uppercase tracking-tight">
              Search school-to-school fares
            </h2>
          </div>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
            Student verified
          </span>
        </div>

        <div className="grid gap-2 sm:gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <label className={`rounded-xl sm:rounded-2xl border px-3 py-2 sm:px-4 sm:py-3 transition flex flex-col justify-between min-h-[72px] sm:min-h-[82px] hover:-translate-y-0.5 duration-200 ${activeField === 'from' ? 'border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.15)]' : 'border-white/10 bg-white/5'}`}>
            <span className="block text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 mb-0.5">Origin</span>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              onFocus={() => setActiveField('from')}
              placeholder="e.g. Adamson University"
              aria-label="Origin school"
              list="philippine-school-list"
              className="w-full bg-transparent text-xs sm:text-sm text-white outline-none placeholder:text-slate-500 font-bold"
            />
          </label>

          <div className="flex items-center justify-center">
            <button
              onClick={handleSwap}
              className="flex min-h-9 items-center justify-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 text-slate-300 shadow-sm transition hover:-translate-y-1 hover:border-emerald-400/40 hover:text-emerald-400 hover:shadow-[0_0_12px_rgba(52,211,153,0.25)] md:h-11 md:w-11 md:px-0 active:scale-95"
              title="Swap origin and destination"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 16 4 4 4-4" />
                <path d="M7 20V4" />
                <path d="m21 8-4-4-4 4" />
                <path d="M17 4v16" />
              </svg>
              <span className="text-xs font-black uppercase md:hidden">Swap</span>
            </button>
          </div>

          <label className={`rounded-xl sm:rounded-2xl border px-3 py-2 sm:px-4 sm:py-3 transition flex flex-col justify-between min-h-[72px] sm:min-h-[82px] hover:-translate-y-0.5 duration-200 ${activeField === 'to' ? 'border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.15)]' : 'border-white/10 bg-white/5'}`}>
            <span className="mb-0.5 block text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Destination</span>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => setActiveField('to')}
              placeholder="e.g. UP Diliman"
              aria-label="Destination school"
              list="philippine-school-list"
              className="w-full bg-transparent text-xs sm:text-sm text-white outline-none placeholder:text-slate-500 font-bold"
            />
          </label>
        </div>

        <datalist id="philippine-school-list">
          {philippineSchools.map((school) => (
            <option key={school} value={school} />
          ))}
        </datalist>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.16em] text-slate-500 mr-0.5">Quick Picks:</span>
            {quickPicks.map((hint) => (
              <button
                key={hint}
                onClick={() => handlePopularClick(hint)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-black text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-emerald-300 active:scale-95"
              >
                {hint}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="text-[10px] sm:text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-emerald-500/20 font-black transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider active:scale-95 shadow-[0_0_10px_rgba(52,211,153,0.15)] hover:border-emerald-400/40 hover:-translate-y-0.5"
            title="Use my current GPS location"
          >
            📍 Pin My Current Location
          </button>
        </div>

        <p className="mt-3 text-[10px] sm:text-xs text-slate-400 font-medium">
          Start typing to see PH schools in autocomplete, tap a campus chip, or use the pin button to pull your exact location.
        </p>

        {error && (
          <p className="mt-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs sm:text-sm font-bold text-rose-300 uppercase tracking-wide">
            {error}
          </p>
        )}

        <div className="mt-3.5 flex flex-wrap sm:flex-nowrap items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs text-slate-300">
            <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 font-black uppercase tracking-wider">Transfers included</span>
            <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 font-black uppercase tracking-wider">Student discount aware</span>
            <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 font-black uppercase tracking-wider">2026 fare matrix</span>
          </div>

          <button
            onClick={handleSearch}
            disabled={isSubmitting}
            className="rounded-xl sm:rounded-2xl bg-emerald-500 px-5 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-black text-slate-950 transition hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 uppercase tracking-wider shadow-[0_0_15px_rgba(52,211,153,0.35)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] hover:-translate-y-0.5 whitespace-nowrap min-w-[160px] text-center flex items-center justify-center cursor-pointer"
          >
            {isSubmitting ? 'Opening route...' : 'Find fare breakdown'}
          </button>
        </div>
      </div>
    </div>
  );
}
