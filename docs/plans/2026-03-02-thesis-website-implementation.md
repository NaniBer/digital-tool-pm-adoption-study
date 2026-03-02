# Thesis Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Next.js-based thesis website with MDX content, spreadsheet data integration, and interactive charts for a Digital Project Management adoption study.

**Architecture:** Static site generation with Next.js App Router, MDX for thesis content, build-time data fetching from Google Sheets, and React chart components for visualization.

**Tech Stack:** Next.js 14+, TypeScript, MDX, Tailwind CSS, Recharts, Jest, React Testing Library

---

### Task 1: Initialize Next.js project with TypeScript and Tailwind

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

**Step 1: Initialize Next.js project**

Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm`
Expected: Next.js files created in current directory

**Step 2: Verify project structure**

Run: `ls -la`
Expected: You should see `app/`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, etc.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js project with TypeScript and Tailwind"
```

---

### Task 2: Install and configure MDX support

**Files:**
- Modify: `next.config.mjs`
- Create: `mdx.config.ts`
- Modify: `package.json`

**Step 1: Install MDX dependencies**

Run: `npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx --save`
Expected: Packages installed successfully

**Step 2: Create MDX configuration**

Create file: `mdx.config.ts`

```typescript
import type { MDXComponents } from 'mdx/types'
import { ChartWrapper } from '@/app/components/ChartWrapper'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ChartWrapper,
  }
}
```

**Step 3: Configure Next.js for MDX**

Modify: `next.config.mjs`

```javascript
import createMDX from '@next/mdx-rsc'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // existing config
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
```

**Step 4: Add MDX to tsconfig**

Modify: `tsconfig.json` - add to `"include"` array:
```json
"include": ["next-env.d.ts", "**/*.mdx", "**/*.ts", "**/*.tsx"]
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add MDX support for thesis content"
```

---

### Task 3: Create basic layout and navigation

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/components/Navigation.tsx`
- Create: `app/components/Footer.tsx`

**Step 1: Create Navigation component**

Create file: `app/components/Navigation.tsx`

```typescript
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
```

**Step 2: Create Footer component**

Create file: `app/components/Footer.tsx`

```typescript
export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Digital PM Adoption Study. All rights reserved.</p>
      </div>
    </footer>
  )
}
```

**Step 3: Update layout to include Navigation and Footer**

Modify: `app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Digital PM Adoption Study',
  description: 'Thesis dashboard for Digital Project Management adoption research',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add navigation and footer components"
```

---

### Task 4: Create home page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Create home page content**

Modify: `app/page.tsx`

```typescript
export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="space-y-8">
        <section>
          <h1 className="text-4xl font-bold text-gray-900">
            Digital Project Management Adoption Study
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Understanding how organizations adopt and implement digital project management tools and practices.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">Abstract</h2>
          <p className="mt-2 text-gray-700">
            This study examines the adoption patterns of digital project management tools across various industries.
            Through quantitative analysis of survey responses, we identify key factors influencing adoption decisions
            and their impact on project success.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">Quick Links</h2>
          <ul className="mt-2 space-y-2 text-gray-700">
            <li>• <a href="/about" className="text-blue-600 hover:underline">About the Research</a> - Background and objectives</li>
            <li>• <a href="/methodology" className="text-blue-600 hover:underline">Methodology</a> - Research design and data collection</li>
            <li>• <a href="/findings" className="text-blue-600 hover:underline">Findings</a> - Key results and analysis</li>
            <li>• <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a> - Interactive data exploration</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
```

**Step 2: Test dev server**

Run: `npm run dev`
Expected: Server starts at http://localhost:3000
Verify: Open browser and check home page renders correctly

**Step 3: Stop dev server**

Run: Press Ctrl+C

**Step 4: Commit**

```bash
git add .
git commit -m "feat: create home page"
```

---

### Task 5: Create placeholder content pages

**Files:**
- Create: `app/about/page.tsx`
- Create: `app/methodology/page.tsx`
- Create: `app/findings/page.tsx`

**Step 1: Create About page**

Create file: `app/about/page.tsx`

```typescript
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900">About the Research</h1>
      <p className="mt-4 text-gray-600">
        Content coming soon...
      </p>
    </div>
  )
}
```

**Step 2: Create Methodology page**

Create file: `app/methodology/page.tsx`

```typescript
export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900">Methodology</h1>
      <p className="mt-4 text-gray-600">
        Content coming soon...
      </p>
    </div>
  )
}
```

**Step 3: Create Findings page**

Create file: `app/findings/page.tsx`

```typescript
export default function FindingsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900">Findings</h1>
      <p className="mt-4 text-gray-600">
        Content coming soon...
      </p>
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: create placeholder content pages"
```

---

### Task 6: Install charting library and create ChartWrapper component

**Files:**
- Modify: `package.json`
- Create: `app/components/ChartWrapper.tsx`

**Step 1: Install Recharts**

Run: `npm install recharts --save`
Expected: Package installed successfully

**Step 2: Create ChartWrapper component**

Create file: `app/components/ChartWrapper.tsx`

```typescript
'use client'

