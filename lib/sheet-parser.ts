import {
  SurveyResponse,
  DistributionItem,
  SurveyData,
  ResponseAccumulation,
  SURVEY_GOAL,
  AgeRange,
  Gender,
  EducationLevel,
  ExperienceLevel,
  Sector,
  Position,
  OrgSize,
  UsageFrequency,
  UsageDuration,
} from './types'

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1IKZWi_Srt3-bu7UXZruH0J7MlaLwtv8r2PYrQ8trFms/export?format=csv'


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
    const line = lines[i].trim()
    if (!line || line === '') continue

    const row = parseCSVRow(line)
    if (row.length < 12) continue

    const usefulness = parseInt(row[11].trim(), 10)
    if (isNaN(usefulness)) continue

    responses.push({
      timestamp: row[0].trim(),
      age: row[1].trim() as AgeRange,
      gender: row[2].trim() as Gender,
      education: row[3].trim() as EducationLevel,
      experience: row[4].trim() as ExperienceLevel,
      sector: row[5].trim() as Sector,
      position: row[6].trim() as Position,
      orgSize: row[7].trim() as OrgSize,
      toolsUsed: row[8].trim(),
      frequency: row[9].trim() as UsageFrequency,
      duration: row[10].trim() as UsageDuration,
      usefulness: usefulness,
    })
  }

  return responses
}

/**
 * Parse a CSV row, handling quoted fields that may contain commas
 * Example: "Trello, Jira, ClickUp" should be treated as a single field
 */
function parseCSVRow(line: string): string[] {
  const result: string[] = []
  let currentField = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(currentField)
      currentField = ''
    } else {
      currentField += char
    }
  }

  // Push the last field
  result.push(currentField)

  return result
}

function aggregateData(responses: SurveyResponse[]): SurveyData {
  const frequencyMap = new Map<string, number>()
  const durationMap = new Map<string, number>()
  const toolsMap = new Map<string, number>()
  const sectorMap = new Map<string, number>()
  let totalUsefulness = 0
  let usefulCount = 0

  responses.forEach((response) => {
    const freqCount = frequencyMap.get(response.frequency) || 0
    frequencyMap.set(response.frequency, freqCount + 1)

    // Only count duration if it's not empty and is a valid duration value
    if (response.duration && response.duration.trim() !== '') {
      const durCount = durationMap.get(response.duration) || 0
      durationMap.set(response.duration, durCount + 1)
    }

    if (response.toolsUsed) {
      const tools = response.toolsUsed.split(',').map(t => t.trim())
      tools.forEach((tool) => {
        const toolCount = toolsMap.get(tool) || 0
        toolsMap.set(tool, toolCount + 1)
      })
    }

    // Aggregate sector
    const sectorCount = sectorMap.get(response.sector) || 0
    sectorMap.set(response.sector, sectorCount + 1)

    if (response.usefulness > 0) {
      totalUsefulness += response.usefulness
      usefulCount++
    }
  })

  return {
    frequencyDistribution: mapToDistributionArray(frequencyMap),
    durationDistribution: mapToDistributionArray(durationMap),
    toolsDistribution: mapToDistributionArray(toolsMap).sort((a, b) => b.count - a.count),
    sectorDistribution: mapToDistributionArray(sectorMap).sort((a, b) => b.count - a.count),
    responseAccumulation: computeResponseAccumulation(responses),
    progressPercentage: Math.min(Math.round((responses.length / SURVEY_GOAL) * 100), 100),
    dataQualityMessage: getDataQualityMessage(responses.length),
    latestResponseDate: responses.length > 0 ? responses[0].timestamp : '',
    averageUsefulness: usefulCount > 0 ? totalUsefulness / usefulCount : 0,
    totalResponses: responses.length,
  }
}

function getDataQualityMessage(count: number): string {
  if (count < 50) {
    return 'Need more data'
  } else if (count < 100) {
    return 'Growing sample'
  } else {
    return 'Adequate sample'
  }
}

function computeResponseAccumulation(responses: SurveyResponse[]): ResponseAccumulation[] {
  // Group responses by day (format: "M/D/YYYY")
  const dayMap = new Map<string, number>()

  responses.forEach((response) => {
    const date = parseTimestamp(response.timestamp)
    const dayKey = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    const count = dayMap.get(dayKey) || 0
    dayMap.set(dayKey, count + 1)
  })

  // Sort chronologically and compute cumulative count
  const sortedDays = Array.from(dayMap.entries()).sort((a, b) => {
    const [monthA, dayA, yearA] = a[0].split('/').map(Number)
    const [monthB, dayB, yearB] = b[0].split('/').map(Number)
    return yearA !== yearB ? yearA - yearB :
           monthA !== monthB ? monthA - monthB : dayA - dayB
  })

  let cumulative = 0
  const result: ResponseAccumulation[] = []

  sortedDays.forEach(([day, count]) => {
    cumulative += count
    result.push({ date: day, count: cumulative })
  })

  return result
}

function parseTimestamp(timestamp: string): Date {
  // Expected format: "M/D/YYYY HH:MM:SS" or "M/D/YY HH:MM:SS"
  const [datePart, timePart] = timestamp.split(' ')
  if (!datePart) return new Date()

  const [month, day, year] = datePart.split('/').map(Number)

  // Handle 2-digit years (e.g., "26" -> 2026, "25" -> 2025)
  const fullYear = year < 100 ? 2000 + year : year

  return new Date(fullYear, month - 1, day)
}

function mapToDistributionArray(map: Map<string, number>): DistributionItem[] {
  return Array.from(map.entries()).map(([label, count]) => ({ label, count }))
}
