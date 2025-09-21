import React, { useState, useEffect } from 'react'
import { MapPin, AlertTriangle, Droplets, Mountain, Zap, Wind } from 'lucide-react'
import GoogleMap from './GoogleMap'
import { useDisasterData } from '../hooks/useDisasterData'

interface DisasterMarker {
  position: { lat: number; lng: number };
  title: string;
  icon?: string;
  infoWindow: string;
  severity: 'low' | 'medium' | 'high';
  type: string;
}

const DisasterMap: React.FC = () => {
  const { data: disasterData, loading } = useDisasterData()
  const [selectedDisaster, setSelectedDisaster] = useState<any>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 3.1390, lng: 101.6869 }) // Kuala Lumpur
  const [markers, setMarkers] = useState<DisasterMarker[]>([])

  // Convert disaster data to map markers
  useEffect(() => {
    if (disasterData && disasterData.length > 0) {
      const disasterMarkers: DisasterMarker[] = disasterData.map((disaster) => {
        const getMarkerIcon = (type: string, severity: string) => {
          const baseUrl = 'data:image/svg+xml;base64,'
          let color = '#10b981' // green for low
          if (severity === 'medium') color = '#f59e0b' // yellow
          if (severity === 'high') color = '#ef4444' // red

          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>`
          return baseUrl + btoa(svg)
        }

        return {
          position: {
            lat: disaster.latitude || 3.1390 + (Math.random() - 0.5) * 0.5,
            lng: disaster.longitude || 101.6869 + (Math.random() - 0.5) * 0.5
          },
          title: `${disaster.disaster_type} - ${disaster.severity}`,
          icon: getMarkerIcon(disaster.disaster_type, disaster.severity),
          infoWindow: `
            <div class="p-3 max-w-xs">
              <h3 class="font-bold text-lg mb-2">${disaster.disaster_type.charAt(0).toUpperCase() + disaster.disaster_type.slice(1)} Alert</h3>
              <p class="text-sm mb-2"><strong>Severity:</strong> ${disaster.severity.charAt(0).toUpperCase() + disaster.severity.slice(1)}</p>
              <p class="text-sm mb-2"><strong>Location:</strong> ${disaster.location || 'Malaysia'}</p>
              <p class="text-sm mb-2"><strong>Time:</strong> ${new Date(disaster.timestamp).toLocaleString()}</p>
              ${disaster.description ? `<p class="text-sm"><strong>Details:</strong> ${disaster.description}</p>` : ''}
            </div>
          `,
          severity: disaster.severity,
          type: disaster.disaster_type
        }
      })

      setMarkers(disasterMarkers)

      // Center map on first high severity disaster or first disaster
      const highSeverityDisaster = disasterData.find(d => d.severity === 'high')
      if (highSeverityDisaster && highSeverityDisaster.latitude && highSeverityDisaster.longitude) {
        setMapCenter({
          lat: highSeverityDisaster.latitude,
          lng: highSeverityDisaster.longitude
        })
      }
    }
  }, [disasterData])

  const getDisasterIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'flood':
        return <Droplets className="w-5 h-5" />
      case 'landslide':
        return <Mountain className="w-5 h-5" />
      case 'earthquake':
        return <Zap className="w-5 h-5" />
      case 'storm':
        return <Wind className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-400 bg-red-500/20'
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20'
      case 'low':
        return 'text-green-400 bg-green-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <div className="gradient-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Disaster Map</h2>
            <p className="text-gray-400 text-sm">Real-time disaster locations</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-400">High</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-400">Medium</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-400">Low</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="relative h-96 rounded-lg overflow-hidden border border-gray-700">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              </div>
            ) : (
              <GoogleMap
                center={mapCenter}
                zoom={10}
                markers={markers}
                className="w-full h-full"
              />
            )}
          </div>
        </div>

        {/* Disaster List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Active Disasters</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
              </div>
            ) : disasterData && disasterData.length > 0 ? (
              disasterData.slice(0, 8).map((disaster, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border border-gray-700 cursor-pointer transition-all hover:border-blue-500/50 ${
                    selectedDisaster?.id === disaster.id ? 'border-blue-500 bg-blue-500/10' : 'bg-gray-800/30'
                  }`}
                  onClick={() => {
                    setSelectedDisaster(disaster)
                    if (disaster.latitude && disaster.longitude) {
                      setMapCenter({ lat: disaster.latitude, lng: disaster.longitude })
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getSeverityColor(disaster.severity)}`}>
                        {getDisasterIcon(disaster.disaster_type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">
                          {disaster.disaster_type.charAt(0).toUpperCase() + disaster.disaster_type.slice(1)}
                        </h4>
                        <p className="text-xs text-gray-400">{disaster.location || 'Malaysia'}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(disaster.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(disaster.severity)}`}>
                      {disaster.severity}
                    </span>
                  </div>
                  {disaster.description && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {disaster.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No active disasters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMapCenter({ lat: 3.1390, lng: 101.6869 })}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            Reset View
          </button>
          <span className="text-sm text-gray-400">
            Showing {markers.length} disaster{markers.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

export default DisasterMap
