# Google Sheets Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Connect dashboard to public Google Sheet, process survey data, and display real visualizations replacing mock data.

**Architecture:** Server-side API route fetches CSV from Google Sheet, parses and aggregates data, returns JSON to dashboard component for visualization with Recharts.

**Tech Stack:** Next.js 16+, TypeScript, Tailwind CSS v4, Recharts.

---

## Context

This sprint implements the Google Sheets integration design approved in `docs/plans/2025-03-03-google-sheets-integration-design.md`. The public Google Sheet contains 13 survey responses with frequency, duration, and usefulness rating columns. We'll create API routes, parsing utilities, and update the dashboard to display real data.

**Current Dashboard Mock Data:**
- `timelineData` - Research phases with status (keep, this is UI content)
- `adoptionTrendData` - Monthly adoption values (keep or repurpose)
- `metrics` - Dashboard metrics (replace with real data)
- `logData` - System logs (keep, this is UI content)

**New Data to Display:**
- Frequency distribution chart
- Duration distribution chart
- Usefulness by frequency cross-analysis chart
- Real metrics (total responses, average rating)

---

## Task 1: Create TypeScript types for survey data

**Files:**
- Create: `lib/types.ts`

**Step 1: Create types file**

```typescript
// lib/types.ts

export interface SurveyResponse {
  frequency: string
  duration: string
  usefulness: number
}

export interface DistributionItem {
  label: string
  count: number
}

export interface UsefulnessByFrequency {
  frequency: string
  avgRating: number
}

export interface SurveyData {
  frequencyDistribution: DistributionItem[]
  durationDistribution: DistributionItem[]
  averageUsefulness: number
  usefulnessByFrequency: UsefulnessByFrequency[]
  totalResponses: number
}
```

**Step 2: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add TypeScript types for survey data"
```

---

## Task 2: Create CSV parsing utilities

**Files:**
- Create: `lib/sheet-parser.ts`

**Step 1: Create CSV parser utility**

```typescript
// lib/sheet-parser.ts
import { SurveyResponse, DistributionItem, UsefulnessByFrequency, SurveyData } from './types'

const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || ''

