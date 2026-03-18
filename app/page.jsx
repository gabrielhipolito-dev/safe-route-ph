'use client'

export default function Home() {
  return (
    <div>
      <section style={{
        backgroundColor: '#0B1F3A',
        color: 'white',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 16px' }}>
          Find Your Safest Way Home
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '32px' }}>
          Student-verified commute routes, safety ratings, and real-time updates
        </p>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '14px',
          padding: '24px',
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <input
            placeholder="From (your school)"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '1rem'
            }}
          />
          <input
            placeholder="To (your destination)"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '1rem'
            }}
          />
          <button style={{
            backgroundColor: '#1D4ED8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            Search Routes
          </button>
        </div>
      </section>

      <section style={{
        padding: '64px 24px',
        display: 'flex',
        gap: '24px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {[
          { icon: '📍', title: 'Route Finder', desc: 'Step-by-step jeepney and UV Express guides' },
          { icon: '🛡️', title: 'Safety Ratings', desc: 'Day and night safety scores from students' },
          { icon: '⏰', title: 'Last Trip Tracker', desc: 'Community-reported last departure times' },
        ].map(card => (
          <div key={card.title} style={{
            backgroundColor: 'white',
            border: '1px solid #E6ECF4',
            borderRadius: '14px',
            padding: '24px',
            width: '280px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{card.icon}</div>
            <h3 style={{ color: '#0B1F3A', marginBottom: '8px' }}>{card.title}</h3>
            <p style={{ color: '#555', fontSize: '0.95rem' }}>{card.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}