'use client'

export default function Navbar() {
  return (
    <nav style={{
      backgroundColor: '#0B1F3A',
      padding: '0 32px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <span style={{
        color: 'white',
        fontWeight: 700,
        fontSize: '1.2rem'
      }}>
        SafeRoute PH
      </span>
      <div style={{ display: 'flex', gap: '24px' }}>
        {['Routes', 'Safety', 'Fares', 'First Timer Guide'].map(link => (
          <a key={link} href="#" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.95rem'
          }}>
            {link}
          </a>
        ))}
      </div>
    </nav>
  )
}