export async function fetchSurveyData(): Promise<SurveyData> {
  const response = await fetch(GOOGLE_SHEET_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch Google Sheet: ${response.status}`)
  }

  const csvText = await response.text()
  const responses = parseCSV(csvText)

  return aggregateData(responses)
}

function parseCSV(csvText: string): SurveyResponse[] {
  const lines = csvText.trim().split('\n')
  const responses: SurveyResponse[] = []

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',')
    if (row.length < 3) continue

    const usefulness = parseInt(row[2].trim(), 10)
    if (isNaN(usefulness)) continue

    responses.push({
      frequency: row[0].trim(),
      duration: row[1].trim(),
      usefulness: usefulness,
    })
  }

  return responses
}

function aggregateData(responses: SurveyResponse[]): SurveyData {
  const frequencyMap = new Map<string, number>()
  const durationMap = new Map<string, number>()
  const frequencyRatings = new Map<string, number[]>()
  let totalUsefulness = 0

  responses.forEach((response) => {
    // Aggregate frequency
    const freqCount = frequencyMap.get(response.frequency) || 0
    frequencyMap.set(response.frequency, freqCount + 1)

    // Aggregate duration
    const durCount = durationMap.get(response.duration) || 0
    durationMap.set(response.duration, durCount + 1)

    // Aggregate usefulness by frequency
    const ratings = frequencyRatings.get(response.frequency) || []
    ratings.push(response.usefulness)
    frequencyRatings.set(response.frequency, ratings)

    totalUsefulness += response.usefulness
  })

  return {
    frequencyDistribution: mapToDistributionArray(frequencyMap),
    durationDistribution: mapToDistributionArray(durationMap),
    averageUsefulness: responses.length > 0 ? totalUsefulness / responses.length : 0,
    usefulnessByFrequency: calculateUsefulnessByFrequency(frequencyRatings),
    totalResponses: responses.length,
  }
}

function mapToDistributionArray(map: Map<string, number>): DistributionItem[] {
  return Array.from(map.entries()).map(([label, count]) => ({ label, count }))
}

function calculateUsefulnessByFrequency(ratingsMap: Map<string, number[]>): UsefulnessByFrequency[] {
  return Array.from(ratingsMap.entries())
    .map(([frequency, ratings]) => ({
      frequency,
      avgRating: ratings.reduce((sum, r) => sum + r, 0) / ratings.length,
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
}
```

**Step 2: Commit**

```bash
git add lib/sheet-parser.ts
git commit -m "feat: add CSV parsing and data aggregation utilities"
```

---

## Task 3: Create API route for survey data

**Files:**
- Create: `app/api/survey-data/route.ts`

**Step 1: Create API route**

```typescript
// app/api/survey-data/route.ts
import { NextResponse } from 'next/server'
import { fetchSurveyData } from '@/lib/sheet-parser'

export async function GET() {
  try {
    const data = await fetchSurveyData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching survey data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch survey data' },
      { status: 500 }
    )
  }
}
```

**Step 2: Add environment variable reference to .env.local**

```bash
# .env.local
GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv
```

**Note:** User will need to replace `YOUR_SHEET_ID` with actual sheet ID.

**Step 3: Commit**

```bash
git add app/api/survey-data/route.ts
git add .env.local 2>/dev/null || true
git commit -m "feat: add API route for survey data"
```

---

## Task 4: Update dashboard to fetch real data

**Files:**
- Modify: `app/dashboard/page.tsx`

**Step 1: Add state and effect for data fetching**

After line 48 (after existing state declarations), add:

```typescript
  const [surveyData, setSurveyData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/survey-data')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        setSurveyData(data)
      } catch (err) {
        console.error('Error fetching survey data:', err)
        setError('Failed to load survey data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
```

**Step 2: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: add data fetching state to dashboard"
```

---

## Task 5: Replace metrics with real data

**Files:**
- Modify: `app/dashboard/page.tsx`

**Step 1: Update metrics section**

Find the metrics section (around line 137-152) and replace with:

```typescript
          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: 'Total Responses',
                value: surveyData?.totalResponses?.toLocaleString() || '-',
                live: false
              },
              {
                label: 'Avg. Usefulness',
                value: surveyData?.averageUsefulness?.toFixed(1) || '-',
                live: false
              },
              {
                label: 'Status',
                value: loading ? 'Loading...' : error ? 'Error' : 'Active',
                live: !loading && !error
              },
              {
                label: 'Data Source',
                value: 'Live',
                live: true
              },
            ].map((metric, index) => (
              <div key={index} className="terminal-box p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="data-label">{metric.label}</div>
                  {metric.live && (
                    <div className="live-badge">
                      <div className="live-dot"></div>
                      LIVE
                    </div>
                  )}
                </div>
                <div className="data-value">{metric.value}</div>
              </div>
            ))}
          </div>
```

**Step 2: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: replace metrics with real survey data"
```

---

## Task 6: Add frequency distribution chart

**Files:**
- Modify: `app/dashboard/page.tsx`

**Step 1: Add frequency chart to bento grid**

Find the bento grid section (after line 154) and add this new chart:

```typescript
            {/* Frequency Distribution */}
            <div className="terminal-box p-6 bento-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="terminal-label">{'> USAGE.FREQUENCY'}</div>
                <div className="live-badge">
                  <div className="live-dot"></div>
                  LIVE
                </div>
              </div>
              <div className="chart-container h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={surveyData?.frequencyDistribution || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      axisLine={{ stroke: '#1F2937' }}
                    />
                    <YAxis
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      axisLine={{ stroke: '#1F2937' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid #00F0FF',
                        borderRadius: '0',
                        color: '#FFFFFF'
                      }}
                    />
                    <Bar dataKey="count" fill="#00F0FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
```

**Step 2: Add BarChart import**

At the top of the file (around line 4-6), ensure BarChart and Bar are imported:

```typescript
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts'
```

**Step 3: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: add frequency distribution chart"
```

---

## Task 7: Add duration distribution chart

**Files:**
- Modify: `app/dashboard/page.tsx`

**Step 1: Add duration chart to bento grid**

Add this chart after the frequency chart:

```typescript
            {/* Duration Distribution */}
            <div className="terminal-box p-6">
              <div className="terminal-label mb-4">{'> USAGE.DURATION'}</div>
              <div className="chart-container h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={surveyData?.durationDistribution || []} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis
                      type="number"
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      axisLine={{ stroke: '#1F2937' }}
                    />
                    <YAxis
                      dataKey="label"
                      type="category"
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      axisLine={{ stroke: '#1F2937' }}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid #00F0FF',
                        borderRadius: '0',
                        color: '#FFFFFF'
                      }}
                    />
                    <Bar dataKey="count" fill="#00FF41" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
