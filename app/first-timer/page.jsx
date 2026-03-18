'use client'

const FIRST_TIMER_TIPS = [
  {
    id: 'flag-jeepney',
    icon: '✋',
    title: 'How to Flag a Jeepney',
    description:
      'Stand near the curb and raise your hand slightly. Make eye contact with the driver. If there is space they will slow down.',
  },
  {
    id: 'boundary-meaning',
    icon: '💲',
    title: 'What is a Boundary',
    description:
      'Some drivers ask Hanggang saan meaning How far. Just say your destination clearly.',
  },
  {
    id: 'pay-fare',
    icon: '💵',
    title: 'How to Pay the Fare',
    description:
      'Pass your fare to the driver through other passengers. Say bayad po when passing money.',
  },
  {
    id: 'say-para-po',
    icon: '🛑',
    title: 'How to say Para Po',
    description:
      'When you are near your stop say Para po clearly so the driver hears you and stops.',
  },
  {
    id: 'wrong-vehicle',
    icon: '⚠️',
    title: 'Wrong Vehicle',
    description:
      'Stay calm. Ride until the next safe well lit stop. Get off and find the correct jeepney.',
  },
  {
    id: 'night-safety',
    icon: '🌙',
    title: 'Night Safety',
    description:
      'Commute in groups when possible. Sit near other passengers. Avoid isolated waiting areas after 9PM.',
  },
]

const styles = {
  heroSection: {
    backgroundColor: '#0B1F3A',
    color: 'white',
    padding: '64px 24px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 800,
    marginBottom: '16px',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  contentSection: {
    padding: '48px 24px',
    backgroundColor: '#F5F7FB',
  },
  cardsGrid: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'white',
    border: '1px solid #E6ECF4',
    borderRadius: '14px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  cardIcon: {
    fontSize: '2rem',
    marginBottom: '12px',
  },
  cardTitle: {
    color: '#0B1F3A',
    marginBottom: '8px',
    fontSize: '1.1rem',
  },
  cardDescription: {
    color: '#555',
    fontSize: '0.95rem',
    lineHeight: 1.6,
  },
}

export default function FirstTimerGuide() {
  return (
    <div>
      <section style={styles.heroSection}>
        <h1 style={styles.heroTitle}>
          New to commuting in Manila? We got you.
        </h1>
        <p style={styles.heroSubtitle}>
          Your fellow students share everything you need to know about navigating Manila public transport
        </p>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.cardsGrid}>
          {FIRST_TIMER_TIPS.map((tip) => (
            <div key={tip.id} style={styles.card}>
              <div style={styles.cardIcon}>{tip.icon}</div>
              <h3 style={styles.cardTitle}>{tip.title}</h3>
              <p style={styles.cardDescription}>{tip.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}