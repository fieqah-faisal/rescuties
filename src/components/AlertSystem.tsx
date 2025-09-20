import React, { useState } from 'react'
import { AlertTriangle, MapPin, Clock, Users, Zap, Bell, Filter } from 'lucide-react'

const AlertSystem = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')

  const alerts = [
    {
      id: 1,
      type: 'Flood',
      location: 'Kuala Lumpur City Center',
      coordinates: '3.1390, 101.6869',
      severity: 'Critical',
      time: '2 minutes ago',
      affected: '~2,500 people',
      status: 'Active',
      description: 'Heavy rainfall causing severe flooding in downtown area. Water levels rising rapidly.',
      source: 'Social Media + Weather Station',
      confidence: '94%'
    },
    {
      id: 2,
      type: 'Landslide',
      location: 'Cameron Highlands',
      coordinates: '4.4698, 101.3831',
      severity: 'High',
      time: '15 minutes ago',
      affected: '~150 people',
      status: 'Monitoring',
      description: 'Soil instability detected after continuous rainfall. Road access partially blocked.',
      source: 'Sensor Network + Reports',
      confidence: '87%'
    },
    {
      id: 3,
      type: 'Flash Flood',
      location: 'Penang Georgetown',
      coordinates: '5.4164, 100.3327',
      severity: 'Medium',
      time: '1 hour ago',
      affected: '~800 people',
      status: 'Resolved',
      description: 'Rapid water accumulation in low-lying areas. Drainage systems overwhelmed.',
      source: 'CCTV + Social Media',
      confidence: '91%'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-green-500/20 text-green-400 border-green-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-red-500'
      case 'Monitoring': return 'bg-yellow-500'
      case 'Resolved': return 'bg-green-500'
      default: return 'bg-gray-500'
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
            <h2 className="text-4xl font-bold text-white">AI Alert System</h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time disaster detection powered by machine learning analysis of social media, weather data, and sensor networks
          </p>
        </div>

        {/* Alert Controls */}
        <div className="gradient-card rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-blue-400" />
              <span className="text-white font-medium">Alert Monitoring Status:</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-green-400 font-medium">Active</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500"
                >
                  <option value="all">All Alerts</option>
                  <option value="active">Active Only</option>
                  <option value="critical">Critical Only</option>
                </select>
              </div>
              <button className="btn-primary px-4 py-2 rounded-lg">
                <Zap className="h-4 w-4 mr-2" />
                Create Alert
              </button>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-6">
          {alerts.map((alert) => (
            <div key={alert.id} className="gradient-card rounded-xl p-6 hover:scale-[1.02] transition-transform">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(alert.status)}`}></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{alert.type} Alert</h3>
                    <div className="flex items-center space-x-4 text-gray-400 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{alert.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{alert.affected}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className="text-blue-400 font-medium text-sm">{alert.confidence}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span className="text-white font-medium">{alert.location}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{alert.coordinates}</p>
                  <p className="text-gray-300">{alert.description}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-400 text-sm">Data Source:</span>
                    <p className="text-white">{alert.source}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Status:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(alert.status)}`}></div>
                      <span className="text-white">{alert.status}</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="btn-primary px-4 py-2 rounded-lg text-sm">
                      Deploy Team
                    </button>
                    <button className="btn-secondary px-4 py-2 rounded-lg text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights */}
        <div className="gradient-card rounded-xl p-6 mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">AI Insights & Predictions</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">73%</div>
              <div className="text-gray-400">Flood Risk (Next 24h)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">2.3min</div>
              <div className="text-gray-400">Avg Detection Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">96.2%</div>
              <div className="text-gray-400">Prediction Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AlertSystem
