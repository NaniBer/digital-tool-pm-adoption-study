'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Methodology', path: '/methodology' },
    { name: 'Findings', path: '/findings' },
    { name: 'Dashboard', path: '/dashboard' },
  ]

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Digital PM Adoption Study
          </Link>
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.path
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
