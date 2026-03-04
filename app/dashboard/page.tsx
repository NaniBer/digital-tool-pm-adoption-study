'use client'

import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts'

// Mock data
const timelineData = [
  { phase: 'Research Initiation', status: 'completed', date: '2024-01-15', description: 'Literature review completed' },
  { phase: 'Data Collection', status: 'completed', date: '2024-03-01', description: 'Survey deployed to 342 orgs' },
  { phase: 'Analysis Phase', status: 'completed', date: '2024-05-20', description: 'Quantitative analysis completed' },
  { phase: 'Model Training', status: 'completed', date: '2024-07-10', description: 'ML models deployed' },
  { phase: 'Validation', status: 'current', date: 'In Progress', description: 'Cross-validation running' },
  { phase: 'Publication', status: 'pending', date: 'Pending', description: 'Final review scheduled' },
]


const logData = [
  { time: '14:32:01', type: 'info', message: 'Data stream initialized' },
  { time: '14:32:02', type: 'success', message: 'Connection established: port 8080' },
  { time: '14:32:03', type: 'info', message: 'Loading model weights...' },
  { time: '14:32:05', type: 'success', message: 'Model loaded: 47.2MB' },
  { time: '14:32:06', type: 'warning', message: 'High latency detected: 245ms' },
  { time: '14:32:08', type: 'info', message: 'Optimizing batch size: 256' },
]

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState('')
  const [typewriterText, setTypewriterText] = useState('')
  const [surveyData, setSurveyData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0'))
    }
    updateTime()
    const interval = setInterval(updateTime, 100)
    return () => clearInterval(interval)
  }, [])

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

  useEffect(() => {
    const text = '> user_query: execute ./research_abstract.sh'
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setTypewriterText(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text p-4 md:p-6">
      {/* CRT Scanline Overlay */}
      <div className="crt-overlay" />

      {/* Terminal Header */}
      <header className="mb-8 border-b border-terminal-border pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="terminal-label">[ SYSTEM.STATUS ]</span>
            <span className="text-terminal-success pulse-glow">● ONLINE</span>
          </div>
          <div className="terminal-label">{currentTime}</div>
        </div>
      </header>

      {/* Hero Section - Terminal Command */}
      <section className="mb-12 terminal-box p-6">
        <div className="command-line">
          <span className="command-prompt">$</span>
          <span className="command-text">{typewriterText}</span>
          <span className="cursor-blink">_</span>
        </div>
      </section>

      {/* Loading State */}
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

      {/* Error State */}
      {error && (
        <div className="terminal-box p-6 mb-8" style={{ borderColor: 'var(--terminal-warning)' }}>
          <div className="text-center">
            <div className="terminal-label mb-4" style={{ color: 'var(--terminal-warning)' }}>{'> SYSTEM.ERROR'}</div>
            <p style={{ color: 'var(--terminal-warning)' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 border border-terminal-accent text-terminal-accent hover:bg-terminal-accent/10 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Left Column - Timeline */}
        <div className="lg:col-span-1">
          <section className="terminal-box p-6 h-full">
            <div className="terminal-label mb-6">{'> RESEARCH.JOURNEY'}</div>
            <div className="timeline-container">
              <div className="timeline-line" />
              {timelineData.map((item, index) => (
                <div key={index} className="timeline-node">
                  <div
                    className={`timeline-dot ${
                      item.status === 'completed' ? 'completed' :
                      item.status === 'current' ? 'current' : ''
                    }`}
                  />
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-terminal-text">{item.phase}</span>
                      {item.status === 'current' && (
                        <div className="live-badge">
                          <div className="live-dot"></div>
                          LIVE
                        </div>
                      )}
                    </div>
                    <div className="terminal-label">{item.date}</div>
                    <div className="text-terminal-muted mt-1">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Columns - Bento Grid Dashboard */}
        <div className="lg:col-span-2">
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

          {/* Bento Grid */}
          <div className="bento-grid bento-col-2">
            {/* Live Chart */}
            <div className="terminal-box p-6 bento-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="terminal-label">{'> DATA_STREAM'}</div>
                <div className="live-badge">
                  <div className="live-dot"></div>
                  LIVE
                </div>
              </div>
              <div className="chart-container h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={surveyData?.responseAccumulation || []}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgba(0, 240, 255, 0.3)" />
                        <stop offset="95%" stopColor="rgba(0, 240, 255, 0)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis
                      dataKey="date"
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
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#00F0FF"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#chartGradient)"
                      dot={{ fill: '#00F0FF', strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Terminal Output Log */}
            <div className="terminal-box p-6 bento-span-2">
              <div className="terminal-label mb-4">{'> SYSTEM.LOG'}</div>
              <div className="space-y-2 font-mono text-sm max-h-64 overflow-y-auto">
                {logData.map((log, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-terminal-muted">[{log.time}]</span>
                    <span
                      className={
                        log.type === 'success' ? 'text-terminal-success' :
                        log.type === 'warning' ? 'text-terminal-warning' :
                        'text-terminal-accent'
                      }
                    >
                      {log.type.toUpperCase()}:
                    </span>
                    <span className="text-terminal-muted">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Metric Card */}
            <div className="terminal-box p-6">
              <div className="terminal-label mb-4">{'> MODEL.STATUS'}</div>
              <div className="space-y-4">
                <div>
                  <div className="data-label mb-2">Training Progress</div>
                  <div className="w-full bg-terminal-border h-2">
                    <div className="bg-terminal-accent h-full" style={{ width: '87%' }}></div>
                  </div>
                  <div className="text-right terminal-label mt-1">87%</div>
                </div>
                <div>
                  <div className="data-label mb-2">Loss Rate</div>
                  <div className="data-value text-xl text-terminal-success">0.0234</div>
                </div>
              </div>
            </div>

            {/* Industry Distribution */}
            <div className="terminal-box p-6">
              <div className="terminal-label mb-4">{'> INDUSTRY.BREAKDOWN'}</div>
              <div className="space-y-3">
                {[
                  { name: 'Technology', value: 85 },
                  { name: 'Finance', value: 72 },
                  { name: 'Healthcare', value: 58 },
                  { name: 'Other', value: 41 },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm text-terminal-accent">{item.value}%</span>
                    </div>
                    <div className="w-full bg-terminal-border h-1">
                      <div
                        className="bg-terminal-accent h-full"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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

            {/* Duration Distribution */}
            <div className="terminal-box p-6 bento-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="terminal-label">{'> USAGE.DURATION'}</div>
                <div className="live-badge">
                  <div className="live-dot"></div>
                  LIVE
                </div>
              </div>
              <div className="chart-container h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={surveyData?.durationDistribution || []} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={{ stroke: '#1F2937' }} />
                    <YAxis dataKey="label" type="category" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={{ stroke: '#1F2937' }} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #00F0FF', borderRadius: '0', color: '#FFFFFF' }} />
                    <Bar dataKey="count" fill="#00FF41" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tools Popularity */}
            <div className="terminal-box p-6 bento-span-2">
              <div className="terminal-label mb-4">{'> TOOLS.POPULARITY'}</div>
              <div className="chart-container h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={surveyData?.toolsDistribution || []} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={{ stroke: '#1F2937' }} />
                    <YAxis dataKey="label" type="category" tick={{ fill: '#9CA3AF', fontSize: 9 }} axisLine={{ stroke: '#1F2937' }} width={70} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #00F0FF', borderRadius: '0', color: '#FFFFFF' }} />
                    <Bar dataKey="count" fill="#FF5500" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Command Line */}
      <footer className="terminal-box p-4">
        <div className="command-line">
          <span className="command-prompt">$</span>
          <span className="command-text">awaiting_next_command...</span>
          <span className="cursor-blink">_</span>
        </div>
      </footer>
    </div>
  )
}
