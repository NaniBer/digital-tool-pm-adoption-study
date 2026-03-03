# Shadcn UI + Animate UI Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the dashboard from framer-motion custom animations to use shadcn/ui components with Animate UI for animations.

**Architecture:** Replace framer-motion-based animations with Animate UI components that work with Radix UI (shadcn/ui primitives). Keep the dark theme, typography, and overall design intact. Use Tailwind CSS with @theme inline for dark theme variables.

**Tech Stack:** Next.js 16+, TypeScript, Tailwind CSS v4, shadcn/ui, Animate UI, Recharts

---

## Task 1: Initialize shadcn/ui

**Files:**
- Create: `components.json` (shadcn config)
- Create: `components/ui/` directory
- Create: `lib/utils.ts` (cn utility)

**Step 1: Initialize shadcn/ui**

Run: `npx shadcn@latest init`

When prompted:
- Which style? Default
- Which color? Slate
- Use CSS variables? Yes
- Would you like to use TypeScript? Yes

**Step 2: Verify structure created**

Run: `ls -la components.json lib/ components/ui/`
Expected: All three exist with config file and utils.ts

**Step 3: Commit**

```bash
git add components.json lib/utils.ts components/ui/
git commit -m "feat: initialize shadcn/ui"
```

---

## Task 2: Install Animate UI

**Files:**
- Modify: `package.json`

**Step 1: Install Animate UI**

Run: `npm install @animate-ui/react framer-motion --save`

Note: Animate UI requires framer-motion as a peer dependency but we won't use it directly.

**Step 2: Verify installation**

Run: `npm list @animate-ui/react framer-motion`
Expected: Both packages listed in dependencies

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install Animate UI"
```

---

## Task 3: Remove old framer-motion usage from app/page.tsx

**Files:**
- Modify: `app/page.tsx`

**Step 1: Replace motion.div with Animate UI Fade component**

Remove `'use client'` directive and framer-motion import. The page will be a server component now.

Update file:

```typescript
import Link from 'next/link'
import { Fade } from '@animate-ui/react'

export default function HomePage() {
  return (
    <Fade direction="up" duration={600}>
      <div className="mx-auto max-w-7xl px-6 py-20">
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
                <Fade key={link.href} delay={100} duration={400}>
                  <Link
                    href={link.href}
                    className="card-hover block rounded-xl border border-border bg-background-card p-6 transition-all"
                  >
                    <h3 className="font-serif text-xl font-semibold text-accent-primary mb-2">
                      {link.title}
                    </h3>
                    <p className="text-foreground-secondary">{link.desc}</p>
                  </Link>
                </Fade>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Fade>
  )
}
```

**Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "refactor: replace framer-motion with Animate UI in home page"
```

---

## Task 4: Update app/dashboard/page.tsx to use Animate UI

**Files:**
- Modify: `app/dashboard/page.tsx`

**Step 1: Replace framer-motion imports with Animate UI**

Remove framer-motion import, add Animate UI imports. Keep recharts imports.

Update imports:

```typescript
'use client'

import { Fade, Stagger, StaggerItem } from '@animate-ui/react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
```

**Step 2: Replace motion.div wrapper with Fade component**

Replace the outer wrapper and staggered sections with Animate UI components.

Update file:

