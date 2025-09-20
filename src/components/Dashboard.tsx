import React from 'react'
import { Activity, Users, MapPin, AlertTriangle, TrendingUp, Clock, Shield } from 'lucide-react'

const Dashboard = () => {
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
            <h2 className="text-4xl font-bold text-white">Real-Time Dashboard</h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Monitor disaster situations across Malaysia with AI-powered analytics and real-time data visualization
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="gradient-card rounded-xl p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-red-400">3</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Active Alerts</h3>
            <p className="text-gray-400 text-sm">Flood warnings in Selangor</p>
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Alerts */}
          <div className="lg:col-span-2 gradient-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Alerts</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {[
                { type: 'Flood', location: 'Kuala Lumpur', time: '2 min ago', severity: 'High', color: 'red' },
                { type: 'Landslide', location: 'Cameron Highlands', time: '15 min ago', severity: 'Medium', color: 'yellow' },
                { type: 'Flash Flood', location: 'Penang', time: '1 hour ago', severity: 'Low', color: 'green' },
              ].map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.color === 'red' ? 'bg-red-500' : 
                      alert.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <div className="text-white font-medium">{alert.type} - {alert.location}</div>
                      <div className="text-gray-400 text-sm">{alert.time}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    alert.color === 'red' ? 'bg-red-500/20 text-red-400' : 
                    alert.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              ))}
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
      </div>
    </section>
  )
}

export default Dashboard
