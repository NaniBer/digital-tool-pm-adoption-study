// lib/types.ts

/**
 * Age range categories from survey responses
 */
export type AgeRange = '18-25' | '26-35' | '36-45' | '56 and above'

/**
 * Gender categories from survey responses
 */
export type Gender = 'Male' | 'Female'

/**
 * Education level categories from survey responses
 */
export type EducationLevel = "Bachelor's Degree" | 'High School Diploma' | "Master's Degree"

/**
 * Project management experience ranges from survey responses
 */
export type ExperienceLevel = 'Less than 2 years' | '2-5 years' | '11-15 years' | 'More than 15 years'

/**
 * Industry sector categories from survey responses
 */
export type Sector = 'Information Technology (IT)' | 'Construction' | 'Other' | 'Church Programs'

/**
 * Position/role categories from survey responses
 */
export type Position =
  | 'Project Manager'
  | 'Program Manager'
  | 'Junior Project Manager'
  | 'Senior Project Manager'
  | 'Team Lead'
  | 'Have many positions the highest being senior project lead'

/**
 * Organization size categories from survey responses (number of employees)
 */
export type OrgSize = 'Less than 10' | '11-25' | '26-50' | '101-250' | 'Less than 50'

/**
 * Known digital project management tools from survey responses
 * Note: This is a non-exhaustive list as users can enter custom tool names
 */
export type KnownTool =
  | 'Trello'
  | 'Jira'
  | 'Asana'
  | 'Microsoft Project'
  | 'ClickUp'
  | 'Click up'
  | 'Teama AI'
  | 'The whole Google Workspace Suite'
  | 'i dont use tool'

/**
 * Frequency of tool usage categories from survey responses
 */
export type UsageFrequency =
  | 'Daily'
  | 'Several times per week'
  | 'Several times per month'
  | 'Rarely'
  | 'Never (Please discontinue)'

/**
 * Duration of tool usage categories from survey responses
 */
export type UsageDuration =
  | 'Less than 6 months'
  | '6 months - 1 year'
  | '1-3 years'
  | '3-5 years'
  | 'More than 5 years'

/**
 * Target number of survey responses for data collection
 */
export const SURVEY_GOAL = 150

/**
 * A single survey response from the Google Sheet data
 */
export interface SurveyResponse {
  timestamp: string
  age: AgeRange
  gender: Gender
  education: EducationLevel
  experience: ExperienceLevel
  sector: Sector
  position: Position
  orgSize: OrgSize
  toolsUsed: string // Comma-separated list of tools, may include custom values
  frequency: UsageFrequency
  duration: UsageDuration
  usefulness: number // 1-5 scale Likert response
}

/**
 * Distribution item representing a category label and its count
 * Used for displaying aggregated data in charts
 */
export interface DistributionItem {
  label: string
  count: number
}

/**
 * Aggregated survey data ready for dashboard visualization
 * Contains computed statistics and distributions from raw survey responses
 */
export interface SurveyData {
  /** Distribution of tool usage frequency across all responses */
  frequencyDistribution: DistributionItem[]
  /** Distribution of tool usage duration across all responses */
  durationDistribution: DistributionItem[]
  /** Popularity distribution of tools mentioned in responses */
  toolsDistribution: DistributionItem[]
  /** Distribution of industry sectors across all responses */
  sectorDistribution: DistributionItem[]
  /** Response accumulation over time (cumulative total responses) */
  responseAccumulation: ResponseAccumulation[]
  /** Progress percentage toward survey goal (0-100) */
  progressPercentage: number
  /** Data quality assessment message */
  dataQualityMessage: string
  /** Latest response timestamp */
  latestResponseDate: string
  /** Average usefulness rating (1-5 scale) from all non-zero responses */
  averageUsefulness: number
  /** Total number of valid survey responses processed */
  totalResponses: number
}

export interface ResponseAccumulation {
  date: string
  count: number
}
