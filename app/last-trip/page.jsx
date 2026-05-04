'use client';

import { useState } from 'react';

const now = new Date();
const currentH = now.getHours();
const currentM = now.getMinutes();

// Create 12-hour AM/PM string from 24h hours/mins
function createTimeStr(h, m) {
  let adjustedH = (h + 24) % 24;
  const ampm = adjustedH >= 12 ? 'PM' : 'AM';
  adjustedH = adjustedH % 12;
  adjustedH = adjustedH ? adjustedH : 12;
  return `${adjustedH}:${m < 10 ? '0' + m : m} ${ampm}`;
}

const initialCards = [
  {
    id: 1,
    route: "Adamson to Kalaw",
    vehicleEmoji: "🛺",
    vehicleType: "Tricycle",
    statusText: "STILL RUNNING",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    time: createTimeStr(currentH + 1, 0), // 1 hour in future
    operatingDays: "Mon - Fri",
    subtext: "Usual Last Trip Time",
    subtextColor: "text-slate-500 text-xs mt-1 font-medium tracking-wide",
    vouched: 8,
    disputed: 0,
    hasConfirmButton: true
  },
  {
    id: 2,
    route: "UST to Fairview",
    vehicleEmoji: "🚐",
    vehicleType: "UV Express",
    statusText: "FILLING UP LAST RIDE",
    statusColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    time: createTimeStr(currentH + 2, 30), // 2.5 hours in future
    operatingDays: "Every Day",
    subtext: "Currently at terminal",
    subtextColor: "text-slate-500 text-xs mt-1 font-medium tracking-wide",
    vouched: 3,
    disputed: 1,
    hasConfirmButton: true
  },
  {
    id: 3,
    route: "DLSU to Lawton",
    vehicleEmoji: "🚙",
    vehicleType: "Jeepney",
    statusText: "TERMINAL CLOSED",
    statusColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    time: createTimeStr(currentH - 1, 15), // 1 hour 15 mins in past (Passed!)
    operatingDays: "Mon - Fri",
    subtext: "Last trip departed",
    subtextColor: "text-rose-400/80 text-xs mt-1 font-medium tracking-wide",
    vouched: 5,
    disputed: 0,
    hasConfirmButton: false
  },
  {
    id: 4,
    route: "Recto to Antipolo",
    vehicleEmoji: "🚈",
    vehicleType: "LRT",
    statusText: "STILL RUNNING",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    time: createTimeStr(currentH + 3, 45), // 3.75 hours in future
    operatingDays: "Every Day",
    subtext: "LRT-2 Schedule",
    subtextColor: "text-slate-500 text-xs mt-1 font-medium tracking-wide",
    vouched: 12,
    disputed: 1,
    hasConfirmButton: true
  },
  {
    id: 5,
    route: "Taft Ave to North Ave",
    vehicleEmoji: "🚇",
    vehicleType: "MRT",
    statusText: "FILLING UP LAST RIDE",
    statusColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    time: createTimeStr(currentH + 1, 30), // 1.5 hours in future
    operatingDays: "Every Day",
    subtext: "MRT-3 Schedule",
    subtextColor: "text-slate-500 text-xs mt-1 font-medium tracking-wide",
    vouched: 24,
    disputed: 2,
    hasConfirmButton: true
  },
  {
    id: 6,
    route: "Ayala to Biñan",
    vehicleEmoji: "🚌",
    vehicleType: "Bus",
    statusText: "STILL RUNNING",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    time: createTimeStr(currentH + 2, 0), // 2 hours in future
    operatingDays: "Mon - Fri",
    subtext: "One Ayala Terminal",
    subtextColor: "text-slate-500 text-xs mt-1 font-medium tracking-wide",
    vouched: 18,
    disputed: 0,
    hasConfirmButton: true
  }
];

