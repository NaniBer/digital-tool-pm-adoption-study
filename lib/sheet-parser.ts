// lib/sheet-parser.ts
import {
  SurveyResponse,
  DistributionItem,
  SurveyData,
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

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1D57oGe6ACimVBU7TRkXuhY_-fgVrB9HV_8QaC_m8W5g/export?format=csv'

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

  // Skip header row (first line), process rest
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line || line === '') continue // Skip empty lines

    const row = line.split(',')
    if (row.length < 11) continue

    // Column 11 is "I find digital project management tools useful" (1-5 scale)
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

function aggregateData(responses: SurveyResponse[]): SurveyData {
  const frequencyMap = new Map<string, number>()
  const durationMap = new Map<string, number>()
  const toolsMap = new Map<string, number>()
  let totalUsefulness = 0
  let usefulCount = 0

  responses.forEach((response) => {
    // Aggregate frequency
    const freqCount = frequencyMap.get(response.frequency) || 0
    frequencyMap.set(response.frequency, freqCount + 1)

    // Aggregate duration
    const durCount = durationMap.get(response.duration) || 0
    durationMap.set(response.duration, durCount + 1)

    // Aggregate tools (parse comma-separated list)
    if (response.toolsUsed) {
      const tools = response.toolsUsed.split(',').map(t => t.trim())
      tools.forEach((tool) => {
        const toolCount = toolsMap.get(tool) || 0
        toolsMap.set(tool, toolCount + 1)
      })
    }

    // Aggregate usefulness (exclude non-users)
    if (response.usefulness > 0) {
      totalUsefulness += response.usefulness
      usefulCount++
    }
  })

  return {
    frequencyDistribution: mapToDistributionArray(frequencyMap),
    durationDistribution: mapToDistributionArray(durationMap),
    toolsDistribution: mapToDistributionArray(toolsMap).sort((a, b) => b.count - a.count),
    averageUsefulness: usefulCount > 0 ? totalUsefulness / usefulCount : 0,
    totalResponses: responses.length,
  }
}

function mapToDistributionArray(map: Map<string, number>): DistributionItem[] {
  return Array.from(map.entries()).map(([label, count]) => ({ label, count }))
}
