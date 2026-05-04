'use client';

import { useState } from 'react';

const initialCards = [
  {
    id: 1,
    route: "Adamson to Quiapo",
    vehicleEmoji: "🚌",
    vehicleType: "Jeepney",
    statusText: "STILL RUNNING",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    time: "9:45 PM",
    pulsingText: "Leaves in ~45 mins",
    pulsingTextColor: "text-emerald-400 font-black animate-pulse text-xs",
    reported: "12 mins ago",
    confirmed: 8
  },
  {
    id: 2,
    route: "UST to Divisoria",
    vehicleEmoji: "🚌",
    vehicleType: "Jeepney",
    statusText: "LAST TRIP SOON",
    statusColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    time: "10:00 PM",
    pulsingText: "Leaves in ~5 mins!",
    pulsingTextColor: "text-orange-500 font-black animate-pulse text-xs",
    reported: "5 mins ago",
    confirmed: 3
  },
  {
    id: 3,
    route: "DLSU to Lawton",
    vehicleEmoji: "🚐",
    vehicleType: "UV Express",
    statusText: "LAST TRIP LEFT",
    statusColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    time: "9:30 PM",
    pulsingText: "Departed",
    pulsingTextColor: "text-slate-500 font-bold text-xs",
    reported: "25 mins ago",
    confirmed: 15
  }
];

