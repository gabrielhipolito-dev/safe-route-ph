'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/safety', label: 'Safety Reports' },
  { href: '/fares', label: 'Fare Calculator' },
  { href: '/last-trip', label: 'Last Trip' },
  { href: '/first-timer', label: 'First Timer' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" onClick={() => setMenuOpen(false)} className="group flex items-center gap-3 shrink-0">
          <img 
            src="/icon.png" 
            alt="UniWolfe Route" 
            className="h-11 w-11 rounded-2xl object-cover shadow-[0_12px_28px_rgba(52,211,153,0.3)] transition-transform duration-300 group-hover:scale-105 border border-white/10"
          />
          <span className="flex flex-col leading-none">
            <span className="text-base font-black tracking-tight text-white sm:text-lg group-hover:text-emerald-400 transition-colors uppercase">
              UniWolfe Route
            </span>
            <span className="text-xs text-slate-400 sm:text-sm font-medium">
              Student commute intelligence
            </span>
          </span>
        </Link>

        {/* Dynamic AI-Dashboard Navigation alignment */}
        <div className="hidden items-center gap-1.5 md:flex">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-3.5 py-2 text-sm font-black uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 ${
                  isActive
                    ? 'bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 shadow-[0_8px_24px_rgba(52,211,153,0.14)]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <>
                  <path d="m6 6 12 12" />
                  <path d="m18 6-12 12" />
                </>
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div id="mobile-navigation" className={`mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8 md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
        <div className="grid gap-2 rounded-3xl border border-white/10 bg-white/5 p-3 shadow-[0_18px_40px_rgba(2,6,23,0.35)] backdrop-blur-md">
          <div className="grid gap-1">
            <p className="px-2 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-400">
              Navigate
            </p>
            <p className="px-2 text-sm text-slate-400">
              Jump to the core commute tools.
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
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300'
                      : 'border border-white/10 bg-slate-950/40 text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>→</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[-1] bg-slate-950/30 md:hidden"
          aria-label="Close menu overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  )
}