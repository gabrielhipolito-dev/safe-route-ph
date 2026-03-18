'use client'

const fareGuide = [
	{ ride: 'Jeepney', regular: 'PHP 13 - 18', student: 'PHP 11 - 16' },
	{ ride: 'UV Express', regular: 'PHP 25 - 45', student: 'PHP 22 - 40' },
	{ ride: 'Bus', regular: 'PHP 15 - 40', student: 'PHP 13 - 35' },
]

export default function FaresPage() {
	return (
		<section style={{ padding: '40px 24px', maxWidth: '980px', margin: '0 auto' }}>
			<h1 style={{ color: '#0B1F3A', fontSize: '2rem', marginBottom: '8px' }}>
				Basic Fare Information
			</h1>
			<p style={{ color: '#4B5563', marginBottom: '24px', lineHeight: 1.6 }}>
				These are estimated fares for common transport options around Metro Manila.
				Actual costs may vary by route, distance, time, and operator policy.
			</p>

			<div style={{ display: 'grid', gap: '16px' }}>
				{fareGuide.map((item) => (
					<article
						key={item.ride}
						style={{
							border: '1px solid #E5E7EB',
							borderRadius: '12px',
							padding: '16px 18px',
							backgroundColor: '#FFFFFF',
							boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
						}}
					>
						<h2 style={{ color: '#0B1F3A', fontSize: '1.15rem', marginBottom: '10px' }}>
							{item.ride}
						</h2>
						<p style={{ margin: '0 0 6px', color: '#1F2937' }}>
							Regular Fare: <strong>{item.regular}</strong>
						</p>
						<p style={{ margin: 0, color: '#1F2937' }}>
							Student Fare: <strong>{item.student}</strong>
						</p>
					</article>
				))}
			</div>

			<div
				style={{
					marginTop: '28px',
					borderLeft: '4px solid #1D4ED8',
					padding: '12px 16px',
					backgroundColor: '#EFF6FF',
					color: '#1E3A8A',
					borderRadius: '8px'
				}}
			>
				Tip: Bring your valid school ID to ask for student discount when available.
			</div>
		</section>
	)
}
