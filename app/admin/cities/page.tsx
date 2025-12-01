'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CitiesPage() {
  // Initialize with default cities immediately
  const [cities, setCities] = useState<string[]>([
    'Casablanca',
    'Rabat',
    'Marrakech',
    'Fes',
    'Tangier',
    'Agadir',
    'Meknes',
    'Oujda',
    'Kenitra',
    'Tetouan',
    'Safi',
    'El Jadida',
    'Beni Mellal',
    'Nador',
    'Khouribga'
  ])
  const [newCity, setNewCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Fetch cities from API to sync with backend
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/settings/cities')
      if (response.ok) {
        const data = await response.json()
        if (data.cities && data.cities.length > 0) {
          setCities(data.cities)
        }
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
      // Keep default cities if fetch fails
    }
  }

  const addCity = () => {
    if (!newCity.trim()) return
    if (cities.includes(newCity.trim())) {
      alert('City already exists')
      return
    }
    setCities([...cities, newCity.trim()])
    setNewCity('')
  }

  const removeCity = (cityToRemove: string) => {
    if (confirm(`Are you sure you want to remove "${cityToRemove}"?`)) {
      setCities(cities.filter(city => city !== cityToRemove))
    }
  }

  const saveCities = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings/cities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cities })
      })

      if (response.ok) {
        alert('Cities updated successfully!')
      } else {
        alert('Failed to update cities')
      }
    } catch (error) {
      console.error('Error saving cities:', error)
      alert('Failed to update cities')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/settings" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Settings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Manage Cities</h1>
          <p className="mt-2 text-sm text-gray-600">
            Add or remove cities available for delivery on the checkout page.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading cities...</p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg p-6">
            {/* Add City Form */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add New City
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCity()}
                  placeholder="Enter city name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={addCity}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Add City
                </button>
              </div>
            </div>

            {/* Cities List */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Cities ({cities.length})
              </label>
              {cities.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">No cities added yet.</p>
              ) : (
                <div className="grid gap-2">
                  {cities.map((city) => (
                    <div
                      key={city}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-900">{city}</span>
                      <button
                        onClick={() => removeCity(city)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={saveCities}
                disabled={saving}
                className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

