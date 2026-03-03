'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'

// Mock questionnaire data
const mockData = {
  adoptionByIndustry: [
    { industry: 'Technology', adoption: 85 },
    { industry: 'Finance', adoption: 72 },
    { industry: 'Healthcare', adoption: 58 },
    { industry: 'Manufacturing', adoption: 45 },
    { industry: 'Education', adoption: 38 },
  ],
  toolPreferences: [
    { name: 'Jira', value: 35 },
    { name: 'Asana', value: 25 },
    { name: 'Monday.com', value: 20 },
    { name: 'Trello', value: 12 },
    { name: 'Other', value: 8 },
  ],
  adoptionTrend: [
    { year: '2019', value: 42 },
    { year: '2020', value: 55 },
    { year: '2021', value: 68 },
    { year: '2022', value: 79 },
    { year: '2023', value: 87 },
  ],
  keyMetrics: [
    { label: 'Total Respondents', value: '2,847' },
    { label: 'Organizations Surveyed', value: '342' },
    { label: 'Countries', value: '28' },
    { label: 'Avg. Adoption Rate', value: '67%' },
  ],
}

const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE']

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <motion.section
        variants={fadeInUp}
        className="mx-auto max-w-7xl px-6 py-16"
      >
        <div className="space-y-4">
          <h1 className="font-serif text-5xl font-bold text-foreground">
            Research Dashboard
          </h1>
          <p className="text-lg text-foreground-secondary max-w-3xl">
            Explore findings from our comprehensive study on digital project management
            adoption across industries. Interactive visualizations reveal key patterns and insights.
          </p>
        </div>
      </motion.section>

      {/* Key Metrics */}
      <motion.section variants={fadeInUp} className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockData.keyMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-hover rounded-xl border border-border bg-background-card p-6"
            >
              <p className="text-sm font-medium text-foreground-secondary">{metric.label}</p>
              <p className="mt-2 text-3xl font-bold gradient-text">{metric.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Charts Grid */}
      <motion.section variants={fadeInUp} className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Adoption by Industry - Bar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card-hover rounded-xl border border-border bg-background-card p-6"
          >
            <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
              Adoption by Industry
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.adoptionByIndustry}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    dataKey="industry"
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    axisLine={{ stroke: '#27272a' }}
                  />
                  <YAxis
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    axisLine={{ stroke: '#27272a' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f4f4f5'
                    }}
                  />
                  <Bar dataKey="adoption" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Tool Preferences - Pie Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card-hover rounded-xl border border-border bg-background-card p-6"
          >
            <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
              Tool Preferences
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.toolPreferences}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockData.toolPreferences.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f4f4f5'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Adoption Trend - Line Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="card-hover rounded-xl border border-border bg-background-card p-6 lg:col-span-2"
          >
            <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
              Digital PM Adoption Trend (2019-2023)
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.adoptionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    axisLine={{ stroke: '#27272a' }}
                  />
                  <YAxis
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    axisLine={{ stroke: '#27272a' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f4f4f5'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* Key Findings Section */}
      <motion.section variants={fadeInUp} className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-xl border border-border bg-background-card p-8">
          <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
            Key Findings
          </h3>
          <div className="space-y-4 text-foreground-secondary">
            <div className="flex items-start space-x-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-accent-primary flex-shrink-0" />
              <p>
                <strong className="text-foreground">Technology sector leads adoption</strong> at 85%,
                followed by Finance at 72%.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-accent-primary flex-shrink-0" />
              <p>
                <strong className="text-foreground">Jira is the preferred tool</strong> with 35%
                of respondents, followed by Asana at 25%.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-accent-primary flex-shrink-0" />
              <p>
                <strong className="text-foreground">Rapid growth observed</strong> from 2019 to 2023,
                with adoption rates increasing by over 100%.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-accent-primary flex-shrink-0" />
              <p>
                <strong className="text-foreground">Average adoption rate</strong> across all
                surveyed organizations stands at 67%.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}
