import React from 'react'
import { AlertTriangle, MapPin, Clock, Users } from 'lucide-react'
import { useDisasterData } from '../hooks/useDisasterData'

const AlertsOverview = () => {
  const { data: alerts, loading, error } = useDisasterData()

  if (error) {
    return (
      <div className="gradient-card rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Alerts</h3>
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-400">Unable to load alerts</p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="gradient-card rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Alerts</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20'
      case 'high': return 'text-orange-400 bg-orange-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-blue-400 bg-blue-500/20'
    }
  }

  const getDisasterIcon = (type: string) => {
    switch (type) {
      case 'flood': return '🌊'
      case 'landslide': return '⛰️'
      case 'earthquake': return '🌍'
      case 'storm': return '⛈️'
      default: return '⚠️'
    }
  }

  return (
    <div className="gradient-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Recent Alerts</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No active alerts</p>
          <p className="text-sm text-gray-500 mt-2">All systems normal</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.slice(0, 5).map((alert) => (
            <div key={alert.id} className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getDisasterIcon(alert.disaster_type)}</span>
                  <div>
                    <h4 className="text-white font-medium capitalize">
                      {alert.disaster_type} Alert
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{alert.location}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-300 text-sm mb-3">{alert.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{alert.source}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full ${
                  alert.status === 'active' ? 'bg-red-500/20 text-red-400' :
                  alert.status === 'monitoring' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {alert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AlertsOverview