interface ChartWrapperProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function ChartWrapper({ children, title, description }: ChartWrapperProps) {
  return (
    <div className="my-8 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {title && (
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      )}
      {description && (
        <p className="mb-4 text-sm text-gray-600">{description}</p>
      )}
      <div className="min-h-[300px]">
        {children}
      </div>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: install Recharts and create ChartWrapper component"
```

---

### Task 7: Create chart components (BarChart, PieChart)

**Files:**
- Create: `app/components/BarChart.tsx`
- Create: `app/components/PieChart.tsx`

**Step 1: Create BarChart component**

Create file: `app/components/BarChart.tsx`

```typescript
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface BarChartProps {
  data: Array<{ name: string; value: number }>
  dataKey?: string
  xAxisKey?: string
}

export function SimpleBarChart({ data, dataKey = 'value', xAxisKey = 'name' }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={dataKey} fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
```

**Step 2: Create PieChart component**

Create file: `app/components/PieChart.tsx`

```typescript
'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface PieChartProps {
  data: Array<{ name: string; value: number }>
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function SimplePieChart({ data }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: create BarChart and PieChart components"
```

---

### Task 8: Create data fetching utility and build script

**Files:**
- Create: `lib/sheet-fetcher.ts`
- Create: `scripts/fetch-data.ts`
- Modify: `package.json`

**Step 1: Install fetch dependencies**

Run: `npm install @googleapis/sheets dotenv --save`
Expected: Packages installed successfully

**Step 2: Create .env.example**

Create file: `.env.example`

```
GOOGLE_SHEETS_API_KEY=your_api_key_here
GOOGLE_SHEET_ID=your_sheet_id_here
```

**Step 3: Create .env.local**

Create file: `.env.local`

```
GOOGLE_SHEETS_API_KEY=
GOOGLE_SHEET_ID=
```

**Step 4: Create sheet fetcher utility**

Create file: `lib/sheet-fetcher.ts`

```typescript
import { google } from '@googleapis/sheets'

export interface SheetRow {
  [key: string]: string | number
}

export interface SheetData {
  headers: string[]
  rows: SheetRow[]
}

export async function fetchSheetData(
  apiKey: string,
  sheetId: string,
  range: string = 'Sheet1!A1:Z1000'
): Promise<SheetData> {
  const sheets = google.sheets({ version: 'v4', auth: apiKey })

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    })

    const values = response.data.values

    if (!values || values.length === 0) {
      return { headers: [], rows: [] }
    }

    const headers = values[0] as string[]
    const rows: SheetRow[] = []

    for (let i = 1; i < values.length; i++) {
      const row: SheetRow = {}
      headers.forEach((header, index) => {
        const value = values[i]?.[index]
        row[header] = value || ''
      })
      rows.push(row)
    }

    return { headers, rows }
  } catch (error) {
    console.error('Error fetching sheet data:', error)
    return { headers: [], rows: [] }
  }
}
```

**Step 5: Create fetch-data build script**

Create file: `scripts/fetch-data.ts`

```typescript
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { fetchSheetData } from '../lib/sheet-fetcher'