export default function LastTrip() {
  const [trips, setTrips] = useState(initialCards);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Active');
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [newOrigin, setNewOrigin] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newVehicleType, setNewVehicleType] = useState('Jeepney');
  const [newHour, setNewHour] = useState('09');
  const [newMinute, setNewMinute] = useState('00');
  const [newAmpm, setNewAmpm] = useState('PM');
  const [newOperatingDays, setNewOperatingDays] = useState('Every Day');

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!newOrigin || !newDestination) return;

    const formattedTime = `${newHour}:${newMinute} ${newAmpm}`;
    const autoSubtext = newVehicleType === 'LRT' ? 'LRT-2 Schedule' :
                        newVehicleType === 'MRT' ? 'MRT-3 Schedule' :
                        'Usual Last Trip Time';

    const newCard = {
      id: Date.now(),
      route: `${newOrigin} to ${newDestination}`,
      vehicleEmoji: newVehicleType === 'Jeepney' ? '🚙' : newVehicleType === 'UV Express' ? '🚐' : newVehicleType === 'Tricycle' ? '🛺' : newVehicleType === 'LRT' ? '🚈' : newVehicleType === 'MRT' ? '🚇' : '🚌',
      vehicleType: newVehicleType,
      statusText: "STILL RUNNING",
      statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      time: formattedTime,
      operatingDays: newOperatingDays,
      subtext: autoSubtext,
      subtextColor: "text-slate-500 text-xs mt-1 font-medium tracking-wide",
      vouched: 0,
      disputed: 0,
      hasConfirmButton: true
    };

    setTrips([newCard, ...trips]);
    setNewOrigin('');
    setNewDestination('');
    setNewHour('09');
    setNewMinute('00');
    setNewAmpm('PM');
    setNewVehicleType('Jeepney');
    setNewOperatingDays('Every Day');
    setShowForm(false);
  };

  function get24Hour(timeStr) {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let h = parseInt(match[1]);
    const m = parseInt(match[2]);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;

    // Public transit early morning hours continuation (e.g. 12 AM to 4 AM)
    const now = new Date();
    const curH = now.getHours();
    if (curH >= 16 && ampm === 'AM' && h <= 4) {
      h += 24;
    }
    return h + m / 60;
  }

  const d = new Date();
  const currentHour = d.getHours() + d.getMinutes() / 60;

  const filteredTrips = trips.map(card => {
    const isPassed = currentHour >= get24Hour(card.time);
    return {
      ...card,
      statusText: isPassed ? "TERMINAL CLOSED" : card.statusText,
      statusColor: isPassed ? "bg-rose-500/10 text-rose-400 border-rose-500/30" : card.statusColor,
      hasConfirmButton: isPassed ? false : card.hasConfirmButton
    };
  }).filter(card => {
    const matchesSearch = 
      card.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.vehicleType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      selectedFilter === 'All Active' ? (card.statusText !== 'TERMINAL CLOSED') :
      selectedFilter === 'Missed' ? (card.statusText === 'TERMINAL CLOSED') :
      card.vehicleType === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-4 md:p-8 select-none antialiased">
      <div className="max-w-4xl mx-auto space-y-6 mt-6">
        {/* HEADER SECTION */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                LIVE TIMINGS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              Last Trip Tracker
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5 max-w-xl font-medium leading-relaxed">
              Real-time updates on community-reported last departure times for student commute routes.
            </p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition-all duration-300 shadow-[0_0_15px_rgba(52,211,153,0.35)] hover:shadow-[0_0_25px_rgba(52,211,153,0.55)] hover:-translate-y-0.5 active:scale-95 cursor-pointer uppercase tracking-wider flex items-center gap-1.5 shrink-0 self-start md:self-center"
          >
            <span className="text-base">＋</span> REPORT TRIP
          </button>
        </div>

        {/* MIDDLE SECTION: SEARCH & FILTERS */}
        <div className="flex flex-col gap-3">
          <div className="relative flex items-center bg-slate-900/80 border border-white/10 hover:border-white/20 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 rounded-xl px-4 transition duration-300 shadow-xl backdrop-blur-md h-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search origin, destination, or university..."
              className="bg-transparent border-none outline-none text-slate-200 text-xs w-full pl-2.5 pr-1.5 h-full placeholder-slate-500 font-medium"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {['All Active', 'Jeepney', 'UV Express', 'Tricycle', 'LRT', 'MRT', 'Bus', 'Missed'].map((filter) => {
              const isSelected = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3.5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
                    isSelected 
                      ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]' 
                      : 'bg-slate-900/50 text-slate-400 border-white/10 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM SECTION: THE DATA CARDS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-extrabold text-white text-base sm:text-lg tracking-tight uppercase flex items-center gap-2">
                Current Last Trip Reports
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">Updated in real-time by students</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrips.map((card) => (
              <div 
                key={card.id} 
                className="bg-slate-900/60 rounded-2xl border border-white/10 p-5 flex flex-col justify-between hover:border-emerald-400/30 hover:shadow-[0_0_20px_rgba(52,211,153,0.12)] hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl group select-none relative overflow-hidden"
              >
                {/* background glow on hover */}
                <div className="absolute -inset-px bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-2xl" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div>
                        <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 font-extrabold uppercase tracking-widest text-[9px] text-slate-300">
                          {card.vehicleEmoji} {card.vehicleType}
                        </span>
                        <h3 className="font-extrabold text-white text-sm sm:text-base uppercase tracking-tight mt-2.5 leading-tight group-hover:text-emerald-400 transition-colors">
                          {card.route}
                        </h3>
                      </div>
                      <span className={`text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-full border bg-white/5 tracking-wider uppercase backdrop-blur-sm shrink-0 shadow-sm ${card.statusColor}`}>
                        {card.statusText}
                      </span>
                    </div>

                    <div className="my-3 h-px bg-white/5 group-hover:bg-emerald-500/10 transition-colors" />

                    {/* Time display row */}
                    <div className="flex flex-col mb-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                          {card.time}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded border bg-white/5 border-white/10 text-slate-300 tracking-wider uppercase backdrop-blur-sm shrink-0">
                          🗓️ {card.operatingDays}
                        </span>
                      </div>
                      {card.subtext && (
                        <span className={card.subtextColor}>
                          {card.subtext}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer action */}
                  <div className="border-t border-white/5 pt-3 mt-auto flex flex-col gap-2.5">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 font-bold uppercase tracking-wider">
                        {card.hasConfirmButton ? (
                          <div className="flex gap-2">
                            <span className="flex items-center gap-1 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                              ▲ {card.vouched}
                            </span>
                            <span className="flex items-center gap-1 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10">
                              ▼ {card.disputed}
                            </span>
                          </div>
                        ) : (
                          <span className="text-rose-300/90 font-medium tracking-wide">Verified by {card.vouched} students</span>
                        )}
                      </div>

                      {card.hasConfirmButton && (
                        <div className="flex gap-1.5 items-center">
                          <div className="border border-white/10 bg-slate-800/40 text-slate-300 text-[10px] font-black px-2.5 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1 shrink-0">
                            Vouch
                          </div>
                          <div className="border border-white/10 bg-slate-800/40 text-slate-300 text-[10px] font-black px-2.5 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1 shrink-0">
                            Dispute
                          </div>
                        </div>
                      )}
                    </div>

                    {!card.hasConfirmButton && (
                      <div className="bg-rose-500/5 border border-rose-500/15 rounded-xl p-2.5 flex gap-2 items-start mt-0.5">
                        <span className="text-sm text-rose-400">⚠️</span>
                        <span className="text-[10px] text-rose-300/80 font-medium leading-relaxed">
                          Terminal is closed.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REPORT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl shadow-[0_0_50px_rgba(52,211,153,0.15)] max-w-sm w-full p-5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300 select-none">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-extrabold text-white text-base tracking-tight uppercase flex items-center gap-1.5">
                <span className="text-lg">➕</span> Report Trip
              </h2>
              <button 
                onClick={() => setShowForm(false)} 
                className="text-slate-400 hover:text-white text-lg font-black cursor-pointer transition-colors p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 mb-1 pl-0.5">Origin / Pick-up Point</label>
                  <input 
                    type="text" 
                    required
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    placeholder="e.g. Adamson University"
                    className="border border-white/10 bg-slate-950 rounded-xl px-3.5 py-2.5 text-xs w-full outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-white font-bold transition-all placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 mb-1 pl-0.5">Destination / Drop-off</label>
                  <input 
                    type="text" 
                    required
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    placeholder="e.g. Kalaw"
                    className="border border-white/10 bg-slate-950 rounded-xl px-3.5 py-2.5 text-xs w-full outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-white font-bold transition-all placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 mb-1 pl-0.5">Vehicle Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Jeepney', emoji: '🚌' },
                    { label: 'UV Express', emoji: '🚐' },
                    { label: 'Tricycle', emoji: '🛺' },
                    { label: 'LRT', emoji: '🚈' },
                    { label: 'MRT', emoji: '🚇' },
                    { label: 'Bus', emoji: '🚌' }
                  ].map((vehicle) => {
                    const isSelected = newVehicleType === vehicle.label;
                    return (
                      <button 
                        key={vehicle.label}
                        type="button"
                        onClick={() => setNewVehicleType(vehicle.label)}
                        className={`rounded-xl px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1 border cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-400 text-slate-950 border-emerald-400' 
                            : 'border-white/10 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {vehicle.emoji} {vehicle.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 mb-1 pl-0.5">Operating Days</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Every Day', 'Mon - Fri', 'Sat - Sun'].map((days) => {
                    const isSelected = newOperatingDays === days;
                    return (
                      <button 
                        key={days}
                        type="button"
                        onClick={() => setNewOperatingDays(days)}
                        className={`rounded-xl px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center border cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-400 text-slate-950 border-emerald-400' 
                            : 'border-white/10 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        🗓️ {days}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 mb-1 pl-0.5">
                  Reported Departure Time
                </label>
                <div className="flex gap-2 bg-slate-950 border border-white/10 rounded-xl p-2 h-12">
                  <select 
                    value={newHour}
                    onChange={(e) => setNewHour(e.target.value)}
                    className="bg-transparent border-none outline-none text-white font-bold text-xs flex-1 pl-1 h-full cursor-pointer focus:text-emerald-400 transition"
                  >
                    {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(h => (
                      <option key={h} value={h} className="bg-slate-900 text-white font-bold">{h}</option>
                    ))}
                  </select>
                  <span className="text-slate-600 self-center font-bold text-sm">:</span>
                  <select 
                    value={newMinute}
                    onChange={(e) => setNewMinute(e.target.value)}
                    className="bg-transparent border-none outline-none text-white font-bold text-xs flex-1 pl-1 h-full cursor-pointer focus:text-emerald-400 transition"
                  >
                    {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => (
                      <option key={m} value={m} className="bg-slate-900 text-white font-bold">{m}</option>
                    ))}
                  </select>
                  <select 
                    value={newAmpm}
                    onChange={(e) => setNewAmpm(e.target.value)}
                    className="bg-transparent border-none outline-none text-white font-bold text-xs flex-1 pl-1 h-full cursor-pointer focus:text-emerald-400 transition"
                  >
                    {['AM', 'PM'].map(p => (
                      <option key={p} value={p} className="bg-slate-900 text-white font-bold">{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <button 
                  type="submit"
                  className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black py-3 rounded-xl transition duration-300 active:scale-95 cursor-pointer uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 mt-1"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
