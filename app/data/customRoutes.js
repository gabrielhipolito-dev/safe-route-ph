export const initialFareRows = [
  {
    route: 'Adamson University → UP Diliman',
    mode: 'LRT-1 → LRT-2 → jeep route',
    regular: '₱55.00',
    student: '₱44.00',
    updated: 'Apr 30, 2026',
    status: 'Student verified',
    likes: 24,
    breakdown: [
      'Adamson → closest LRT-1 access point: ₱13–20',
      'LRT-1 to Recto, transfer to LRT-2, then Katipunan: rail fare matrix',
      'Katipunan → UP Diliman campus jeep: ₱6.50–15',
    ],
  },
  {
    route: 'UST → SM Manila',
    mode: 'Jeepney + walk',
    regular: '₱14.00',
    student: '₱11.20',
    updated: 'Apr 28, 2026',
    status: 'Recently changed',
    likes: 18,
    breakdown: ['Direct jeepney fare: ₱13.00', 'Student discounted fare: ₱10.50'],
  },
  {
    route: 'DLSU → Lawton Terminal',
    mode: 'Jeepney / bus transfer',
    regular: '₱25.00',
    student: '₱20.00',
    updated: 'Apr 26, 2026',
    status: 'Stable',
    likes: 12,
    breakdown: ['Main leg fare: ₱15.00–₱25.00', 'Discounted range based on operator'],
  },
];

export const modeFilters = ['All Modes', 'Jeepney', 'Bus', 'LRT/MRT', 'Multi-leg'];
