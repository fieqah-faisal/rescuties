import React from 'react'
import { Bell, AlertTriangle, Clock, MapPin, Users, Shield, Activity } from 'lucide-react'

const NotificationCenter = () => {
  const notifications = [
    {
      id: 1,
      type: 'flood',
      title: 'Flash Flood Alert - Kuala Lumpur',
      message: 'Severe flooding detected in KLCC area. Immediate evacuation recommended.',
      location: 'Kuala Lumpur City Center',
      severity: 'high',
      timestamp: '2 min ago',
      status: 'active'
    },
    {
      id: 2,
      type: 'landslide',
      title: 'Landslide Warning - Cameron Highlands',
      message: 'Slope instability detected on main road to Tanah Rata.',
      location: 'Cameron Highlands, Pahang',
      severity: 'medium',
      timestamp: '15 min ago',
      status: 'monitoring'
    },
    {
      id: 3,
      type: 'wildfire',
      title: 'Forest Fire Alert - Taman Negara',
      message: 'Rapidly spreading forest fire in national park area.',
      location: 'Taman Negara, Pahang',
      severity: 'high',
      timestamp: '45 min ago',
      status: 'active'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'low': return 'text-green-400 bg-green-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'flood': return '🌊'
      case 'landslide': return '⛰️'
      case 'wildfire': return '🔥'
      case 'earthquake': return '⚡'
      default: return '⚠️'
    }
  }

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
            <h2 className="text-4xl font-bold text-white">Notification Center</h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time disaster alerts and emergency notifications across Malaysia
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="gradient-card rounded-xl p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-red-400">{notifications.length}</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Active Alerts</h3>
            <p className="text-gray-400 text-sm">Current notifications</p>
          </div>

          <div className="gradient-card rounded-xl p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-orange-400">2</span>
            </div>
            <h3 className="text-white font-semibold mb-2">High Priority</h3>
            <p className="text-gray-400 text-sm">Urgent notifications</p>
          </div>

          <div className="gradient-card rounded-xl p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-400">1,247</span>
            </div>
            <h3 className="text-white font-semibold mb-2">People Notified</h3>
            <p className="text-gray-400 text-sm">Last 24 hours</p>
          </div>

          <div className="gradient-card rounded-xl p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-400">99.2%</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Delivery Rate</h3>
            <p className="text-gray-400 text-sm">Notification success</p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Notifications</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">Mark All Read</button>
          </div>
          
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-5 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/50 hover:border-blue-500/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                      <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="text-white font-semibold text-lg">{notification.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(notification.severity)}`}>
                          {notification.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400 mb-2">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        <span className="font-medium">{notification.location}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{notification.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{notification.timestamp}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      notification.status === 'active' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-xs text-gray-400">Status: {notification.status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">
                      View Details
                    </button>
                    <button className="text-gray-400 hover:text-gray-300 text-xs font-medium">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotificationCenter
