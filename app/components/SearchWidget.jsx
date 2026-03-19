'use client'

import { useState } from 'react';
import { popularSchools } from '../data/schools';

export default function SearchWidget() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activeField, setActiveField] = useState('from');

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
      {/* Simple Search Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

          {/* From Input */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-bold uppercase text-slate-500 text-left">Origin</label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              onFocus={() => setActiveField('from')}
              placeholder="e.g. UP Diliman"
              className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center sm:block sm:pt-5">
            <button
              onClick={handleSwap}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              title="Swap locations"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform hover:rotate-180"><path d="m3 16 4 4 4-4" /><path d="M7 20V4" /><path d="m21 8-4-4-4 4" /><path d="M17 4v16" /></svg>
            </button>
          </div>

          {/* To Input */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-bold uppercase text-slate-500 text-left">Destination</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => setActiveField('to')}
              placeholder="e.g. LRT Katipunan"
              className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="mt-4">
          <button onClick={handleSearch} className="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-base font-bold text-white transition hover:bg-blue-700 active:scale-[0.98]">
            Search safe route
          </button>
        </div>
      </div>

      {/* Popular Schools Quick Select */}
      <div className="mt-6 text-center">
        <p className="mb-3 text-xs font-medium text-slate-500">Or pick a popular campus:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularSchools.map(school => (
            <button
              key={school}
              onClick={() => handlePopularClick(school)}
              className="rounded-full bg-white border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              {school}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