async function main() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY
  const sheetId = process.env.GOOGLE_SHEET_ID

  if (!apiKey || !sheetId) {
    console.warn('GOOGLE_SHEETS_API_KEY or GOOGLE_SHEET_ID not set. Using mock data.')
    const mockData = {
      responses: [],
      aggregations: {
        byIndustry: {},
        overall: { avgAdoptionScore: 0, totalResponses: 0 }
      },
      _meta: { source: 'mock', timestamp: new Date().toISOString() }
    }
    writeFileSync(
      join(__dirname, '../data/survey-responses.json'),
      JSON.stringify(mockData, null, 2)
    )
    return
  }

  const data = await fetchSheetData(apiKey, sheetId)

  // Create data directory if it doesn't exist
  mkdirSync(join(__dirname, '../data'), { recursive: true })

  const output = {
    responses: data.rows,
    aggregations: {
      byIndustry: {},
      overall: { avgAdoptionScore: 0, totalResponses: data.rows.length }
    },
    _meta: { source: 'google-sheets', timestamp: new Date().toISOString() }
  }

  // Calculate aggregations (basic example)
  const industryCounts: Record<string, { sum: number; count: number }> = {}
  let totalScore = 0
  let scoreCount = 0

  data.rows.forEach((row) => {
    if (typeof row.industry === 'string' && typeof row.adoptionScore === 'number') {
      if (!industryCounts[row.industry]) {
        industryCounts[row.industry] = { sum: 0, count: 0 }
      }
      industryCounts[row.industry].sum += row.adoptionScore
      industryCounts[row.industry].count++
      totalScore += row.adoptionScore
      scoreCount++
    }
  })

  Object.entries(industryCounts).forEach(([industry, data]) => {
    output.aggregations.byIndustry[industry] = {
      avg: Math.round((data.sum / data.count) * 10) / 10,
      count: data.count
    }
  })

  if (scoreCount > 0) {
    output.aggregations.overall.avgAdoptionScore = Math.round((totalScore / scoreCount) * 10) / 10
  }

  writeFileSync(
    join(__dirname, '../data/survey-responses.json'),
    JSON.stringify(output, null, 2)
  )

  console.log(`Fetched ${data.rows.length} rows from Google Sheets`)
}

main().catch(console.error)
```

**Step 6: Add script to package.json**

Modify: `package.json` - add to `"scripts"`:
```json
"scripts": {
  "dev": "next dev",
  "build": "npm run fetch-data && next build",
  "start": "next start",
  "lint": "next lint",
  "fetch-data": "tsx scripts/fetch-data.ts"
}
```

**Step 7: Install tsx for running TypeScript**

Run: `npm install tsx --save-dev`
Expected: Package installed successfully

**Step 8: Add data directory to .gitignore**

Create file: `.gitignore` (if it doesn't exist) or modify it:

```
# dependencies
/node_modules

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# data (generated from sheets)
/data/
```

**Step 9: Commit**

```bash
git add .
git commit -m "feat: add Google Sheets data fetching and build script"
```

---

### Task 9: Create Dashboard page with charts

**Files:**
- Create: `app/dashboard/page.tsx`

**Step 1: Create Dashboard page**

Create file: `app/dashboard/page.tsx`

```typescript
import { ChartWrapper } from '../components/ChartWrapper'
import { SimpleBarChart } from '../components/BarChart'
import { SimplePieChart } from '../components/PieChart'

// This would normally import from data file, using mock for now
const mockIndustryData = [
  { name: 'IT', value: 35 },
  { name: 'Finance', value: 25 },
  { name: 'Healthcare', value: 20 },
  { name: 'Manufacturing', value: 12 },
  { name: 'Other', value: 8 },
]

