'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="flex h-16 items-center justify-between bg-[#0B1F3A] px-4 sm:px-8">
      <Link href="/" className="text-xl font-bold tracking-tight text-white">
        SafeRoute PH
      </Link>

      <div className="flex items-center gap-4 text-sm text-white sm:gap-6 sm:text-base">
        <Link href="/route-result" className="transition-opacity hover:opacity-80">Routes</Link>
        <Link href="/safety" className="transition-opacity hover:opacity-80">Safety</Link>
        <Link href="/fares" className="transition-opacity hover:opacity-80">Fares</Link>
        <Link href="/first-timer" className="transition-opacity hover:opacity-80">First Timer Guide</Link>
      </div>
    </nav>
  )
}