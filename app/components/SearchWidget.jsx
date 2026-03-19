'use client'

import { useState } from 'react';

export default function SearchWidget() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    // TODO: Later, connect this to the database to find the actual route between 'from' and 'to'
    console.log('Searching for route from', from, 'to', to);
  };

  // TODO: Later, fetch this list from your database of registered campuses
  const popularSchools = [
    "UP Diliman", "DLSU Manila", "UST", "Ateneo", "PUP Sta. Mesa", "FEU Manila"
  ];

  return (
    <div>
      {/* Industry Standard Search Box */}
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
        <div className="relative flex flex-col gap-2 rounded-xl bg-slate-50 p-4">
          
          {/* Visual Connection Line */}
          <div className="absolute left-[2.1rem] top-12 bottom-12 w-0.5 bg-slate-200 z-0"></div>

          {/* From Input */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200/50">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-900"></div>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Origin (e.g. UP Diliman)"
                className="w-full rounded-xl border border-transparent bg-white px-4 py-3.5 text-sm shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-inset focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Swap Button container */}
          <div className="relative z-20 flex justify-end pr-4 sm:absolute sm:-right-4 sm:top-1/2 sm:-translate-y-1/2 sm:pr-0">
              <button 
              onClick={handleSwap}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
              title="Swap locations"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform hover:rotate-180"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
            </button>
          </div>

          {/* To Input */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100/50">
              <div className="h-2.5 w-2.5 rounded-sm bg-blue-600"></div>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Destination (e.g. LRT Katipunan)"
                className="w-full rounded-xl border border-transparent bg-white px-4 py-3.5 text-sm shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-inset focus:ring-blue-600"
              />
            </div>
          </div>
        </div>
        
        <div className="p-2 pt-3">
          <button onClick={handleSearch} className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-4 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-95">
            See Routes & Safety Data
          </button>
        </div>
      </div>

      {/* Popular Schools Quick Select */}
      <div className="mt-10">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Popular Campuses</p>
        <div className="flex flex-wrap gap-2.5">
          {popularSchools.map(school => (
            <button 
              key={school} 
              onClick={() => setFrom(school)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              {school}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