export default function LastTrip() {
  const [trips, setTrips] = useState(initialCards);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Active');
  const [showForm, setShowForm] = useState(false);
  const [confirming, setConfirming] = useState(null);

  // Form states
  const [newRoute, setNewRoute] = useState('');
  const [newVehicleType, setNewVehicleType] = useState('Jeepney');
  const [newTime, setNewTime] = useState('');

  const handleConfirm = (id) => {
    setConfirming(id);
    setTrips(trips.map(card => {
      if (card.id === id) {
        return { ...card, confirmed: card.confirmed + 1 };
      }
      return card;
    }));
    setTimeout(() => setConfirming(null), 2500);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!newRoute || !newTime) return;

    // Convert time string (e.g. 21:45) to 12-hour AM/PM format
    const [hourStr, minStr] = newTime.split(':');
    let h = parseInt(hourStr);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    const formattedTime = `${h}:${minStr} ${ampm}`;

    const newCard = {
      id: Date.now(),
      route: newRoute,
      vehicleEmoji: newVehicleType === 'Jeepney' ? '🚌' : '🚐',
      vehicleType: newVehicleType,
      statusText: "STILL RUNNING",
      statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      time: formattedTime,
      pulsingText: "Leaves soon",
      pulsingTextColor: "text-emerald-400 font-black animate-pulse text-xs",
      reported: "Just now",
      confirmed: 0
    };

    setTrips([newCard, ...trips]);
    setNewRoute('');
    setNewTime('');
    setNewVehicleType('Jeepney');
    setShowForm(false);
  };

  const filteredTrips = trips.filter(card => {
    const matchesSearch = 
      card.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.vehicleType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      selectedFilter === 'All Active' ? (card.statusText !== 'LAST TRIP LEFT') :
      selectedFilter === 'Missed' ? (card.statusText === 'LAST TRIP LEFT') :
      selectedFilter === 'Jeepney' ? (card.vehicleType === 'Jeepney') :
      selectedFilter === 'UV Express' ? (card.vehicleType === 'UV Express') :
      true;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-6 md:p-12 select-none antialiased">
      <div className="max-w-5xl mx-auto space-y-8 mt-12">
        {/* HEADER SECTION */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-black tracking-widest text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                LIVE TIMINGS
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase flex items-center gap-3">
              Last Trip Tracker
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl font-medium leading-relaxed">
              Real-time updates on community-reported last departure times for student commute routes. Check statuses, confirm schedules, or report missed trips.
            </p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-sm transition-all duration-300 shadow-[0_0_15px_rgba(52,211,153,0.4)] hover:shadow-[0_0_25px_rgba(52,211,153,0.6)] hover:-translate-y-1 active:scale-95 cursor-pointer uppercase tracking-wider flex items-center gap-2 shrink-0 self-start md:self-center"
          >
            <span className="text-lg">＋</span> REPORT LAST TRIP
          </button>
        </div>

        {/* PROGRESS BAR / HOW IT WORKS */}
        <div className="bg-slate-900/40 border border-white/5 py-5 px-6 rounded-3xl backdrop-blur-md shadow-inner">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-around items-start md:items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center shadow-[0_0_12px_rgba(52,211,153,0.5)]">1</div>
              <span className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">Student Reports Last Trip</span>
            </div>
            <div className="hidden md:block h-px w-12 bg-white/10"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-400 text-xs font-black flex items-center justify-center">2</div>
              <span className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">Others Confirm</span>
            </div>
            <div className="hidden md:block h-px w-12 bg-white/10"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-400 text-xs font-black flex items-center justify-center">3</div>
              <span className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">Status Updates Automatically</span>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: SEARCH & FILTERS */}
        <div className="flex flex-col gap-4">
          <div className="relative flex items-center bg-slate-900/80 border border-white/10 hover:border-white/20 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 rounded-2xl px-5 transition duration-300 shadow-xl backdrop-blur-md h-14">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search origin, destination, or university..."
              className="bg-transparent border-none outline-none text-slate-200 text-sm w-full pl-3 pr-2 h-full placeholder-slate-500 font-medium"
            />
          </div>

          <div className="flex gap-2.5 flex-wrap">
            {['All Active', 'Jeepney', 'UV Express', 'Missed'].map((filter) => {
              const isSelected = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4.5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer border ${
                    isSelected 
                      ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.35)]' 
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
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-extrabold text-white text-lg sm:text-xl tracking-tight uppercase flex items-center gap-2.5">
                Current Last Trip Reports
              </h2>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Updated in real-time by students</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((card) => (
              <div 
                key={card.id} 
                className="bg-slate-900/60 rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:border-emerald-400/30 hover:shadow-[0_0_25px_rgba(52,211,153,0.15)] hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-xl group select-none relative overflow-hidden"
              >
                {/* background glow on hover */}
                <div className="absolute -inset-px bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-3xl" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <div>
                        <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1 font-extrabold uppercase tracking-widest text-[10px] text-slate-300">
                          {card.vehicleEmoji} {card.vehicleType}
                        </span>
                        <h3 className="font-extrabold text-white text-base sm:text-lg uppercase tracking-tight mt-3 leading-tight group-hover:text-emerald-400 transition-colors">
                          {card.route}
                        </h3>
                      </div>
                      <span className={`text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-full border bg-white/5 tracking-wider uppercase backdrop-blur-sm shrink-0 shadow-sm ${card.statusColor}`}>
                        {card.statusText}
                      </span>
                    </div>

                    <div className="my-4 h-px bg-white/5 group-hover:bg-emerald-500/10 transition-colors" />

                    {/* Time display row with pulsing text */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
                        {card.time}
                      </span>
                      {card.pulsingText && (
                        <span className={`inline-flex items-center gap-1.5 ${card.pulsingTextColor}`}>
                          {card.statusText !== 'LAST TRIP LEFT' && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                            </span>
                          )}
                          {card.pulsingText}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 flex flex-col sm:flex-row justify-between gap-1 mt-2 mb-4">
                      <span className="font-medium tracking-wide">Last reported departure</span>
                      <span className="font-black text-emerald-400 uppercase tracking-wider text-[11px]">Reported {card.reported}</span>
                    </div>
                  </div>

                  {/* Footer action */}
                  <div className="border-t border-white/5 pt-4 mt-auto flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {card.confirmed} {card.confirmed === 1 ? 'confirmed' : 'confirmed'}
                      </div>
                      {confirming === card.id ? (
                        <div className="text-emerald-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                          ✓ Confirmed
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleConfirm(card.id)}
                          className="border border-white/10 hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-emerald-300 bg-slate-800/40 text-slate-300 text-xs font-black px-4 py-2.5 rounded-xl transition-all duration-300 active:scale-95 uppercase tracking-wider cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          Confirm
                        </button>
                      )}
                    </div>

                    {card.statusText === "LAST TRIP LEFT" && (
                      <div className="bg-rose-500/5 border border-rose-500/15 rounded-2xl p-3 flex gap-2 items-start mt-1">
                        <span className="text-base text-rose-400">⚠️</span>
                        <span className="text-xs text-rose-300/80 font-medium leading-relaxed">
                          The last scheduled trip has departed. Consider exploring other student ride shares or alternative transport.
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
          <div className="bg-slate-900 border border-white/20 rounded-[32px] shadow-[0_0_50px_rgba(52,211,153,0.15)] max-w-md w-full p-6 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300 select-none">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-extrabold text-white text-lg tracking-tight uppercase flex items-center gap-2">
                <span className="text-xl">➕</span> Report Last Trip
              </h2>
              <button 
                onClick={() => setShowForm(false)} 
                className="text-slate-400 hover:text-white text-xl font-black cursor-pointer transition-colors p-2"
              >
                ✕
              </button>
            </div>

            <div className="mb-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 flex gap-3">
              <span className="text-xl">🙌</span>
              <div>
                <div className="text-xs font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">COMMUNITY ACTION</div>
                <div className="text-xs text-slate-400 font-medium leading-relaxed">
                  Your anonymous reports save time and keep fellow students safe. Be accurate with times!
                </div>
              </div>
            </div>

            <form onSubmit={handleReportSubmit} className="flex flex-col gap-4.5">
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400 mb-1.5 pl-0.5">Route or University</label>
                <input 
                  type="text" 
                  required
                  value={newRoute}
                  onChange={(e) => setNewRoute(e.target.value)}
                  placeholder="e.g. Adamson to Quiapo"
                  className="border border-white/10 bg-slate-950 rounded-xl px-4 py-3.5 text-sm w-full outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-white font-bold transition-all placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400 mb-1.5 pl-0.5">Vehicle Type</label>
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setNewVehicleType('Jeepney')}
                    className={`flex-1 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border cursor-pointer ${
                      newVehicleType === 'Jeepney' 
                        ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]' 
                        : 'border-white/10 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🚌 Jeepney
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewVehicleType('UV Express')}
                    className={`flex-1 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border cursor-pointer ${
                      newVehicleType === 'UV Express' 
                        ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]' 
                        : 'border-white/10 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🚐 UV Express
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400 mb-1.5 pl-0.5">Reported Departure Time</label>
                <input 
                  type="time" 
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="border border-white/10 bg-slate-950 rounded-xl px-4 py-3.5 text-sm w-full outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-white font-bold transition-all"
                />
              </div>

              <div>
                <button 
                  type="submit"
                  className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black py-4 rounded-xl transition duration-300 shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] active:scale-95 cursor-pointer uppercase tracking-wider text-sm mt-2 flex items-center justify-center gap-2"
                >
                  Submit Departure
                </button>
                <div className="text-xs text-slate-500 text-center mt-3 font-medium">
                  Your report will instantly appear on the dashboard.
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
