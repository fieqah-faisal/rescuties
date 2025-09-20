import React, { useEffect, useState } from 'react'
import { Activity, Users, MapPin, AlertTriangle, TrendingUp, Clock, Shield, Flame, Mountain, Waves, Zap } from 'lucide-react'
import { googleMapsService } from '../utils/googleMaps'
import GoogleMap from './GoogleMap'

const Dashboard = () => {
  const [mapMarkers, setMapMarkers] = useState<Array<{
    position: { lat: number; lng: number };
    title: string;
    icon?: string;
    infoWindow?: string;
  }>>([])

  const getDisasterIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'flood':
        return Waves
      case 'landslide':
        return Mountain
      case 'wildfire':
        return Flame
      case 'earthquake':
        return Zap
      default:
        return AlertTriangle
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-red-500/20',
          text: 'text-red-400',
          dot: 'bg-red-500'
        }
      case 'medium':
        return {
          bg: 'bg-yellow-500/20',
          text: 'text-yellow-400',
          dot: 'bg-yellow-500'
        }
      case 'low':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-400',
          dot: 'bg-green-500'
        }
      default:
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-400',
          dot: 'bg-gray-500'
        }
    }
  }

  const getDisasterMarkerIcon = (type: string, severity: string) => {
    const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/';
    switch (severity.toLowerCase()) {
      case 'high':
        return baseUrl + 'red-dot.png';
      case 'medium':
        return baseUrl + 'yellow-dot.png';
      case 'low':
        return baseUrl + 'green-dot.png';
      default:
        return baseUrl + 'blue-dot.png';
    }
  }

  // Real disaster locations in Malaysia with coordinates
  const liveAlerts = [
    {
      type: 'Flood',
      location: 'Kuala Lumpur City Center',
      coordinates: { lat: 3.1478, lng: 101.6953 },
      coordinatesText: '3.1478° N, 101.6953° E',
      timeDetected: '2 min ago',
      severity: 'High',
      description: 'Flash flooding reported in city center due to heavy rainfall'
    },
    {
      type: 'Landslide',
      location: 'Cameron Highlands',
      coordinates: { lat: 4.4698, lng: 101.3779 },
      coordinatesText: '4.4698° N, 101.3779° E',
      timeDetected: '15 min ago',
      severity: 'Medium',
      description: 'Slope instability detected on main road to Tanah Rata'
    },
    {
      type: 'Wildfire',
      location: 'Taman Negara Pahang',
      coordinates: { lat: 4.2105, lng: 101.9758 },
      coordinatesText: '4.2105° N, 101.9758° E',
      timeDetected: '45 min ago',
      severity: 'High',
      description: 'Forest fire spreading rapidly in national park area'
    },
    {
      type: 'Earthquake',
      location: 'Kota Kinabalu, Sabah',
      coordinates: { lat: 5.9804, lng: 116.0735 },
      coordinatesText: '5.9804° N, 116.0735° E',
      timeDetected: '1 hour ago',
      severity: 'Low',
      description: 'Minor tremor detected, magnitude 3.2 near Mount Kinabalu'
    },
    {
      type: 'Flood',
      location: 'George Town, Penang',
      coordinates: { lat: 5.4164, lng: 100.3327 },
      coordinatesText: '5.4164° N, 100.3327° E',
      timeDetected: '2 hours ago',
      severity: 'Medium',
      description: 'Rising water levels in coastal areas due to high tide'
    }
  ]

  useEffect(() => {
    // Initialize Google Maps service
    googleMapsService.initialize();

    // Create map markers for disaster locations
    const markers = liveAlerts.map(alert => ({
      position: alert.coordinates,
      title: `${alert.type} - ${alert.location}`,
      icon: getDisasterMarkerIcon(alert.type, alert.severity),
      infoWindow: `
        <div style="color: #000; font-family: Arial, sans-serif; max-width: 250px;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937;">${alert.type}</h3>
          <p style="margin: 0 0 4px 0; font-weight: bold;">${alert.location}</p>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">${alert.coordinatesText}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px;">${alert.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="background: ${alert.severity === 'High' ? '#ef4444' : alert.severity === 'Medium' ? '#f59e0b' : '#10b981'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${alert.severity}</span>
            <span style="font-size: 12px; color: #6b7280;">${alert.timeDetected}</span>
          </div>
        </div>
      `
    }));

    setMapMarkers(markers);
  }, []);

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <img 
                src="https://cdn.chatandbuild.com/users/688b11cfde83ff4065553da3/cloud-cuties-1-1758355206652-870178326-1758355206651-969070550.png" 
                alt="Rescuties Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-4xl font-bold text-white">Live Disaster Monitoring</h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time disaster tracking across Malaysia with Google Maps integration and AI-powered analytics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="gradient-card rounded-xl p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-red-400">{liveAlerts.length}</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Active Alerts</h3>
            <p className="text-gray-400 text-sm">Live disaster monitoring</p>
          </div>

          <div className="gradient-card rounded-xl p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-400">12</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Rescue Teams</h3>
            <p className="text-gray-400 text-sm">Currently deployed</p>
          </div>

          <div className="gradient-card rounded-xl p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-400">847</span>
            </div>
            <h3 className="text-white font-semibold mb-2">People Rescued</h3>
            <p className="text-gray-400 text-sm">This month</p>
          </div>

          <div className="gradient-card rounded-xl p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-purple-400">98.7%</span>
            </div>
            <h3 className="text-white font-semibold mb-2">System Uptime</h3>
            <p className="text-gray-400 text-sm">Last 30 days</p>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Live Disaster Alerts */}
          <div className="lg:col-span-2 gradient-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Alerts</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {liveAlerts.map((alert, index) => {
                const DisasterIcon = getDisasterIcon(alert.type)
                const severityColors = getSeverityColor(alert.severity)
                
                return (
                  <div key={index} className="p-5 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/50 hover:border-blue-500/30">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                          <DisasterIcon className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h4 className="text-white font-semibold text-lg">{alert.type}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${severityColors.bg} ${severityColors.text}`}>
                              {alert.severity}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-400 mb-2">
                            <MapPin className="h-4 w-4 text-blue-400" />
                            <span className="font-medium">{alert.location}</span>
                            <span className="text-xs">({alert.coordinatesText})</span>
                          </div>
                          <p className="text-gray-300 text-sm">{alert.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{alert.timeDetected}</span>
                      </div>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${severityColors.dot}`}></div>
                        <span className="text-xs text-gray-400">Status: Active</span>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">
                        View on Map →
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="gradient-card rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button className="w-full btn-primary p-4 rounded-lg text-left">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Create Alert</div>
                    <div className="text-sm opacity-80">Manual disaster report</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full btn-secondary p-4 rounded-lg text-left">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Deploy Team</div>
                    <div className="text-sm opacity-80">Send rescue units</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full btn-secondary p-4 rounded-lg text-left">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5" />
                  <div>
                    <div className="font-medium">View Analytics</div>
                    <div className="text-sm opacity-80">Detailed reports</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Live Disaster Map */}
        <div className="gradient-card rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Live Disaster Map</h3>
          <div className="bg-gray-800 rounded-lg h-96 overflow-hidden">
            <GoogleMap
              center={{ lat: 4.2105, lng: 108.9758 }} // Center of Malaysia
              zoom={6}
              markers={mapMarkers}
              className="w-full h-full"
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-400">High Severity</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-400">Medium Severity</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-400">Low Severity</span>
              </div>
            </div>
            <span className="text-gray-400">Real-time Google Maps integration</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