```typescript
'use client'

import { Fade, Stagger, StaggerItem } from '@animate-ui/react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'

// Mock questionnaire data - keep existing data
const mockData = {
  adoptionByIndustry: [
    { industry: 'Technology', adoption: 85 },
    { industry: 'Finance', adoption: 72 },
    { industry: 'Healthcare', adoption: 58 },
    { industry: 'Manufacturing', adoption: 45 },
    { industry: 'Education', adoption: 38 },
  ],
  toolPreferences: [
    { name: 'Jira', value: 35 },
    { name: 'Asana', value: 25 },
    { name: 'Monday.com', value: 20 },
    { name: 'Trello', value: 12 },
    { name: 'Other', value: 8 },
  ],
  adoptionTrend: [
    { year: '2019', value: 42 },
    { year: '2020', value: 55 },
    { year: '2021', value: 68 },
    { year: '2022', value: 79 },
    { year: '2023', value: 87 },
  ],
  keyMetrics: [
    { label: 'Total Respondents', value: '2,847' },
    { label: 'Organizations Surveyed', value: '342' },
    { label: 'Countries', value: '28' },
    { label: 'Avg. Adoption Rate', value: '67%' },
  ],
}

const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE']

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Fade direction="up" duration={600}>
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="space-y-4">
            <h1 className="font-serif text-5xl font-bold text-foreground">
              Research Dashboard
            </h1>
            <p className="text-lg text-foreground-secondary max-w-3xl">
              Explore findings from our comprehensive study on digital project management
              adoption across industries. Interactive visualizations reveal key patterns and insights.
            </p>
          </div>
        </section>
      </Fade>

      {/* Key Metrics */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <Stagger delay={100} duration={400}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockData.keyMetrics.map((metric) => (
              <StaggerItem key={metric.label}>
                <Fade direction="up" duration={400}>
                  <div className="card-hover rounded-xl border border-border bg-background-card p-6">
                    <p className="text-sm font-medium text-foreground-secondary">{metric.label}</p>
                    <p className="mt-2 text-3xl font-bold gradient-text">{metric.value}</p>
                  </div>
                </Fade>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </section>

      {/* Charts Grid */}
      <Fade delay={300} duration={600}>
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Adoption by Industry - Bar Chart */}
            <Fade delay={400} duration={500}>
              <div className="card-hover rounded-xl border border-border bg-background-card p-6">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
                  Adoption by Industry
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockData.adoptionByIndustry}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis
                        dataKey="industry"
                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                        axisLine={{ stroke: '#27272a' }}
                      />
                      <YAxis
                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                        axisLine={{ stroke: '#27272a' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: '1px solid #27272a',
                          borderRadius: '8px',
                          color: '#f4f4f5'
                        }}
                      />
                      <Bar dataKey="adoption" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Fade>

            {/* Tool Preferences - Pie Chart */}
            <Fade delay={500} duration={500}>
              <div className="card-hover rounded-xl border border-border bg-background-card p-6">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
                  Tool Preferences
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockData.toolPreferences}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockData.toolPreferences.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: '1px solid #27272a',
                          borderRadius: '8px',
                          color: '#f4f4f5'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Fade>

            {/* Adoption Trend - Line Chart */}
            <Fade delay={600} duration={500}>
              <div className="card-hover rounded-xl border border-border bg-background-card p-6 lg:col-span-2">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
                  Digital PM Adoption Trend (2019-2023)
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData.adoptionTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis
                        dataKey="year"
                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                        axisLine={{ stroke: '#27272a' }}
                      />
                      <YAxis
                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                        axisLine={{ stroke: '#27272a' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: '1px solid #27272a',
                          borderRadius: '8px',
                          color: '#f4f4f5'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Fade>

          </div>
        </section>
      </Fade>

      {/* Key Findings Section */}
      <Fade delay={700} duration={600}>
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="rounded-xl border border-border bg-background-card p-8">
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Key Findings
            </h3>
            <div className="space-y-4 text-foreground-secondary">
              <div className="flex items-start space-x-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent-primary flex-shrink-0" />
                <p>
                  <strong className="text-foreground">Technology sector leads adoption</strong> at 85%,
                  followed by Finance at 72%.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent-primary flex-shrink-0" />
                <p>
                  <strong className="text-foreground">Jira is the preferred tool</strong> with 35%
                  of respondents, followed by Asana at 25%.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent-primary flex-shrink-0" />
                <p>
                  <strong className="text-foreground">Rapid growth observed</strong> from 2019 to 2023,
                  with adoption rates increasing by over 100%.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent-primary flex-shrink-0" />
                <p>
                  <strong className="text-foreground">Average adoption rate</strong> across all
                  surveyed organizations stands at 67%.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Fade>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "refactor: replace framer-motion with Animate UI in dashboard"
```

---

## Task 5: Verify build and test

**Files:**
- Test: Build verification

**Step 1: Remove framer-motion from package.json (optional peer dependency for Animate UI)**

Note: Animate UI requires framer-motion as a peer dependency. We can keep it installed but not use it directly, or remove if Animate UI works without it.

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 3: Start dev server**

Run: `npm run dev`
Expected: Dev server starts successfully

**Step 4: Test navigation**

Open http://localhost:3000 and http://localhost:3000/dashboard
Expected: Pages render with animations working

**Step 5: Stop dev server**

Press Ctrl+C

**Step 6: Commit**

```bash
git commit --allow-empty -m "test: verify build and functionality with Animate UI"
```

---

## Verification

After completing all tasks, verify:

1. **shadcn/ui initialized:**
   - `components.json` exists with configuration
   - `components/ui/` directory created
   - `lib/utils.ts` exists with `cn` utility

2. **Animate UI installed:**
   - `@animate-ui/react` in package.json dependencies
   - `framer-motion` in package.json (peer dependency)

3. **Home page works:**
   - Server component (no 'use client')
   - Fade animation from Animate UI works
   - Dark theme styling intact

4. **Dashboard page works:**
   - Client component with 'use client'
   - Fade and Stagger animations from Animate UI work
   - All charts render correctly with recharts
   - Dark theme styling intact

5. **Build passes:**
   - No TypeScript errors
   - No build errors

6. **Remove old worktree:**

```bash
git worktree list
git worktree remove .worktrees/dark-theme-dashboard
```

---

## Critical Files Summary

| File | Purpose |
|------|---------|
| `components.json` | shadcn/ui configuration |
| `lib/utils.ts` | cn utility for className merging |
| `components/ui/` | shadcn/ui components directory |
| `app/page.tsx` | Home page with Animate UI Fade |
| `app/dashboard/page.tsx` | Dashboard with Animate UI Fade, Stagger |
| `package.json` | Dependencies: @animate-ui/react, recharts |
