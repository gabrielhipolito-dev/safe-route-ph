'use client';

import { useState } from 'react';
import { lastTrips as cardsData } from '../data/lastTrips';

export default function LastTrip() {
  const [showForm, setShowForm] = useState(false);
  const [confirming, setConfirming] = useState(null);

  return (
    <div className="bg-[#F5F7FB] min-h-screen pt-16">
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-gray-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0B1F3A]">Last Trip Tracker</h1>
            <p className="text-gray-500 text-sm mt-1">
              Community-reported last departure times for jeepney and UV Express routes
            </p>
            <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-4 py-2">
              <span className="text-sm">🕒</span>
              <span className="text-amber-700 text-xs font-medium">Reports reset daily at midnight</span>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#1D4ED8] text-white font-bold px-5 py-2.5 rounded-xl text-sm"
          >
            ＋ Report Last Trip
          </button>
        </div>
      </div>

      {/* HOW IT WORKS BAR */}
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-5xl mx-auto flex gap-8 justify-center flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center">1</div>
            <span className="text-sm text-gray-600">Student reports last trip time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center">2</div>
            <span className="text-sm text-gray-600">Others confirm the report</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center">3</div>
            <span className="text-sm text-gray-600">Route status updates automatically</span>
          </div>
        </div>
      </div>

      {/* LAST TRIP CARDS SECTION */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-bold text-[#0B1F3A] text-lg">Current Last Trip Reports</h2>
            <p className="text-xs text-gray-400 mt-0.5">Updated in real-time by students</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-[#1D4ED8] text-white text-xs px-3 py-1.5 rounded-full">All Active</button>
            <button className="bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-full">Missed</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cardsData.map((card) => (
            <div key={card.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[#0B1F3A] text-base">{card.route}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm">{card.vehicleEmoji}</span>
                    <span className="text-xs text-gray-500">{card.vehicleType}</span>
                  </div>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${card.statusColor}`}>
                  {card.statusText}
                </div>
              </div>

              <div className="my-3 h-px bg-gray-50"></div>

              <div className="flex items-end gap-3">
                <div className="text-3xl font-black text-[#0B1F3A]">{card.time}</div>
                <div>
                  <div className="text-xs text-gray-400">Last reported departure</div>
                  <div className="text-xs text-gray-500 mt-0.5">Reported {card.reported}</div>
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  👥 {card.confirmed} students confirmed
                </div>
                {confirming === card.id ? (
                  <div className="text-green-600 text-xs font-medium">✓ Confirmed!</div>
                ) : (
                  <button 
                    onClick={() => setConfirming(card.id)}
                    className="border border-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded-xl hover:bg-gray-50"
                  >
                    Confirm this
                  </button>
                )}
              </div>

              {card.statusText === "● Last Trip Left" && (
                <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2">
                  <span className="text-sm">⚠️</span>
                  <span className="text-xs text-red-600">Last trip may have already departed. Consider alternative transport.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* REPORT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-[#0B1F3A] text-lg">Report Last Trip</h2>
              <button 
                onClick={() => setShowForm(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <div className="text-xs font-semibold text-blue-700">Community verified</div>
                <div className="text-xs text-blue-500 mt-0.5">
                  Your report helps students know if they missed the last trip
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Route</label>
                <input 
                  type="text" 
                  placeholder="e.g. Adamson to Quiapo"
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Vehicle Type</label>
                <div className="flex gap-3">
                  <button className="bg-[#1D4ED8] text-white border border-[#1D4ED8] rounded-xl px-4 py-2 text-sm font-medium">
                    🚌 Jeepney
                  </button>
                  <button className="border border-gray-200 text-gray-600 rounded-xl px-4 py-2 text-sm font-medium">
                    🚐 UV Express
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Last Trip Time You Saw</label>
                <input 
                  type="time" 
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Additional Notes (optional)</label>
                <textarea 
                  rows="2" 
                  placeholder="Any extra info for other students"
                  className="resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20"
                ></textarea>
              </div>

              <div>
                <button className="w-full bg-[#1D4ED8] text-white font-bold py-4 rounded-xl mt-2">
                  Submit Report
                </button>
                <div className="text-xs text-gray-400 text-center mt-2">
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
