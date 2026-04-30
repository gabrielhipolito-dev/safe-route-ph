'use client'

import { useState } from 'react';
import { popularSchools } from '../data/schools';

export default function SearchWidget() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activeField, setActiveField] = useState('from');
  const routeHints = ['Adamson University', 'UP Diliman', 'UST', 'DLSU Manila'];

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    // TODO: Later, connect this to the database to find the actual route between 'from' and 'to'
    console.log('Searching for route from', from, 'to', to);
  };

  const handlePopularClick = (school) => {
    if (activeField === 'from') {
      setFrom(school);
      if (!to) setActiveField('to'); // Switch focus field visually/logically
    } else {
      setTo(school);
      if (!from) setActiveField('from');
    }
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

        <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <label className={`rounded-2xl border px-4 py-3 transition ${activeField === 'from' ? 'border-cyan-500 bg-cyan-50 shadow-sm' : 'border-slate-200 bg-slate-50'}`}>
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Origin</span>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              onFocus={() => setActiveField('from')}
              placeholder="e.g. Adamson University"
              className="w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="flex items-center justify-center">
            <button
              onClick={handleSwap}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700"
              title="Swap locations"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 16 4 4 4-4" />
                <path d="M7 20V4" />
                <path d="m21 8-4-4-4 4" />
                <path d="M17 4v16" />
              </svg>
            </button>
          </div>

          <label className={`rounded-2xl border px-4 py-3 transition ${activeField === 'to' ? 'border-cyan-500 bg-cyan-50 shadow-sm' : 'border-slate-200 bg-slate-50'}`}>
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Destination</span>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => setActiveField('to')}
              placeholder="e.g. UP Diliman"
              className="w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {routeHints.map((hint) => (
              <button
                key={hint}
                onClick={() => handlePopularClick(hint)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
              >
                {hint}
              </button>
            ))}
          </div>

          <button
            onClick={handleSearch}
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
          >
            Find fare breakdown
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">Transfers included</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">Student discount aware</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">2026 fare matrix</span>
        </div>
      </div>

      <div className="mt-5 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Quick school routes</p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularSchools.map((school) => (
            <button
              key={school}
              onClick={() => handlePopularClick(school)}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
            >
              {school}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
