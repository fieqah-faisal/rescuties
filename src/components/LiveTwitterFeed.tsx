import React from 'react'
import { Twitter, MapPin, Clock, AlertTriangle, TrendingUp } from 'lucide-react'
import { useDisasterData } from '../hooks/useDisasterData'
import { TwitterDisasterData } from '../utils/s3Service'

const LiveTwitterFeed = () => {
  const { data: twitterData, loading, error, lastUpdated, refetch } = useDisasterData(30000)

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getDisasterIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'flood':
        return '🌊'
      case 'landslide':
        return '⛰️'
      case 'earthquake':
        return '🌍'
      case 'fire':
        return '🔥'
      default:
        return '⚠️'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (loading && twitterData.length === 0) {
    return (
      <div className="gradient-card rounded-xl p-6">
        <div className="flex items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p className="text-gray-400">Loading live Twitter data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="gradient-card rounded-xl p-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">Connection Error</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="btn-primary px-4 py-2 rounded-lg"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Twitter className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Live Twitter Alerts</h3>
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
            LIVE
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              Updated {formatTimeAgo(lastUpdated.toISOString())}
            </span>
          )}
          <button 
            onClick={refetch}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {twitterData.length === 0 ? (
          <div className="text-center py-8">
            <Twitter className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No disaster alerts detected yet</p>
            <p className="text-gray-500 text-sm">Monitoring Twitter for emergency situations...</p>
          </div>
        ) : (
          twitterData.map((tweet) => (
            <div key={tweet.id} className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getDisasterIcon(tweet.disaster_type)}</div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white font-medium">@{tweet.user.username}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(tweet.severity)}`}>
                        {tweet.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(tweet.created_at)}</span>
                      {tweet.location && (
                        <>
                          <MapPin className="h-3 w-3 ml-2" />
                          <span>{tweet.location.place_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-gray-400">{Math.round(tweet.confidence_score * 100)}%</span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-3 leading-relaxed">{tweet.text}</p>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Type:</span>
                  <span className="text-xs text-blue-400 font-medium">{tweet.disaster_type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Keywords:</span>
                  <div className="flex space-x-1">
                    {tweet.keywords.slice(0, 3).map((keyword, index) => (
                      <span key={index} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default LiveTwitterFeed
