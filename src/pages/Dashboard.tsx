import React from 'react'
import LiveTwitterFeed from '../components/LiveTwitterFeed'
import DisasterMap from '../components/DisasterMap'
import AlertsOverview from '../components/AlertsOverview'
import { useDisasterData } from '../hooks/useDisasterData'

const Dashboard = () => {
  const { data: disasterData, loading } = useDisasterData()

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Disaster Response Dashboard
        </h1>
        <p className="text-gray-400">
          Real-time monitoring and response coordination for Malaysia
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Twitter Feed */}
        <div className="lg:col-span-1">
          <LiveTwitterFeed />
        </div>

        {/* Right Column - Map and Alerts */}
        <div className="lg:col-span-2 space-y-8">
          <DisasterMap />
          <AlertsOverview />
        </div>
      </div>

      {/* Stats Row */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Alerts</p>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : disasterData.filter(d => d.severity === 'high').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
              <span className="text-red-400 text-xl">🚨</span>
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Reports</p>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : disasterData.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-400 text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Flood Alerts</p>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : disasterData.filter(d => d.disaster_type === 'flood').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <span className="text-cyan-400 text-xl">🌊</span>
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Landslide Alerts</p>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : disasterData.filter(d => d.disaster_type === 'landslide').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <span className="text-orange-400 text-xl">⛰️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
