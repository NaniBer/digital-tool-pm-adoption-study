'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-7xl px-6 py-20"
    >
      <div className="space-y-12">
        <section className="space-y-6">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground">
            Digital Project Management
            <span className="gradient-text"> Adoption Study</span>
          </h1>
          <p className="text-foreground-secondary max-w-3xl leading-relaxed">
            Understanding how organizations adopt and implement digital project management tools and practices.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-serif text-3xl font-semibold text-foreground">
            Abstract
          </h2>
          <p className="text-foreground-secondary max-w-3xl leading-relaxed">
            This study examines adoption patterns of digital project management tools across various industries.
            Through quantitative analysis of survey responses, we identify key factors influencing adoption decisions
            and their impact on project success.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-serif text-3xl font-semibold text-foreground">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { href: '/about', title: 'About the Research', desc: 'Background and objectives' },
              { href: '/methodology', title: 'Methodology', desc: 'Research design and data collection' },
              { href: '/findings', title: 'Findings', desc: 'Key results and analysis' },
              { href: '/dashboard', title: 'Dashboard', desc: 'Interactive data exploration' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="card-hover block rounded-xl border border-border bg-background-card p-6 transition-all"
              >
                <h3 className="font-serif text-xl font-semibold text-accent-primary mb-2">
                  {link.title}
                </h3>
                <p className="text-foreground-secondary">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  )
}
