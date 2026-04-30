'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Routes' },
  { href: '/safety', label: 'Safety' },
  { href: '/fares', label: 'Fares' },
  { href: '/last-trip', label: 'Last Trip' },
  { href: '/first-timer', label: 'First Timer' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-slate-950/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#6EE7FF,#3B82F6)] text-sm font-black tracking-tight text-slate-950 shadow-[0_12px_30px_rgba(59,130,246,0.35)] transition-transform duration-300 group-hover:scale-105">
            SR
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-semibold tracking-tight text-white sm:text-lg">
              SafeRoute PH
            </span>
            <span className="text-xs text-slate-400 sm:text-sm">
              Student commute intelligence
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 xl:flex">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-[0_10px_24px_rgba(255,255,255,0.12)]'
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      <div id="mobile-navigation" className={`mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8 xl:hidden ${menuOpen ? 'block' : 'hidden'}`}>
        <div className="grid gap-2 rounded-3xl border border-white/10 bg-white/5 p-3 shadow-[0_18px_40px_rgba(2,6,23,0.35)]">
          <div className="grid gap-1">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Navigate
            </p>
            <p className="px-2 text-sm text-slate-300">
              Jump to the core tools or open the route search.
            </p>
          </div>

          <div className="grid gap-2">
            {navItems.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-slate-950'
                      : 'border border-white/10 bg-slate-950/40 text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={isActive ? 'text-slate-500' : 'text-slate-400'}>→</span>
                </Link>
              )
            })}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl bg-cyan-400 px-4 py-3 text-center text-sm font-semibold text-slate-950 shadow-[0_12px_28px_rgba(34,211,238,0.22)] transition-transform hover:scale-[1.01] sm:col-span-2"
            >
              Search route
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}