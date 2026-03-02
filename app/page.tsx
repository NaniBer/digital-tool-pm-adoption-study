export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="space-y-8">
        <section>
          <h1 className="text-4xl font-bold text-gray-900">
            Digital Project Management Adoption Study
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Understanding how organizations adopt and implement digital project management tools and practices.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">Abstract</h2>
          <p className="mt-2 text-gray-700">
            This study examines adoption patterns of digital project management tools across various industries.
            Through quantitative analysis of survey responses, we identify key factors influencing adoption decisions
            and their impact on project success.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">Quick Links</h2>
          <ul className="mt-2 space-y-2 text-gray-700">
            <li>• <a href="/about" className="text-blue-600 hover:underline">About the Research</a> - Background and objectives</li>
            <li>• <a href="/methodology" className="text-blue-600 hover:underline">Methodology</a> - Research design and data collection</li>
            <li>• <a href="/findings" className="text-blue-600 hover:underline">Findings</a> - Key results and analysis</li>
            <li>• <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a> - Interactive data exploration</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
