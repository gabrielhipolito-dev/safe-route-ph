'use client'

import { useState, useEffect, useRef } from 'react'
import { safetyReports } from '../data/reports'
import { safetyPins, reportCategories } from '../data/safetyMap'

export default function SafetyClient({ apiKey }) {
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [activePin, setActivePin] = useState(safetyPins[2]) // Recto Avenue as initial pin
  const [reportLocation, setReportLocation] = useState({ lat: null, lng: null, address: '' })

  const mapRef = useRef(null)
  const modalMapRef = useRef(null)
  const searchInputRef = useRef(null)
  const modalMarkerRef = useRef(null)
  const modalMapInstance = useRef(null)

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
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
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

  useEffect(() => {
    if (showForm && modalMapRef.current && searchInputRef.current && window.google && window.google.maps) {
      if (!modalMapInstance.current) {
        const center = { lat: 14.5995, lng: 120.9842 } // Default to Manila
        
        const map = new window.google.maps.Map(modalMapRef.current, {
          center: center,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy',
        })
        modalMapInstance.current = map

        const marker = new window.google.maps.Marker({
          map: map,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
        })
        modalMarkerRef.current = marker

        const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
          fields: ['place_id', 'geometry', 'name', 'formatted_address'],
        })
        autocomplete.bindTo('bounds', map)

        const updateLocation = (lat, lng, addressStr) => {
          setReportLocation({ lat, lng, address: addressStr })
          if (searchInputRef.current) searchInputRef.current.value = addressStr
        }

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (!place.geometry || !place.geometry.location) return

          const newLat = place.geometry.location.lat()
          const newLng = place.geometry.location.lng()
          const addr = place.formatted_address || place.name

          map.setCenter(place.geometry.location)
          map.setZoom(17)
          marker.setPosition(place.geometry.location)

          updateLocation(newLat, newLng, addr)
        })

        map.addListener('click', (e) => {
          const lat = e.latLng.lat()
          const lng = e.latLng.lng()
          marker.setPosition(e.latLng)
          
          updateLocation(lat, lng, reportLocation.address || 'Loading address...')
          
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
              updateLocation(lat, lng, results[0].formatted_address)
            }
          })
        })

        marker.addListener('dragend', (e) => {
          const lat = e.latLng.lat()
          const lng = e.latLng.lng()
          
          updateLocation(lat, lng, reportLocation.address || 'Loading address...')
          
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
              updateLocation(lat, lng, results[0].formatted_address)
            }
          })
        })
      }
    } else if (!showForm) {
      modalMapInstance.current = null
      modalMarkerRef.current = null
      setReportLocation({ lat: null, lng: null, address: '' })
    }
  }, [showForm])



  return (
    <div className="bg-slate-950 min-h-screen pt-12 pb-16 text-slate-100">
      {/* SECTION 1 — HEADER */}
      <div className="bg-slate-900/60 border-b border-white/10 px-6 py-8 max-w-6xl mx-auto flex justify-between items-start flex-wrap gap-4 rounded-b-[24px] shadow-2xl mb-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.24em] text-emerald-400 border border-emerald-500/30 mb-2 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
            🛡️ Live Commuter Security
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">Student Safety Zones</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl font-medium leading-relaxed">
            Student-verified safety reports and interactive danger/caution/safe zone maps across Metro Manila.
          </p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm font-bold text-emerald-400 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Safe Zones
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm font-bold text-amber-400 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              Caution Zones
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm font-bold text-rose-500 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              Danger Zones
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-sm transition-all duration-300 shadow-[0_0_15px_rgba(52,211,153,0.4)] hover:shadow-[0_0_25px_rgba(52,211,153,0.6)] hover:-translate-y-1 active:scale-95 cursor-pointer uppercase tracking-wider"
        >
          ＋ Report a Concern
        </button>
      </div>

      {/* SECTION 2 — INTERACTIVE MAP & EXPLORATION */}
      <div className="max-w-6xl mx-auto px-6 grid gap-6 lg:grid-cols-3 items-start mb-8">
        <div className="lg:col-span-1 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 pl-1">
            Browse Pinned Safety Zones
          </p>
          {safetyPins.map((pin) => (
            <button
              key={pin.id}
              onClick={() => setActivePin(pin)}
              className={`flex flex-col gap-2 p-4 rounded-[24px] transition-all duration-300 text-left border hover:-translate-y-1 ${
                activePin.id === pin.id
                  ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-[0_0_25px_rgba(52,211,153,0.25)] font-bold'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300 font-medium'
              }`}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] ${
                  pin.type === 'red'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : pin.type === 'orange'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {pin.status}
                </span>
              </div>
              <span className={`text-base font-black tracking-tight leading-snug line-clamp-2 ${activePin.id === pin.id ? 'text-emerald-300' : 'text-slate-100'}`}>
                {pin.name}
              </span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-col gap-4">
          <div className="flex justify-between items-center bg-slate-900/40 border border-white/10 p-3.5 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">Live Safety Map View</span>
              <span className="text-[11px] text-slate-400 font-medium">Native Google Maps with live interactive zones</span>
            </div>
          </div>

          <div 
            ref={mapRef} 
            className="rounded-[24px] border border-white/10 bg-slate-950 overflow-hidden shadow-2xl transition-all duration-300 w-full h-[380px]"
          />
        </div>
      </div>

      {/* SECTION 3 — REPORT CARDS */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-black text-white text-xl tracking-tight uppercase">Recent Student Safety Reports</h2>
          <div className="text-xs font-black bg-white/5 border border-white/10 rounded-full px-4 py-2 text-slate-300 uppercase tracking-wider">
            Filtered by Verified Commuter Updates
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {safetyReports.map((report) => (
            <div key={report.id} className="bg-white/5 rounded-[28px] shadow-[0_16px_40px_rgba(0,0,0,0.4)] border border-white/10 p-5 hover:border-white/20 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition duration-300 backdrop-blur-md">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-black text-slate-100 text-base leading-snug">{report.route}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">{report.date}</p>
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-full border bg-white/5 backdrop-blur-sm tracking-wider uppercase ${report.badgeStyles}`}>
                  {report.badgeLabel}
                </span>
              </div>
              <div className="my-3 h-px bg-white/10"></div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {report.description}
              </p>
              <div className="mt-4 flex justify-between items-center border-t border-white/10 pt-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  👥 {report.confirmed} confirmed
                </div>
                <button className="border border-white/10 text-emerald-400 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-xs font-black px-4 py-2 rounded-xl transition-all duration-300 hover:shadow-[0_0_10px_rgba(52,211,153,0.2)] active:scale-95 uppercase tracking-wider cursor-pointer">
                  ✓ Confirm
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 — REPORT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/90 border border-white/20 rounded-[32px] shadow-[0_0_50px_rgba(52,211,153,0.2)] max-w-lg w-full p-6 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-white text-lg tracking-tight uppercase">Report a Safety Concern</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white text-xl font-black cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 flex gap-3 mb-4 shadow-[0_0_12px_rgba(52,211,153,0.1)]">
              <span className="text-2xl">🤖</span>
              <div>
                <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.12em]">Screened by AI</p>
                <p className="text-xs text-slate-400 mt-0.5 font-medium leading-relaxed">
                  Your report will be screened before publishing to ensure strict student safety.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-end mb-1.5 pl-0.5 pr-1">
                  <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400">Route/Location</label>
                  {reportLocation.lat && (
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                      {reportLocation.lat.toFixed(5)}, {reportLocation.lng.toFixed(5)}
                    </span>
                  )}
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search a place or click on the map"
                  className="border border-white/10 bg-slate-950/60 rounded-xl px-4 py-3 text-sm w-full text-white focus:ring-2 focus:ring-emerald-500/20 outline-none focus:border-emerald-500 font-bold transition-all"
                  onChange={(e) => setReportLocation(prev => ({ ...prev, address: e.target.value }))}
                />
                <div 
                  ref={modalMapRef} 
                  className="w-full h-[220px] bg-slate-950/40 rounded-xl mt-3 border border-white/10 shadow-inner overflow-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400 mb-1.5 pl-0.5">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {reportCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`cursor-pointer rounded-xl border p-3 text-xs font-black uppercase tracking-[0.12em] transition-all text-center ${
                        selectedCategory === cat.id
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.2)]'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      {cat.label}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400 mb-1.5 pl-0.5">Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe what happened clearly."
                  className="border border-white/10 bg-slate-950/60 rounded-xl px-4 py-3 text-sm w-full text-white resize-none focus:ring-2 focus:ring-emerald-500/20 outline-none focus:border-emerald-500 font-bold transition-all"
                ></textarea>
              </div>

              <div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl transition duration-300 shadow-[0_0_15px_rgba(52,211,153,0.35)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] active:scale-95 cursor-pointer uppercase tracking-wider text-sm"
                >
                  Submit Report
                </button>
                <p className="text-xs text-slate-500 text-center mt-2 font-medium">
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