```

**Step 2: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: add duration distribution chart"
```

---

## Task 8: Add usefulness by frequency chart

**Files:**
- Modify: `app/dashboard/page.tsx`

**Step 1: Add cross-analysis chart**

Add this chart to display usefulness ratings by frequency:

```typescript
            {/* Usefulness by Frequency */}
            <div className="terminal-box p-6">
              <div className="terminal-label mb-4">{'> USEFULNESS.BY.FREQUENCY'}</div>
              <div className="chart-container h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={surveyData?.usefulnessByFrequency || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis
                      dataKey="frequency"
                      tick={{ fill: '#9CA3AF', fontSize: 9 }}
                      axisLine={{ stroke: '#1F2937' }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      domain={[0, 5]}
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      axisLine={{ stroke: '#1F2937' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid #00F0FF',
                        borderRadius: '0',
                        color: '#FFFFFF'
                      }}
                    />
                    <Bar dataKey="avgRating" fill="#FF5500" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
```

**Step 2: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: add usefulness by frequency chart"
```

---

## Task 9: Add loading and error states

**Files:**
- Modify: `app/dashboard/page.tsx`

**Step 1: Add loading indicator**

At the start of the main content (before line 99), add:

```typescript
      {loading && (
        <div className="terminal-box p-6 mb-8">
          <div className="text-center">
            <div className="terminal-label mb-4">{'> SYSTEM.STATUS'}</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-terminal-accent">Loading data...</span>
              <span className="cursor-blink">_</span>
            </div>
          </div>
        </div>
      )}
```

**Step 2: Add error display**

After the loading indicator:

```typescript
      {error && (
        <div className="terminal-box p-6 mb-8 border-terminal-warning">
          <div className="text-center">
            <div className="terminal-label mb-4 text-terminal-warning">{'> SYSTEM.ERROR'}</div>
            <p className="text-terminal-warning">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 border border-terminal-accent text-terminal-accent hover:bg-terminal-accent/10 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
```

**Step 3: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: add loading and error states"
```

---

## Task 10: Update existing charts to show real data (optional)

**Files:**
- Modify: `app/dashboard/page.tsx`

**Step 1: Replace or repurpose adoption trend chart**

The existing `adoptionTrendData` mock data can either be kept or replaced with frequency data. For now, let's keep it as-is since it represents a different metric (monthly adoption trends).

**Step 2: Verify all charts render**

**Step 3: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: verify all charts render with real data"
```

---

## Verification

After completing all tasks, verify:

1. **Set up environment variable:**
   ```bash
   # Add to .env.local
   GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Navigate to dashboard:**
   - http://localhost:3000/dashboard

4. **Verify data loads:**
   - Loading state shows briefly
   - Real data displays in metrics
   - All charts render with actual survey data

5. **Check specific visualizations:**
   - Frequency distribution chart shows correct counts
   - Duration distribution chart shows correct counts
   - Usefulness by frequency shows correct averages
   - Metrics match survey data (total responses, average rating)

6. **Test error states:**
   - Invalid sheet URL → error message displays
   - Network error → error message with retry button

7. **Stop dev server:**
   Press Ctrl+C

---

## Critical Files Summary

| File | Purpose |
|------|---------|
| `lib/types.ts` | TypeScript interfaces for survey data |
| `lib/sheet-parser.ts` | CSV parsing and data aggregation utilities |
| `app/api/survey-data/route.ts` | API route for fetching and processing data |
| `app/dashboard/page.tsx` | Dashboard with real data integration |
| `.env.local` | Environment variable for Google Sheet URL |

---

## Notes for Implementation

- **Google Sheet URL Format:** `https://docs.google.com/spreadsheets/d/[SHEET_ID]/export?format=csv`
- **Replace `[SHEET_ID]`** with actual Google Sheet ID from the URL
- **Sheet must be published** as "Anyone with the link can view" for public access
- **Terminal styling** must be maintained across all new components
- **Loading states** should respect the terminal aesthetic
- **Error handling** should be user-friendly and actionable

---

## Success Criteria

- Dashboard displays real data from Google Sheet
- All charts render correctly with aggregated data
- Metrics accurately reflect survey responses
- Terminal styling maintained
- Error states handled gracefully
- Build passes, no TypeScript errors
- Performance acceptable (fast page load)
