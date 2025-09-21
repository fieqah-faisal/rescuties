import React, { useState } from 'react'
import { AlertTriangle, MapPin, Clock, Filter, Search, TrendingUp, Eye } from 'lucide-react'
import { useDisasterData } from '../hooks/useDisasterData'
import type { TwitterDisasterData } from '../utils/s3Service'

const Alerts = () => {
  const { data: disasterData, loading, error } = useDisasterData()
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter data based on selections
  const filteredData = disasterData.filter(alert => {
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity
    const matchesType = selectedType === 'all' || alert.disaster_type === selectedType
    const matchesSearch = searchTerm === '' || 
      alert.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.user?.username.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSeverity && matchesType && matchesSearch
  })

  const getDisasterIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'flood': return '🌊'
      case 'landslide': return '⛰️'
      case 'wildfire': return '🔥'
      case 'earthquake': return '⚡'
      case 'storm': return '🌪️'
      default: return '⚠️'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    try {
      const now = new Date()
      const time = new Date(timestamp)
      const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
      
      if (diffInMinutes < 1) return 'Just now'
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    } catch {
      return 'Unknown'
    }
  }

  const formatLocation = (location: any) => {
    if (typeof location === 'string') return location
    if (location?.place_name) return location.place_name
    if (location?.lat && location?.lng) return `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`
    return 'Location unknown'
  }

  // Get unique disaster types for filter
  const disasterTypes = [...new Set(disasterData.map(alert => alert.disaster_type).filter(Boolean))]

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Disaster Alerts</h1>
        <p className="text-gray-400">
          Monitor and manage real-time disaster alerts from social media
        </p>
      </div>

      {/* Filters */}
      <div className="gradient-card rounded-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none w-full sm:w-64"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              {disasterTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Showing {filteredData.length} of {disasterData.length} alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && disasterData.length === 0 && (
        <div className="gradient-card rounded-xl p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-white mb-2">Loading Alerts</h3>
            <p className="text-gray-400">Fetching latest disaster data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="gradient-card rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <h3 className="font-medium">Connection Error</h3>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && filteredData.length === 0 && !error && (
        <div className="gradient-card rounded-xl p-8">
          <div className="text-center">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Alerts Found</h3>
            <p className="text-gray-400">
              {disasterData.length === 0 
                ? 'Waiting for live data from monitoring system...'
                : 'Try adjusting your filters to see more results.'
              }
            </p>
          </div>
        </div>
      )}

      {/* Alerts List */}
      {filteredData.length > 0 && (
        <div className="space-y-4">
          {filteredData.map((alert) => (
            <div key={alert.id} className="gradient-card rounded-xl p-6 hover:bg-gray-800/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{getDisasterIcon(alert.disaster_type)}</div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {alert.disaster_type?.charAt(0).toUpperCase() + alert.disaster_type?.slice(1)} Alert
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <span>@{alert.user?.username || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimeAgo(alert.created_at)}</span>
                      </div>
                      {alert.user?.followers_count && (
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{alert.user.followers_count.toLocaleString()} followers</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {alert.confidence_score && (
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Confidence</div>
                    <div className="text-lg font-semibold text-white">
                      {Math.round(alert.confidence_score * 100)}%
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-gray-300 leading-relaxed">{alert.text}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{formatLocation(alert.location)}</span>
                </div>

                {alert.keywords && alert.keywords.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {alert.keywords.slice(0, 4).map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Alerts
