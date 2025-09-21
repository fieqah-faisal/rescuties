import React, { useState, useEffect } from 'react'
import { Twitter, MapPin, Clock, AlertTriangle, TrendingUp, RefreshCw, Database, Wifi, WifiOff } from 'lucide-react'
import { useDisasterData } from '../hooks/useDisasterData'
import type { TwitterDisasterData } from '../utils/s3Service'

const LiveTwitterFeed = () => {
  const { data: disasterData, loading, error, lastUpdated, refetch } = useDisasterData(30000) // Refresh every 30 seconds
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getDisasterIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'flood': return '🌊'
      case 'landslide': return '⛰️'
      case 'wildfire': return '🔥'
      case 'earthquake': return '⚡'
      case 'storm': return '🌪️'
      case 'tsunami': return '🌊'
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

  // Show loading state
  if (loading && disasterData.length === 0) {
    return (
      <div className="gradient-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Twitter className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live Disaster Alerts</h2>
              <p className="text-gray-400 text-sm">Real-time Twitter monitoring</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-blue-400 animate-pulse" />
            <span className="text-sm text-blue-400">Loading...</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-800/30">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Twitter className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Live Disaster Alerts</h2>
            <div className="flex items-center space-x-2">
              <p className="text-gray-400 text-sm">Real-time Twitter monitoring</p>
              {error ? (
                <WifiOff className="h-4 w-4 text-red-400" />
              ) : (
                <Wifi className="h-4 w-4 text-green-400" />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {lastUpdated && (
            <div className="text-xs text-gray-400">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm">Connection Error: {error}</span>
          </div>
          <p className="text-red-300 text-xs mt-1">
            Check S3 connection or wait for backend data to be available
          </p>
        </div>
      )}

      {disasterData.length === 0 && !loading ? (
        <div className="text-center py-12">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Disaster Alerts</h3>
          <p className="text-gray-400 text-sm mb-4">
            {error 
              ? 'Unable to connect to data source. Check S3 configuration.'
              : 'Waiting for live data from Twitter monitoring system...'
            }
          </p>
          <button
            onClick={handleManualRefresh}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            Check for Updates
          </button>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {disasterData.map((alert) => (
            <div key={alert.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getDisasterIcon(alert.disaster_type)}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">@{alert.user?.username || 'Unknown'}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(alert.created_at)}</span>
                      {alert.user?.followers_count && (
                        <>
                          <span>•</span>
                          <TrendingUp className="h-3 w-3" />
                          <span>{alert.user.followers_count.toLocaleString()} followers</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {alert.confidence_score && (
                  <div className="text-xs text-gray-400">
                    {Math.round(alert.confidence_score * 100)}% confidence
                  </div>
                )}
              </div>
              
              <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                {alert.text}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span>{formatLocation(alert.location)}</span>
                </div>
                
                {alert.keywords && alert.keywords.length > 0 && (
                  <div className="flex items-center space-x-1">
                    {alert.keywords.slice(0, 3).map((keyword, index) => (
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
      
      {disasterData.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Showing {disasterData.length} recent alerts</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live monitoring active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveTwitterFeed
