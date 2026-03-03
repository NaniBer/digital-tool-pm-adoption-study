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
