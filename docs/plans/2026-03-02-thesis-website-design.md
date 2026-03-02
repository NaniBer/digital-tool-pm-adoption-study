# Thesis Website Design
## Digital PM Adoption Study

**Date:** 2026-03-02
**Purpose:** Design for a thesis dashboard website combining documentation, data visualization, and interactive elements.

---

## Purpose

Create a website to display questionnaire results and documentation for a thesis on Digital Project Management adoption. The site will serve a public/general audience with a combined approach: thesis documentation + data visualization + potential interactivity.

---

## Architecture

### Technology Stack
- **Next.js 14+** with App Router for static site generation
- **TypeScript** for type safety
- **MDX** for thesis content (Markdown with embedded React components)
- **Tailwind CSS** for styling
- **Recharts** or **Chart.js React wrapper** for data visualization
- **Deployment:** Vercel or Netlify (free tiers)

### Project Structure
```
digital-pm-adoption-study/
├── app/
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home/landing page
│   ├── about/              # Thesis overview page
│   ├── methodology/        # Research methodology
│   ├── findings/           # Results and analysis
│   ├── dashboard/          # Data visualization page
│   └── components/         # Shared UI components
├── content/                # MDX thesis content
├── public/                 # Static assets (images, PDFs)
├── data/                   # JSON data files (from spreadsheet)
└── lib/                    # Utilities, data helpers
```

### Key Decisions
- Static site generation (SSG) for fast loading and free hosting
- MDX for thesis content so you can embed charts directly
- Data fetched from Google Sheets and cached as JSON at build time
- Incremental development approach as content and data evolve

---

## Components

### Page Components
- **Home page:** Hero section with thesis title, abstract summary, and navigation
- **About page:** Research background, objectives, and significance
- **Methodology page:** Research design, data collection methods
- **Findings page:** Key results with embedded charts (via MDX)
- **Dashboard page:** Interactive data exploration with multiple charts

### Shared UI Components
- **Navigation:** Simple header with links to all sections
- **ChartWrapper:** Wrapper component for charts (responsive, accessible)
- **DataTable:** Table component for displaying raw data
- **Section:** Consistent styling for content sections
- **Footer:** Copyright, links to resources

### Chart Components
- **BarChart:** For categorical comparisons (e.g., adoption by industry)
- **PieChart:** For distribution data (e.g., response demographics)
- **LineChart:** For trends over time if applicable
- **HeatMap:** For correlation matrices (optional, advanced)

---

## Data Flow

### Data Source
- Google Sheets (published to web or via API)
- Sheet API fetches happen at build time for static generation
- Data cached and served as JSON to the site

### Data Pipeline
```
Google Sheets → Build Script → JSON files → MDX/Components → Charts
```

### Implementation
- Build script runs during `next build` to fetch sheet data
- Saves to `data/` directory as JSON
- MDX content and components import the JSON
- Charts render with the pre-fetched data
- No API calls on the client side (faster, more reliable)

### Data Structure Example
```json
{
  "responses": [
    { "id": 1, "industry": "IT", "adoptionScore": 7, "companySize": "100-500" },
    { "id": 2, "industry": "Finance", "adoptionScore": 5, "companySize": "500+" }
  ],
  "aggregations": {
    "byIndustry": { "IT": { "avg": 7, "count": 25 }, ... },
    "overall": { "avgAdoptionScore": 6.2, "totalResponses": 150 }
  }
}
```

---

## Error Handling

### Build-time Errors
- Spreadsheet fetch failures → Build fails with clear error message
- Invalid data format → Validation errors with sheet name and problematic data
- Missing required fields → Specific field names mentioned in error

### Runtime Errors
- Missing chart data → Show empty state with "Data coming soon" message
- Malformed data → Fallback to showing raw table or error component
- Broken MDX → Graceful degradation, content still displays

### Graceful Degradation Strategy
- Charts fail → Display raw data table as fallback
- Data fetch fails → Show placeholder: "Data will be available soon"
- Component errors → Error boundaries prevent full page crash
- Static assets missing → Show alt text or placeholder

---

## Testing

### Unit Tests
- Chart components: Verify they render correctly with mock data
- Data fetching utilities: Test spreadsheet parsing and JSON transformation
- Helper functions: Data aggregation and filtering logic

### Integration Tests
- End-to-end page rendering with embedded MDX and charts
- Build script: Verify spreadsheet data is correctly fetched and saved

### Manual Testing Checklist
- All pages load correctly
- Charts render with data
- Navigation works across all sections
- Responsive design on mobile/tablet/desktop
- Build process completes successfully with real sheet data

### Testing Approach
- Jest + React Testing Library for component tests
- Mock spreadsheet data for unit tests (no real sheet dependency)
- Test data structure changes to catch breaking changes early

---

## Timeline & Approach

- **Incremental development:** Build features as content and data become available
- **Data in progress:** Spreadsheet structure and data collection ongoing
- **Content in progress:** Thesis content will be added as it's written
- **Hosting:** Free/static hosting (Vercel or Netlify)
