// lib/types.ts

export interface SurveyResponse {
  timestamp: string
  age: string
  gender: string
  education: string
  experience: string
  sector: string
  position: string
  orgSize: string
  toolsUsed: string
  frequency: string
  duration: string
  usefulness: number
}

export interface DistributionItem {
  label: string
  count: number
}

export interface SurveyData {
  frequencyDistribution: DistributionItem[]
  durationDistribution: DistributionItem[]
  toolsDistribution: DistributionItem[]
  averageUsefulness: number
  totalResponses: number
}
