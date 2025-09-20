import React, { useState } from 'react'
import { Map, Navigation, Clock, Fuel, AlertTriangle, Route, MapPin, Zap } from 'lucide-react'

const RouteOptimizer = () => {
  const [selectedRoute, setSelectedRoute] = useState(0)

  const routes = [
    {
      id: 1,
      name: 'Primary Route',
      destination: 'Kuala Lumpur Flood Zone',
      distance: '12.4 km',
      duration: '18 min',
      traffic: 'Light',
      safety: 'High',
      fuel: '2.1L',
      status: 'Recommended',
      waypoints: ['KLCC', 'Ampang Park', 'Disaster Site'],
      hazards: ['Road closure at Jalan Raja Laut'],
      color: 'green'
    },
    {
      id: 2,
      name: 'Alternative Route',
      destination: 'Kuala Lumpur Flood Zone',
      distance: '15.8 km',
      duration: '22 min',
      traffic: 'Moderate',
      safety: 'Medium',
      fuel: '2.7L',
      status: 'Available',
      waypoints: ['Bukit Bintang', 'Chow Kit', 'Disaster Site'],
      hazards: ['Heavy traffic on Jalan Tuanku Abdul Rahman'],
      color: 'yellow'
    },
    {
      id: 3,
      name: 'Emergency Route',
      destination: 'Kuala Lumpur Flood Zone',
      distance: '9.2 km',
      duration: '25 min',
      traffic: 'Heavy',
      safety: 'Low',
      fuel: '1.8L',
      status: 'Emergency Only',
      waypoints: ['Masjid Jamek', 'Central Market', 'Disaster Site'],
      hazards: ['Flooded sections', 'Unstable road conditions'],
      color: 'red'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recommended': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Available': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Emergency Only': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white p-2">
              <img 
                src="https://cdn.chatandbuild.com/users/688b11cfde83ff4065553da3/cloud-cuties-1758351688316-474152956-1758351688316-440085577.png" 
                alt="Cloud Cuties Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-4xl font-bold text-white">Smart Route Optimizer</h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            AI-powered route planning that considers real-time traffic, weather conditions, and disaster zones to ensure fastest and safest rescue operations
          </p>
        </div>

        {/* Route Planning Interface */}
        <div className="gradient-card rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Route Planning</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Starting Point</label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-800 rounded-lg">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span className="text-white">Fire Station Kuala Lumpur</span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Destination</label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-800 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-white">Flood Zone - KLCC Area</span>
                  </div>
                </div>
                <button className="btn-primary w-full py-3 rounded-lg">
                  <Route className="h-4 w-4 mr-2" />
                  Calculate Optimal Routes
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Live Conditions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Traffic Status</span>
                  <span className="text-yellow-400">Moderate</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Weather</span>
                  <span className="text-blue-400">Heavy Rain</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Road Closures</span>
                  <span className="text-red-400">3 Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Emergency Priority</span>
                  <span className="text-green-400">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Route Options */}
        <div className="space-y-6">
          {routes.map((route, index) => (
            <div 
              key={route.id} 
              className={`gradient-card rounded-xl p-6 cursor-pointer transition-all ${
                selectedRoute === index ? 'ring-2 ring-blue-500 scale-[1.02]' : 'hover:scale-[1.01]'
              }`}
              onClick={() => setSelectedRoute(index)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                    <Navigation className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{route.name}</h3>
                    <p className="text-gray-400">{route.destination}</p>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(route.status)}`}>
                  {route.status}
                </span>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Map className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-400 text-sm">Distance</span>
                  </div>
                  <div className="text-xl font-bold text-white">{route.distance}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-green-400" />
                    <span className="text-gray-400 text-sm">Duration</span>
                  </div>
                  <div className="text-xl font-bold text-white">{route.duration}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Fuel className="h-4 w-4 text-yellow-400" />
                    <span className="text-gray-400 text-sm">Fuel</span>
                  </div>
                  <div className="text-xl font-bold text-white">{route.fuel}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-400 text-sm">Safety</span>
                  </div>
                  <div className="text-xl font-bold text-white">{route.safety}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-2">Waypoints</h4>
                  <div className="space-y-2">
                    {route.waypoints.map((waypoint, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-gray-400 text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span>{waypoint}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Hazards & Warnings</h4>
                  <div className="space-y-2">
                    {route.hazards.map((hazard, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-yellow-400 text-sm">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{hazard}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedRoute === index && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex space-x-4">
                    <button className="btn-primary px-6 py-2 rounded-lg">
                      <Zap className="h-4 w-4 mr-2" />
                      Start Navigation
                    </button>
                    <button className="btn-secondary px-6 py-2 rounded-lg">
                      Share Route
                    </button>
                    <button className="btn-secondary px-6 py-2 rounded-lg">
                      Save Route
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="gradient-card rounded-xl p-6 mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Live Route Visualization</h3>
          <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Interactive map with real-time route visualization</p>
              <p className="text-gray-500 text-sm">Google Maps integration will be implemented here</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RouteOptimizer
