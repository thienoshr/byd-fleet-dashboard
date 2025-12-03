'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NotificationCenter from './NotificationCenter'
import QuickSearch from './QuickSearch'

/**
 * Navigation component for the dashboard
 * Provides responsive navigation between all pages
 */
export default function Navigation() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Navigation links - arranged in logical fleet management flow
  // Note: Dashboard is accessible via the "BYD Fleet Dashboard" logo/brand link
  const navLinks = [
    { href: '/operations', label: 'Operations' },
    { href: '/agreements', label: 'Agreements' },
    { href: '/suppliers', label: 'Suppliers' },
    { href: '/financial', label: 'Financial' },
    { href: '/documents', label: 'Documents' },
    { href: '/reports', label: 'Reports & Analytics' },
    { href: '/communications', label: 'Communications' },
  ]

  return (
    <nav className="bg-byd-dark shadow-lg relative z-[9999]" style={{ pointerEvents: 'auto' }}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3 hover:bg-transparent z-[10000] relative">
              <span className="text-2xl font-bold text-white">BYD</span>
              <span className="text-xl font-medium text-white">Fleet Dashboard</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-2 items-center flex-1 justify-end">
            {/* Navigation links */}
            <div className={`flex gap-2 items-center transition-all duration-300 ease-in-out overflow-hidden ${
              isSearchOpen ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-full opacity-100 pointer-events-auto'
            }`}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors z-[10000] relative whitespace-nowrap ${
                      isActive
                        ? 'bg-byd-primary text-white'
                        : 'text-gray-300 hover:bg-byd-hover hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
            {/* Quick Search - Dropdown */}
            <div className="z-[10000] relative flex-shrink-0 ml-2">
              <QuickSearch onStateChange={setIsSearchOpen} />
            </div>
            {/* Notification Center */}
            <div className="z-[10000] relative flex-shrink-0">
              <NotificationCenter />
            </div>
            {/* Settings Icon */}
            <div className="z-[10000] relative flex-shrink-0">
              <Link
                href="/settings"
                className="flex items-center justify-center p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Settings"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-white hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu (simplified - can be enhanced with state management) */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium z-[10000] relative ${
                    isActive
                      ? 'text-white underline decoration-2 underline-offset-4'
                      : 'text-white hover:text-white hover:underline hover:decoration-2 hover:underline-offset-4'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            {/* Settings for Mobile */}
            <Link
              href="/settings"
              className="px-3 py-2 text-sm font-medium text-white hover:text-white hover:underline hover:decoration-2 hover:underline-offset-4 z-[10000] relative"
            >
              Settings
            </Link>
            {/* Notification Center for Mobile */}
            <div className="px-3 py-2 z-[10000] relative">
              <NotificationCenter />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
