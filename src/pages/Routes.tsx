import React, { useState, useEffect } from 'react'
import { MapPin, Navigation, Clock, AlertTriangle, Route, Car, Users, Shield } from 'lucide-react'

interface RouteData {
  id: string
  name: string
  from: string
  to: string
  distance: string
  duration: string
  status: 'safe' | 'caution' | 'blocked'
  traffic: 'light' | 'moderate' | 'heavy'
  lastUpdated: string
  evacuationRoute: boolean
}

const Routes = () => {
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading route data
    const mockRoutes: RouteData[] = [
      {
        id: '1',
        name: 'NKVE Highway - Emergency Route',
        from: 'Kuala Lumpur City Center',
        to: 'Shah Alam Safe Zone',
        distance: '28.5 km',
        duration: '35 min',
        status: 'safe',
        traffic: 'light',
        lastUpdated: '2 min ago',
        evacuationRoute: true
      },
      {
        id: '2',
        name: 'Federal Highway Alternative',
        from: 'Petaling Jaya',
        to: 'Klang Valley Shelter',
        distance: '22.1 km',
        duration: '42 min',
        status: 'caution',
        traffic: 'moderate',
        lastUpdated: '5 min ago',
        evacuationRoute: true
      },
      {
        id: '3',
        name: 'PLUS Highway North',
        from: 'Kuala Lumpur',
        to: 'Ipoh Emergency Center',
        distance: '205 km',
        duration: '2h 15min',
        status: 'safe',
        traffic: 'light',
        lastUpdated: '1 min ago',
        evacuationRoute: true
      },
      {
        id: '4',
        name: 'Kesas Highway',
        from: 'Subang Jaya',
        to: 'Putrajaya Safe Zone',
        distance: '35.2 km',
        duration: '1h 5min',
        status: 'blocked',
        traffic: 'heavy',
        lastUpdated: '8 min ago',
        evacuationRoute: false
      },
      {
        id: '5',
        name: 'MRR2 Ring Road',
        from: 'Ampang',
        to: 'Gombak Shelter',
        distance: '18.7 km',
        duration: '28 min',
        status: 'safe',
        traffic: 'light',
        lastUpdated: '3 min ago',
        evacuationRoute: true
      }
    ]

    setTimeout(() => {
      setRoutes(mockRoutes)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-400 bg-green-500/20'
      case 'caution': return 'text-yellow-400 bg-yellow-500/20'
      case 'blocked': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getTrafficColor = (traffic: string) => {
    switch (traffic) {
      case 'light': return 'text-green-400'
      case 'moderate': return 'text-yellow-400'
      case 'heavy': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const safeRoutes = routes.filter(route => route.status === 'safe')
  const evacuationRoutes = routes.filter(route => route.evacuationRoute)

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Smart Route Optimizer
        </h1>
        <p className="text-gray-400">
          AI-powered evacuation routes and real-time traffic monitoring
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Safe Routes</p>
              <p className="text-2xl font-bold text-green-400">
                {loading ? '...' : safeRoutes.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Evacuation Routes</p>
              <p className="text-2xl font-bold text-blue-400">
                {loading ? '...' : evacuationRoutes.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Route className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-purple-400">1,247</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Response</p>
              <p className="text-2xl font-bold text-cyan-400">2.3s</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Routes List */}
        <div className="lg:col-span-2">
          <div className="gradient-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Available Routes</h2>
              <button className="btn-primary px-4 py-2 text-sm rounded-lg">
                Refresh Routes
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-800/50 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className={`p-5 rounded-lg border transition-all cursor-pointer ${
                      selectedRoute === route.id
                        ? 'bg-blue-500/10 border-blue-500/50'
                        : 'bg-gray-800/50 border-gray-700/50 hover:border-blue-500/30'
                    }`}
                    onClick={() => setSelectedRoute(route.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                          {route.evacuationRoute ? (
                            <Shield className="h-5 w-5 text-blue-400" />
                          ) : (
                            <Car className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{route.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{route.from} → {route.to}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                          {route.status.toUpperCase()}
                        </span>
                        {route.evacuationRoute && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                            EVACUATION
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Distance</p>
                        <p className="text-white font-medium">{route.distance}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Duration</p>
                        <p className="text-white font-medium">{route.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Traffic</p>
                        <p className={`font-medium ${getTrafficColor(route.traffic)}`}>
                          {route.traffic.charAt(0).toUpperCase() + route.traffic.slice(1)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>Updated {route.lastUpdated}</span>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">
                        View on Map
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map Placeholder & Quick Actions */}
        <div className="space-y-6">
          {/* Map Placeholder */}
          <div className="gradient-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Route Map</h3>
            <div className="aspect-square bg-gray-800/50 rounded-lg flex items-center justify-center border border-gray-700/50">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Interactive map will load here</p>
                <p className="text-gray-500 text-xs mt-1">Google Maps integration</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="gradient-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-primary py-3 rounded-lg flex items-center justify-center space-x-2">
                <Navigation className="h-4 w-4" />
                <span>Find Nearest Shelter</span>
              </button>
              <button className="w-full btn-secondary py-3 rounded-lg flex items-center justify-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Report Road Hazard</span>
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <Users className="h-4 w-4" />
                <span>Share Location</span>
              </button>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="gradient-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Emergency Contacts</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Emergency Services</span>
                <span className="text-white font-medium">999</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fire Department</span>
                <span className="text-white font-medium">994</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">JPAM Hotline</span>
                <span className="text-white font-medium">03-8064 2222</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Flood Hotline</span>
                <span className="text-white font-medium">1-800-88-3999</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Routes
