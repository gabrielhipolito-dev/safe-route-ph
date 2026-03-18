'use client'
import Link from 'next/link'

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
      <Link href="/" style={{
        color: 'white',
        fontWeight: 700,
        fontSize: '1.2rem',
        textDecoration: 'none'
      }}>
        SafeRoute PH
      </Link>

      <div style={{ display: 'flex', gap: '24px' }}>
        <Link href="/route-result" style={{ color: 'white', textDecoration: 'none' }}>Routes</Link>
        <Link href="/safety" style={{ color: 'white', textDecoration: 'none' }}>Safety</Link>
        <Link href="/fares" style={{ color: 'white', textDecoration: 'none' }}>Fares</Link>
        <Link href="/first-timer" style={{ color: 'white', textDecoration: 'none' }}>First Timer Guide</Link>
      </div>
    </nav>
  )
}