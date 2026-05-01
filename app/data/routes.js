const normalize = (value) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()

export const routeFareData = [
	{
		id: 'adamson-to-upd',
		from: 'Adamson University',
		to: 'University of the Philippines Diliman',
		aliases: {
			from: ['adamson university', 'adamson'],
			to: ['university of the philippines diliman', 'up diliman', 'upd'],
		},
		verification: {
			matrixYear: '2026',
			lastConfirmed: 'Today, 09:20 AM',
			reports: 27,
		},
		updatedAt: 'May 1, 2026',
		legs: [
			{
				title: 'Adamson University -> LRT-1 station',
				mode: 'Jeep / short transfer ride',
				regularMin: 13,
				regularMax: 20,
				studentMin: 11,
				studentMax: 18,
				note: 'Short city transfer to access the nearest LRT-1 segment.',
			},
			{
				title: 'LRT-1 transfer to LRT-2 (Recto corridor)',
				mode: 'Rail transfer',
				regularMin: 20,
				regularMax: 28,
				studentMin: 16,
				studentMax: 24,
				note: 'Fare follows the current urban rail matrix based on exact station pair.',
			},
			{
				title: 'LRT-2 Katipunan -> UP Diliman campus',
				mode: 'Jeep / campus loop',
				regularMin: 6.5,
				regularMax: 15,
				studentMin: 6.5,
				studentMax: 13,
				note: 'Final leg into campus using Katipunan-side jeep routes.',
			},
		],
	},
	{
		id: 'ust-to-sm-manila',
		from: 'University of Santo Tomas',
		to: 'SM Manila',
		aliases: {
			from: ['university of santo tomas', 'ust'],
			to: ['sm manila'],
		},
		verification: {
			matrixYear: '2026',
			lastConfirmed: 'Apr 29, 2026',
			reports: 14,
		},
		updatedAt: 'Apr 29, 2026',
		legs: [
			{
				title: 'UST -> SM Manila direct ride',
				mode: 'Jeepney',
				regularMin: 13,
				regularMax: 15,
				studentMin: 10.5,
				studentMax: 12,
				note: 'Direct route available on common Manila jeep corridors.',
			},
		],
	},
	{
		id: 'dlsu-to-lawton',
		from: 'De La Salle University',
		to: 'Lawton Terminal',
		aliases: {
			from: ['de la salle university', 'dlsu manila', 'dlsu'],
			to: ['lawton terminal', 'lawton'],
		},
		verification: {
			matrixYear: '2026',
			lastConfirmed: 'Apr 28, 2026',
			reports: 11,
		},
		updatedAt: 'Apr 28, 2026',
		legs: [
			{
				title: 'DLSU -> Lawton corridor',
				mode: 'Bus / jeep transfer',
				regularMin: 15,
				regularMax: 25,
				studentMin: 12,
				studentMax: 20,
				note: 'Travel time and fare range vary by route congestion.',
			},
		],
	},
]

export const getRouteFareTotals = (route) => {
	const regularMin = route.legs.reduce((sum, leg) => sum + leg.regularMin, 0)
	const regularMax = route.legs.reduce((sum, leg) => sum + leg.regularMax, 0)
	const studentMin = route.legs.reduce((sum, leg) => sum + leg.studentMin, 0)
	const studentMax = route.legs.reduce((sum, leg) => sum + leg.studentMax, 0)

	return {
		regularMin,
		regularMax,
		studentMin,
		studentMax,
	}
}

export const findRouteFareData = (from, to) => {
	const fromKey = normalize(from)
	const toKey = normalize(to)

	return (
		routeFareData.find((route) => {
			const fromAliases = route.aliases.from.map(normalize)
			const toAliases = route.aliases.to.map(normalize)
			return fromAliases.includes(fromKey) && toAliases.includes(toKey)
		}) ?? null
	)
}
