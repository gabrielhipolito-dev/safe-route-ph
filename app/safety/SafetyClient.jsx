'use client'

import { useState, useEffect, useRef } from 'react'
import { safetyReports } from '../data/reports'

const safetyPins = [
  { id: 1, name: 'University of the Philippines Diliman', lat: 14.6538, lng: 121.0685, type: 'green', status: 'Safe Zone' },
  { id: 2, name: 'Adamson University (Ermita)', lat: 14.5872, lng: 120.9856, type: 'green', status: 'Safe Zone' },
  { id: 3, name: 'Recto Avenue', lat: 14.6031, lng: 120.9852, type: 'red', status: 'Danger Zone' },
  { id: 4, name: 'Espana Boulevard', lat: 14.6111, lng: 120.9892, type: 'orange', status: 'Caution Zone' },
  { id: 5, name: 'Gil Puyat Station', lat: 14.5539, lng: 120.9967, type: 'orange', status: 'Caution Zone' },
]

export default function SafetyClient({ apiKey }) {
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [activePin, setActivePin] = useState(safetyPins[2]) // Recto Avenue as initial pin

  const mapRef = useRef(null)

  useEffect(() => {
    if (!apiKey) return

    let isMounted = true

    const loadAndInit = () => {
      if (!isMounted) return
      if (!window.google || !window.google.maps) {
        // Create only if doesn't exist yet
        const existingScript = document.getElementById('google-maps-js-api')
        if (!existingScript) {
          const script = document.createElement('script')
          script.id = 'google-maps-js-api'
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
          script.async = true
          script.defer = true
          script.onload = () => {
            if (isMounted) initGoogleMap()
          }
          document.head.appendChild(script)
        } else {
          existingScript.addEventListener('load', () => {
            if (isMounted) initGoogleMap()
          })
        }
      } else {
        initGoogleMap()
      }
    }

    const initGoogleMap = () => {
      if (!mapRef.current || !window.google || !window.google.maps) return

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: activePin.lat, lng: activePin.lng },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      // Add clean markers and native direct circles for ALL pins on the Google map!
      safetyPins.forEach((pin) => {
        new window.google.maps.Marker({
          position: { lat: pin.lat, lng: pin.lng },
          map: map,
          title: pin.name,
        })

        new window.google.maps.Circle({
          strokeColor: pin.type === 'red' ? '#EF4444' : pin.type === 'orange' ? '#F59E0B' : '#10B981',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: pin.type === 'red' ? '#EF4444' : pin.type === 'orange' ? '#F59E0B' : '#10B981',
          fillOpacity: 0.3,
          map: map,
          center: { lat: pin.lat, lng: pin.lng },
          radius: 350, // 350 meters circle
        })
      })
    }


    loadAndInit()

    return () => {
      isMounted = false
    }
  }, [apiKey, activePin])

  const categories = [
    { id: 'night', label: '🌙 Unsafe at Night' },
    { id: 'overcharging', label: '💰 Overcharging' },
    { id: 'harassment', label: '⚠️ Harassment' },
    { id: 'warning', label: '📢 General Warning' },
  ]

  return (
    <div className="bg-slate-50 min-h-screen pt-12 pb-16">
      {/* SECTION 1 — HEADER */}
      <div className="bg-white border-b border-slate-200/60 px-6 py-8 max-w-6xl mx-auto flex justify-between items-start flex-wrap gap-4 rounded-b-[24px] shadow-sm mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.24em] text-rose-600 mb-2">
            🛡️ Live Commuter Security
          </span>
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">Student Safety Zones</h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl font-medium leading-relaxed">
            Student-verified safety reports and interactive danger/caution/safe zone maps across Metro Manila.
          </p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm font-bold text-green-700 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              Safe Zones
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm font-bold text-orange-600 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
              Caution Zones
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm font-bold text-red-600 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              Danger Zones
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-2xl text-sm transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
        >
          ＋ Report a Concern
        </button>
      </div>

      {/* SECTION 2 — INTERACTIVE MAP & EXPLORATION */}
      <div className="max-w-6xl mx-auto px-6 grid gap-6 lg:grid-cols-3 items-start mb-8">
        <div className="lg:col-span-1 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400 pl-1">
            Browse Pinned Safety Zones
          </p>
          {safetyPins.map((pin) => (
            <button
              key={pin.id}
              onClick={() => setActivePin(pin)}
              className={`flex flex-col gap-2 p-4 rounded-[24px] transition-all duration-300 text-left border ${
                activePin.id === pin.id
                  ? 'bg-slate-900 border-slate-800 text-white shadow-[0_16px_36px_rgba(15,23,42,0.14)] font-bold scale-[1.01]'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800 font-medium'
              }`}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] ${
                  pin.type === 'red'
                    ? 'bg-red-500/20 text-red-400'
                    : pin.type === 'orange'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {pin.status}
                </span>
              </div>
              <span className={`text-base font-black tracking-tight leading-snug line-clamp-2 ${activePin.id === pin.id ? 'text-white' : 'text-slate-950'}`}>
                {pin.name}
              </span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 rounded-[32px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Live Safety Map View</span>
              <span className="text-[11px] text-slate-500 font-medium">Native Google Maps with live circles</span>
            </div>
          </div>

          <div 
            ref={mapRef} 
            className="rounded-[24px] border border-slate-200 bg-slate-50 overflow-hidden shadow-sm transition-all duration-300 w-full h-[380px]"
          />
        </div>
      </div>

      {/* SECTION 3 — REPORT CARDS */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-black text-slate-950 text-xl tracking-tight">Recent Student Safety Reports</h2>
          <div className="text-xs font-bold bg-slate-100 rounded-full px-3 py-1.5 text-slate-600 border border-slate-200">
            Filtered by Verified Commuter Updates
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {safetyReports.map((report) => (
            <div key={report.id} className="bg-white rounded-[28px] shadow-sm border border-slate-100 p-5 hover:shadow-md transition duration-200">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-bold text-slate-950 text-base leading-snug">{report.route}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">{report.date}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${report.badgeStyles}`}>
                  {report.badgeLabel}
                </span>
              </div>
              <div className="my-3 h-px bg-slate-50"></div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {report.description}
              </p>
              <div className="mt-4 flex justify-between items-center border-t border-slate-50 pt-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  👥 {report.confirmed} students confirmed
                </div>
                <button className="border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm cursor-pointer">
                  ✓ Confirm
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 — REPORT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-slate-950 text-lg tracking-tight">Report a Safety Concern</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-3.5 flex gap-3 mb-4">
              <span className="text-2xl">🤖</span>
              <div>
                <p className="text-xs font-bold text-cyan-800 uppercase tracking-[0.12em]">Screened by AI</p>
                <p className="text-xs text-slate-600 mt-0.5 font-medium leading-relaxed">
                  Your report will be screened before publishing to ensure strict student safety.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-400 mb-1.5 pl-0.5">Route</label>
                <input
                  type="text"
                  placeholder="e.g. Adamson to Quiapo"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm w-full focus:ring-2 focus:ring-cyan-500/20 outline-none focus:border-cyan-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-400 mb-1.5 pl-0.5">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`cursor-pointer rounded-xl border-2 p-3 text-xs font-bold uppercase tracking-[0.12em] transition-all text-center ${
                        selectedCategory === cat.id
                          ? 'border-cyan-500 bg-cyan-50/50 text-cyan-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {cat.label}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-400 mb-1.5 pl-0.5">Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe what happened clearly. (English/Filipino/Taglish)"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm w-full resize-none focus:ring-2 focus:ring-cyan-500/20 outline-none focus:border-cyan-500 font-medium"
                ></textarea>
              </div>

              <div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition shadow-md hover:-translate-y-0.5 cursor-pointer"
                >
                  Submit Report
                </button>
                <p className="text-xs text-slate-400 text-center mt-2 font-medium">
                  Your identity is anonymous. Reports are AI-screened before publishing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
