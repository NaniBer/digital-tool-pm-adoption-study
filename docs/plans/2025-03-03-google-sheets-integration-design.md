# Google Sheets Integration Sprint

**Goal:** Integrate public Google Sheet data into the dashboard, replacing mock data with real survey responses and creating comprehensive visualizations.

**Architecture:** Server-side API routes with CSV parsing and data aggregation, Next.js 16+, TypeScript.

**Tech Stack:** Next.js 16+, TypeScript, Recharts.

---

## Context

The dashboard currently displays mock data representing survey responses on digital project management tool adoption. We have a public Google Sheet containing 13 survey responses with columns:
- Frequency of tool usage (categorical)
- Duration of usage (categorical)
- Usefulness rating (numerical 1-5)
- Empty column (unused)

This sprint will connect the dashboard to the real Google Sheet data, process it, and display comprehensive insights.

---

## Design Requirements

- **Data Source:** Public Google Sheet (published as CSV)
- **Access Method:** Server-side API route fetching CSV
- **Visualizations:** Distribution charts, cross-analysis, metrics
- **Styling:** Maintain existing Cyberpunk Terminal theme
- **Performance:** Server-side processing, efficient data transformation
- **Error Handling:** Graceful fallback for fetch/parsing failures

---

## Architecture

### High-Level Flow

```
Google Sheet (public CSV)
    ↓ fetch
Next.js API Route (/api/survey-data)
    ↓ parse CSV → aggregate → return JSON
Dashboard Component
    ↓ fetch on mount
Charts & Visualizations
```

### Files to Create/Modify

**New Files:**
- `app/api/survey-data/route.ts` - API route for fetching and processing data
- `lib/sheet-parser.ts` - Utilities for CSV parsing and data aggregation
- `lib/types.ts` - TypeScript interfaces for survey data

**Modified Files:**
- `app/dashboard/page.tsx` - Replace mock data with API calls

---

## Data Flow

### API Response Structure

```typescript
{
  frequencyDistribution: { label: string, count: number }[],
  durationDistribution: { label: string, count: number }[],
  averageUsefulness: number,
  usefulnessByFrequency: { frequency: string, avgRating: number }[],
  totalResponses: number
}
```

### Processing Steps

1. **Fetch CSV** - Fetch from published Google Sheet URL
2. **Parse CSV** - Split by newlines, split rows by commas
3. **Clean data** - Skip header row, handle empty cells
4. **Aggregate frequency** - Count occurrences of each frequency value
5. **Aggregate duration** - Count occurrences of each duration value
6. **Calculate average usefulness** - Sum and divide by count
7. **Cross-analyze** - Group by frequency, calculate average rating per frequency
8. **Return JSON** - Structured response for dashboard

---

## Components

### New Components

- **FrequencyChart** - Bar chart showing usage frequency distribution
- **DurationChart** - Bar chart showing duration distribution
- **UsefulnessByFrequencyChart** - Grouped bar or line chart showing ratings by frequency
- **MetricsCards** - Real metrics (total responses, average rating, etc.)

### Updated Components

- **DashboardPage** - Replace mock data with API calls, keep existing terminal styling and animations

### Utility Modules

- **lib/sheet-parser.ts** - CSV parsing and aggregation functions
- **lib/types.ts** - TypeScript interfaces for survey data

---

## Error Handling

- **Sheet fetch failure** → Return 500 error with message
- **Empty/invalid CSV** → Return 400 error with details
- **Missing required columns** → Return 400 error with column details
- **Dashboard error state** → Show fallback message, maintain UI

---

## Testing Strategy

### Unit Tests

- Test CSV parsing with sample data
- Test aggregation functions (frequency, duration, averages)
- Test cross-analysis logic
- Test error handling scenarios

### Integration Tests

- Mock Google Sheet API response
- Test full API route flow
- Test error scenarios (fetch failure, invalid data)

### Manual Testing

- Deploy locally, verify dashboard shows real data
- Check charts render correctly with real data
- Verify metrics match expected values
- Test error states (network failure, invalid sheet)

---

## Success Criteria

- Dashboard displays real data from Google Sheet
- All charts render correctly with aggregated data
- Metrics accurately reflect survey responses
- Terminal styling maintained
- Error states handled gracefully
- Build passes, no TypeScript errors
- Performance acceptable (fast page load)