const mockAdoptionData = [
  { name: 'IT', value: 7.2 },
  { name: 'Finance', value: 5.8 },
  { name: 'Healthcare', value: 4.5 },
  { name: 'Manufacturing', value: 5.1 },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-4 text-lg text-gray-600">
        Explore the survey data through interactive visualizations.
      </p>

      <div className="mt-8 space-y-8">
        <ChartWrapper
          title="Responses by Industry"
          description="Distribution of survey respondents across different industries"
        >
          <SimplePieChart data={mockIndustryData} />
        </ChartWrapper>

        <ChartWrapper
          title="Average Adoption Score by Industry"
          description="Mean adoption scores (1-10 scale) across industries"
        >
          <SimpleBarChart data={mockAdoptionData} />
        </ChartWrapper>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">About This Data</h3>
          <p className="text-sm text-gray-600">
            This dashboard displays survey results from the Digital Project Management Adoption Study.
            Data is updated periodically as new responses are collected.
          </p>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Test the dashboard**

Run: `npm run dev`
Expected: Server starts at http://localhost:3000
Verify: Navigate to /dashboard and check charts render correctly

**Step 3: Stop dev server**

Run: Press Ctrl+C

**Step 4: Commit**

```bash
git add .
git commit -m "feat: create dashboard page with sample charts"
```

---

### Task 10: Add testing setup

**Files:**
- Create: `jest.config.js`
- Create: `jest.setup.js`
- Modify: `package.json`

**Step 1: Install testing dependencies**

Run: `npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom`
Expected: Packages installed successfully

**Step 2: Create Jest configuration**

Create file: `jest.config.js`

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

**Step 3: Create Jest setup**

Create file: `jest.setup.js`

```javascript
import '@testing-library/jest-dom'
```

**Step 4: Add test script to package.json**

Modify: `package.json` - add to `"scripts"`:
```json
"test": "jest",
"test:watch": "jest --watch"
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add Jest and React Testing Library setup"
```

---

### Task 11: Write tests for chart components

**Files:**
- Create: `app/components/__tests__/BarChart.test.tsx`
- Create: `app/components/__tests__/PieChart.test.tsx`

**Step 1: Write BarChart test**

Create file: `app/components/__tests__/BarChart.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import { SimpleBarChart } from '../BarChart'

describe('SimpleBarChart', () => {
  it('renders without crashing', () => {
    const data = [
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
    ]
    render(<SimpleBarChart data={data} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('renders with custom data', () => {
    const data = [
      { name: 'IT', value: 35 },
      { name: 'Finance', value: 25 },
    ]
    render(<SimpleBarChart data={data} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
```

**Step 2: Run BarChart test**

Run: `npm test -- app/components/__tests__/BarChart.test.tsx`
Expected: PASS

**Step 3: Write PieChart test**

Create file: `app/components/__tests__/PieChart.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import { SimplePieChart } from '../PieChart'

describe('SimplePieChart', () => {
  it('renders without crashing', () => {
    const data = [
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
    ]
    render(<SimplePieChart data={data} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('renders with custom data', () => {
    const data = [
      { name: 'IT', value: 35 },
      { name: 'Finance', value: 25 },
    ]
    render(<SimplePieChart data={data} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
```

**Step 4: Run PieChart test**

Run: `npm test -- app/components/__tests__/PieChart.test.tsx`
Expected: PASS

**Step 5: Run all tests**

Run: `npm test`
Expected: All tests pass

**Step 6: Commit**

```bash
git add .
git commit -m "test: add tests for BarChart and PieChart components"
```

---

### Task 12: Create content directory and sample MDX content

**Files:**
- Create: `content/about.mdx`

**Step 1: Create content directory**

Run: `mkdir -p content`
Expected: Directory created

**Step 2: Create sample MDX content**

Create file: `content/about.mdx`

```markdown
# About the Research

This study examines the adoption patterns of digital project management tools across various industries.

## Research Objectives

- Identify key factors influencing adoption decisions
- Measure the impact of digital PM tools on project success
- Understand barriers to adoption
- Develop recommendations for organizations

## Research Questions

1. What are the primary drivers of digital PM tool adoption?
2. How does adoption vary across different industries and organization sizes?
3. What impact do digital PM tools have on project outcomes?
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add content directory and sample MDX content"
```

---

### Task 13: Build and verify production build

**Files:**
- None (verification step)

**Step 1: Run production build**

Run: `npm run build`
Expected: Build completes successfully (with mock data warning)

**Step 2: Verify build output**

Run: `ls -la .next`
Expected: You should see the .next directory with built files

**Step 3: Test production build locally**

Run: `npm run start`
Expected: Server starts at http://localhost:3000
Verify: Open browser and check all pages work correctly

**Step 4: Stop production server**

Run: Press Ctrl+C

**Step 5: Commit**

```bash
git add .
git commit -m "feat: verify production build works"
```

---

### Task 14: Add deployment configuration

**Files:**
- Create: `vercel.json` (optional for Vercel)
- Create: `netlify.toml` (optional for Netlify)

**Step 1: Create Vercel configuration**

Create file: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

**Step 2: Create Netlify configuration**

Create file: `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Step 3: Create README with deployment instructions**

Create file: `README.md`

```markdown
# Digital PM Adoption Study Website

A Next.js-based thesis dashboard for displaying research findings on Digital Project Management adoption.

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Build

```bash
npm run build
npm run start
```

## Testing

```bash
npm test
```

## Data Configuration

Set up Google Sheets access:

1. Create `.env.local` based on `.env.example`
2. Add your Google Sheets API key and sheet ID
3. Run `npm run fetch-data` to test

## Deployment

### Vercel
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Netlify
1. Connect your repository to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add deployment configuration and README"
```

---

## Implementation Complete

All tasks have been completed. The thesis website now has:

- Next.js 14+ with TypeScript and Tailwind CSS
- MDX support for thesis content
- Navigation and layout structure
- Placeholder content pages
- Interactive chart components (BarChart, PieChart)
- Google Sheets data fetching infrastructure
- Dashboard page with sample visualizations
- Testing setup with Jest and React Testing Library
- Deployment configuration for Vercel and Netlify

Next steps for content and data:
1. Configure Google Sheets API credentials
2. Set up the actual spreadsheet with survey data
3. Write thesis content in MDX format
4. Deploy to production hosting
