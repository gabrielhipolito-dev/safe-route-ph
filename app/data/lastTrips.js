const now = new Date();
const currentH = now.getHours();

function createTimeStr(h, m) {
  let adjustedH = (h + 24) % 24;
  const ampm = adjustedH >= 12 ? 'PM' : 'AM';
  adjustedH = adjustedH % 12;
  adjustedH = adjustedH ? adjustedH : 12;
  return `${adjustedH}:${m < 10 ? '0' + m : m} ${ampm}`;
}

export const lastTrips = [
  {
    id: 1,
    route: "Adamson to Kalaw",
    vehicleEmoji: "🛺",
    vehicleType: "Tricycle",
    statusText: "STILL RUNNING",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    time: createTimeStr(currentH + 1, 0),
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
    statusText: "STILL RUNNING",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    time: createTimeStr(currentH + 2, 30),
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
    time: createTimeStr(currentH - 1, 15),
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
    time: createTimeStr(currentH + 3, 45),
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
    statusText: "STILL RUNNING",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    time: createTimeStr(currentH + 1, 30),
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
    time: createTimeStr(currentH + 2, 0),
    operatingDays: "Mon - Fri",
    subtext: "One Ayala Terminal",
    subtextColor: "text-slate-500 text-xs mt-1 font-medium tracking-wide",
    vouched: 18,
    disputed: 0,
    hasConfirmButton: true
  }
];
