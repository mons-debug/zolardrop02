'use client'

import { useEffect, useState } from 'react'

interface TrackingSettings {
  id?: string
  googleAdsId: string
  googleAdsLabel: string
  googleAnalyticsId: string
  facebookPixelId: string
  tiktokPixelId: string
  snapchatPixelId: string
  isActive: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<TrackingSettings>({
    googleAdsId: '',
    googleAdsLabel: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    tiktokPixelId: '',
    snapchatPixelId: '',
    isActive: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings/tracking')
      
      if (response.ok) {
        const data = await response.json()
        if (data.settings) {
          setSettings(data.settings)
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        showToast('Settings saved successfully!')
        fetchSettings()
      } else {
        showToast('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      showToast('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const handleChange = (field: keyof TrackingSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg">
            {toast}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tracking & Analytics Settings</h1>
            <p className="text-gray-600 mt-1">Configure tracking pixels and conversion tracking</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-4xl">
          {/* Enable/Disable Tracking */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Enable Tracking</h3>
                <p className="text-sm text-gray-600 mt-1">Turn on/off all tracking scripts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>

          {/* Google Ads */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Google Ads Conversion Tracking</h3>
                <p className="text-sm text-gray-600 mt-1">Track purchases and conversions from Google Ads</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conversion ID
                  <span className="text-gray-400 ml-2 font-normal">(AW-XXXXXXXXX)</span>
                </label>
                <input
                  type="text"
                  value={settings.googleAdsId}
                  onChange={(e) => handleChange('googleAdsId', e.target.value)}
                  placeholder="AW-123456789"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conversion Label
                  <span className="text-gray-400 ml-2 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={settings.googleAdsLabel}
                  onChange={(e) => handleChange('googleAdsLabel', e.target.value)}
                  placeholder="abcdefghij1234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          {/* Google Analytics */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.84 2.998v17.999a.836.836 0 01-.838.838H2.001a.836.836 0 01-.838-.838V2.998A.836.836 0 012.001 2.16h19.999a.836.836 0 01.838.838zM12 11.286l-4.5 4.5V5.786l4.5 4.5zm5.5-5.5v10l-4.5-4.5 4.5-4.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Google Analytics 4</h3>
                <p className="text-sm text-gray-600 mt-1">Track website traffic and user behavior</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Measurement ID
                <span className="text-gray-400 ml-2 font-normal">(G-XXXXXXXXX)</span>
              </label>
              <input
                type="text"
                value={settings.googleAnalyticsId}
                onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                placeholder="G-XXXXXXXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Facebook Pixel */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Meta Pixel (Facebook)</h3>
                <p className="text-sm text-gray-600 mt-1">Track conversions from Facebook and Instagram ads</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pixel ID
              </label>
              <input
                type="text"
                value={settings.facebookPixelId}
                onChange={(e) => handleChange('facebookPixelId', e.target.value)}
                placeholder="123456789012345"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* TikTok Pixel */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">TikTok Pixel</h3>
                <p className="text-sm text-gray-600 mt-1">Track conversions from TikTok ads</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pixel ID
              </label>
              <input
                type="text"
                value={settings.tiktokPixelId}
                onChange={(e) => handleChange('tiktokPixelId', e.target.value)}
                placeholder="ABCDEFGHIJ1234567890"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Snapchat Pixel */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.389.074-.524.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.12-.064-.187 0-.195.119-.404.375-.449 3.266-.539 4.736-3.909 4.801-4.014.181-.345.21-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105-.046-.569-.016-1.156.046-1.611.074-.584.284-1.109.584-1.577.659-.989 1.798-1.632 2.953-1.632z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Snapchat Pixel</h3>
                <p className="text-sm text-gray-600 mt-1">Track conversions from Snapchat ads</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pixel ID
              </label>
              <input
                type="text"
                value={settings.snapchatPixelId}
                onChange={(e) => handleChange('snapchatPixelId', e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">How to find your tracking IDs:</h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li><strong>Google Ads:</strong> Go to your Google Ads account → Tools & Settings → Conversions</li>
              <li><strong>Google Analytics:</strong> Go to Admin → Data Streams → Select your web stream</li>
              <li><strong>Meta Pixel:</strong> Go to Facebook Events Manager → Data Sources → Pixels</li>
              <li><strong>TikTok Pixel:</strong> Go to TikTok Ads Manager → Assets → Events</li>
              <li><strong>Snapchat Pixel:</strong> Go to Snapchat Ads Manager → Events Manager → Snap Pixel</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

