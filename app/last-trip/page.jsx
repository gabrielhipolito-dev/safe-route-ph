'use client';

import { useState } from 'react';
import { lastTrips as cardsData } from '../data/lastTrips';

export default function LastTrip() {
  const [showForm, setShowForm] = useState(false);
  const [confirming, setConfirming] = useState(null);

  return (
    <div className="bg-slate-950 min-h-screen pt-16 text-slate-100">
      {/* HEADER SECTION */}
      <div className="bg-slate-900/60 border-b border-white/10 px-6 py-8 backdrop-blur-xl max-w-5xl mx-auto rounded-b-[24px] shadow-2xl">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.24em] text-emerald-400 border border-emerald-500/30 mb-2 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
              🕒 LIVE TIMINGS
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">Last Trip Tracker</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl font-medium leading-relaxed">
              Community-reported last departure times for jeepney and UV Express routes.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
              <span className="text-sm">🕒</span>
              <span className="text-emerald-400 text-xs font-black uppercase tracking-wider">Reports reset daily at midnight</span>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-sm transition-all duration-300 shadow-[0_0_15px_rgba(52,211,153,0.4)] hover:shadow-[0_0_25px_rgba(52,211,153,0.6)] hover:-translate-y-1 active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            ＋ Report Last Trip
          </button>
        </div>
      </div>

      {/* HOW IT WORKS BAR */}
      <div className="border-b border-white/5 py-4 px-6 max-w-5xl mx-auto mt-4 bg-white/5 rounded-3xl backdrop-blur-md">
        <div className="flex gap-8 justify-center flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs font-black flex items-center justify-center uppercase">1</div>
            <span className="text-sm text-slate-300 font-bold uppercase tracking-wider">Student reports last trip</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs font-black flex items-center justify-center uppercase">2</div>
            <span className="text-sm text-slate-300 font-bold uppercase tracking-wider">Others confirm the report</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs font-black flex items-center justify-center uppercase">3</div>
            <span className="text-sm text-slate-300 font-bold uppercase tracking-wider">Status updates automatically</span>
          </div>
        </div>
      </div>

      {/* LAST TRIP CARDS SECTION */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-black text-white text-lg tracking-tight uppercase">Current Last Trip Reports</h2>
            <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wide">Updated in real-time by students</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-emerald-500 text-slate-950 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(52,211,153,0.25)]">All Active</button>
            <button className="bg-white/5 border border-white/10 text-slate-400 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider">Missed</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cardsData.map((card) => (
            <div key={card.id} className="bg-white/5 rounded-2xl border border-white/10 shadow-2xl p-5 hover:border-white/20 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition duration-300 backdrop-blur-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-slate-100 text-base uppercase tracking-tight">{card.route}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm">{card.vehicleEmoji}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wide font-bold">{card.vehicleType}</span>
                  </div>
                </div>
                <div className={`text-xs font-black px-3 py-1 rounded-full border bg-white/5 backdrop-blur-sm tracking-wider uppercase ${card.statusColor === 'bg-green-100 text-green-700' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : card.statusColor === 'bg-amber-100 text-amber-700' ? 'border-amber-500/30 text-amber-400 bg-amber-500/5' : 'border-rose-500/30 text-rose-400 bg-rose-500/5'}`}>
                  {card.statusText}
                </div>
              </div>

              <div className="my-3 h-px bg-white/10"></div>

              <div className="flex items-end gap-3">
                <div className="text-4xl font-black text-white">{card.time}</div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Last reported departure</div>
                  <div className="text-xs text-emerald-400 mt-0.5 uppercase tracking-wide font-black">Reported {card.reported}</div>
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center border-t border-white/10 pt-3">
                <div className="text-xs text-slate-400 flex items-center gap-1 font-bold uppercase tracking-wide">
                  👥 {card.confirmed} confirmed
                </div>
                {confirming === card.id ? (
                  <div className="text-emerald-400 text-xs font-black uppercase tracking-wider shadow-[0_0_8px_rgba(52,211,153,0.15)]">✓ Confirmed!</div>
                ) : (
                  <button 
                    onClick={() => setConfirming(card.id)}
                    className="border border-white/10 bg-white/5 text-slate-300 text-xs font-black px-4 py-2 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-300 transition-all active:scale-95 uppercase tracking-wider"
                  >
                    Confirm this
                  </button>
                )}
              </div>

              {card.statusText === "● Last Trip Left" && (
                <div className="mt-3 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex gap-2">
                  <span className="text-sm">⚠️</span>
                  <span className="text-xs text-rose-300 font-bold">Last trip may have already departed. Consider alternative transport.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* REPORT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/90 border border-white/20 rounded-[32px] shadow-[0_0_50px_rgba(52,211,153,0.2)] max-w-md w-full p-6 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-black text-white text-lg tracking-tight uppercase">Report Last Trip</h2>
              <button 
                onClick={() => setShowForm(false)} 
                className="text-slate-400 hover:text-white text-xl font-black cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <div className="text-xs font-black text-emerald-400 uppercase tracking-wider">Community verified</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium leading-relaxed">
                  Your report helps students know if they missed the last trip
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400 mb-1 pl-0.5">Route</label>
                <input 
                  type="text" 
                  placeholder="e.g. Adamson to Quiapo"
                  className="border border-white/10 bg-slate-950/60 rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white font-bold transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400 mb-1 pl-0.5">Vehicle Type</label>
                <div className="flex gap-3">
                  <button className="bg-emerald-500 text-slate-950 border border-emerald-500 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-[0_0_12px_rgba(52,211,153,0.3)] active:scale-95 cursor-pointer">
                    🚌 Jeepney
                  </button>
                  <button className="border border-white/10 bg-white/5 text-slate-400 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer">
                    🚐 UV Express
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400 mb-1 pl-0.5">Last Trip Time You Saw</label>
                <input 
                  type="time" 
                  className="border border-white/10 bg-slate-950/60 rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white font-bold transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400 mb-1 pl-0.5">Additional Notes (optional)</label>
                <textarea 
                  rows="2" 
                  placeholder="Any extra info for other students"
                  className="resize-none border border-white/10 bg-slate-950/60 rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white font-bold transition-all"
                ></textarea>
              </div>

              <div>
                <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-xl transition duration-300 shadow-[0_0_15px_rgba(52,211,153,0.35)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] active:scale-95 cursor-pointer uppercase tracking-wider text-sm mt-2">
                  Submit Report
                </button>
                <div className="text-xs text-slate-500 text-center mt-2 font-medium">
                  Anonymous · Helps fellow students plan their commute
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
