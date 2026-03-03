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
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif text-foreground">
            Digital PM Adoption Study
          </Link>
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`text-sm font-medium transition-colors relative ${
                    pathname === item.path
                      ? 'text-accent-primary'
                      : 'text-foreground-secondary hover:text-accent-primary'
                  }`}
                >
                  {item.name}
                  {pathname === item.path && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-primary rounded-full" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
