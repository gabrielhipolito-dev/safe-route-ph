"use client";
import { useState } from "react";
import { safetyReports } from "../data/reports";

export default function SafetyReports() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    { id: "night", label: "🌙 Unsafe at Night" },
    { id: "overcharging", label: "💰 Overcharging" },
    { id: "harassment", label: "⚠️ Harassment" },
    { id: "warning", label: "📢 General Warning" },
  ];

  return (
    <div className="bg-[#F5F7FB] min-h-screen pt-16">
      {/* SECTION 1 — HEADER */}
      <div className="bg-white border-b border-gray-100 px-6 py-8 max-w-5xl mx-auto flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1F3A]">Safety Reports</h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time safety updates from students across Metro Manila
          </p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-green-700">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              12 Safe routes
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-orange-600">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              4 Caution routes
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              2 Danger zones
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#1D4ED8] text-white font-bold px-5 py-2.5 rounded-xl text-sm"
        >
          ＋ Report a Concern
        </button>
      </div>

      {/* SECTION 2 — MAP PLACEHOLDER */}
      <div className="max-w-5xl mx-auto px-6 mt-6">
        <div className="bg-[#0B1F3A] rounded-2xl overflow-hidden relative h-80">
          {/* Decorative blurred circles pb-12 */}
          <div className="absolute top-10 left-20 w-32 h-32 bg-green-500/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-20 w-24 h-24 bg-red-500/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-orange-500/20 rounded-full blur-xl"></div>

          {/* Fake map pins */}
          <div className="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-green-400 border-2 border-white shadow-lg animate-pulse ring-4 ring-green-400/30"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-orange-400 border-2 border-white shadow-lg"></div>
          <div className="absolute bottom-1/3 right-1/3 w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg animate-pulse"></div>

          {/* Center overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl">📍</span>
            <h2 className="text-white font-bold text-xl mt-2">Metro Manila Safety Map</h2>
            <p className="text-gray-400 text-sm mt-1">Interactive map coming soon</p>
          </div>

          {/* Legend row */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-black/30 backdrop-blur-sm rounded-full px-6 py-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-white text-xs">Safe</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              <span className="text-white text-xs">Caution</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-white text-xs">Danger</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 — REPORT CARDS */}
      <div className="max-w-5xl mx-auto px-6 mt-6 pb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-[#0B1F3A] text-lg">Recent Student Reports</h2>
          <div className="text-xs bg-gray-100 rounded-full px-3 py-1.5 text-gray-600">
            All Reports · Unsafe at Night · Overcharging · Harassment
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {safetyReports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[#0B1F3A] text-base">{report.route}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{report.date}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${report.badgeStyles}`}>
                  {report.badgeLabel}
                </span>
              </div>
              <div className="my-3 h-px bg-gray-50"></div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {report.description}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  👥 {report.confirmed} students confirmed
                </div>
                <div className="flex gap-2">
                  <button className="border border-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded-xl hover:bg-gray-50 hover:border-gray-300">
                    ✓ I can confirm this
                  </button>
                  <button className="text-[#1D4ED8] text-xs font-medium">Details →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 — REPORT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-[#0B1F3A] text-lg">Report a Safety Concern</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2 mb-4">
              <span className="text-lg">🤖</span>
              <div>
                <p className="text-xs font-semibold text-blue-700">Screened by Gemini AI</p>
                <p className="text-xs text-blue-500 mt-0.5">
                  Your report will be reviewed by AI before publishing
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">Route</label>
                <input
                  type="text"
                  placeholder="e.g. Adamson to Quiapo"
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full focus:ring-2 focus:ring-[#1D4ED8]/20 outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#0B1F3A]">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`cursor-pointer rounded-xl border-2 p-3 text-sm font-medium transition-all text-center ${
                        selectedCategory === cat.id
                          ? "border-[#1D4ED8] bg-blue-50 text-[#1D4ED8]"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {cat.label}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#0B1F3A]">What happened?</label>
                <textarea
                  rows="4"
                  placeholder="Describe what happened. You can write in Filipino, English, or Taglish."
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full resize-none focus:ring-2 focus:ring-[#1D4ED8]/20 outline-none focus:border-[#1D4ED8]"
                ></textarea>
              </div>

              <div>
                <button
                  className="mt-2 w-full bg-[#1D4ED8] text-white font-bold py-4 rounded-xl"
                >
                  Submit Report
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">
                  Your identity is anonymous. Reports are screened before publishing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}