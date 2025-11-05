'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AnalyticsData {
  totalVisitors: number
  todayVisitors: number
  weekVisitors: number
  monthVisitors: number
  topProducts: Array<{ name: string; views: number }>
  conversionRate: number
  averageOrderValue: number
  bounceRate: number
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalVisitors: 0,
    todayVisitors: 0,
    weekVisitors: 0,
    monthVisitors: 0,
    topProducts: [],
    conversionRate: 0,
    averageOrderValue: 0,
    bounceRate: 0
  })
  const [loading, setLoading] = useState(true)

  // Sample data for charts (in production, this would come from your analytics API)
  const trafficData = [
    { name: 'Mon', visitors: 1200 },
    { name: 'Tue', visitors: 1900 },
    { name: 'Wed', visitors: 1500 },
    { name: 'Thu', visitors: 2100 },
    { name: 'Fri', visitors: 2400 },
    { name: 'Sat', visitors: 2800 },
    { name: 'Sun', visitors: 2200 },
  ]

  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 4500 },
    { name: 'Fri', sales: 6000 },
    { name: 'Sat', sales: 7000 },
    { name: 'Sun', sales: 5500 },
  ]

  const deviceData = [
    { name: 'Desktop', value: 45 },
    { name: 'Mobile', value: 40 },
    { name: 'Tablet', value: 15 },
  ]

  const COLORS = ['#000000', '#ff5b00', '#6B7280']

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Simulate API call with mock data
      // In production, you'd fetch real data from Google Analytics API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAnalyticsData({
        totalVisitors: 12458,
        todayVisitors: 342,
        weekVisitors: 2847,
        monthVisitors: 9621,
        topProducts: [
          { name: 'Classic Cotton T-Shirt', views: 1234 },
          { name: 'Zip-Up Hoodie', views: 987 },
          { name: 'Crew Neck Sweatshirt', views: 856 },
          { name: 'Slim Fit Chinos', views: 745 },
        ],
        conversionRate: 3.2,
        averageOrderValue: 8450,
        bounceRate: 42.5
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">Track visitor behavior and site performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchAnalytics}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Visitors */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Today's Visitors</h3>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{analyticsData.todayVisitors.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-2">+12.5% from yesterday</p>
          </div>

          {/* This Week */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">This Week</h3>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{analyticsData.weekVisitors.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-2">+8.2% from last week</p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{analyticsData.conversionRate}%</p>
            <p className="text-sm text-green-600 mt-2">+0.3% improvement</p>
          </div>

          {/* Avg Order Value */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Avg Order Value</h3>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">${(analyticsData.averageOrderValue / 100).toFixed(2)}</p>
            <p className="text-sm text-green-600 mt-2">+5.1% increase</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Traffic Over Time */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic This Week</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="visitors" stroke="#000000" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sales Over Time */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales This Week</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#ff5b00" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Device Breakdown */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products by Views</h3>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{product.views.toLocaleString()} views</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-black h-2 rounded-full" 
                        style={{ width: `${(product.views / analyticsData.topProducts[0].views) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hotjar Integration */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Heatmaps & Recordings</h3>
              <p className="text-sm text-gray-600 mt-1">View how visitors interact with your site</p>
            </div>
            <a
              href="https://insights.hotjar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Open Hotjar Dashboard →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Heatmaps</h4>
              <p className="text-sm text-gray-600">See where users click, move, and scroll on your pages</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Session Recordings</h4>
              <p className="text-sm text-gray-600">Watch real user sessions to understand their journey</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Conversion Funnels</h4>
              <p className="text-sm text-gray-600">Identify where users drop off in the checkout process</p>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h4 className="font-medium text-blue-900 mb-2">Setup Analytics Tracking</h4>
          <p className="text-sm text-blue-800 mb-3">
            To enable full analytics tracking, add the following environment variables:
          </p>
          <div className="bg-white rounded p-3 font-mono text-xs text-gray-800">
            <div>NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX</div>
            <div>NEXT_PUBLIC_HOTJAR_ID=XXXXXXX</div>
          </div>
          <p className="text-xs text-blue-700 mt-3">
            Once configured, visitor data will automatically be tracked and displayed here.
          </p>
        </div>
      </main>
    </div>
  )
}


