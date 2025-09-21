import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AlertSystem from './components/AlertSystem'
import RouteOptimizer from './components/RouteOptimizer'
import NotificationCenter from './components/NotificationCenter'
import ChatBot from './components/ChatBot'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alerts" element={<AlertSystem />} />
            <Route path="/routes" element={<RouteOptimizer />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationCenter />} />
            <Route path="/chat" element={<ChatBot />} />
          </Routes>
        </main>
        
        {/* Sidebar Components - Always Present */}
        <ChatBot />
        <NotificationCenter />
      </div>
    </Router>
  )
}

// Profile Page Component
const ProfilePage = () => {
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
            <h2 className="text-4xl font-bold text-white">User Profile</h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Manage your emergency contacts, preferences, and rescue team information
          </p>
        </div>

        {/* Profile Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 gradient-card rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Profile Information</h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Emergency Responder"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Role</label>
                  <select className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none">
                    <option>Emergency Coordinator</option>
                    <option>Rescue Team Leader</option>
                    <option>Medical Officer</option>
                    <option>Communications Officer</option>
                  </select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="responder@rescuties.my"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+60123456789"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Location</label>
                <input
                  type="text"
                  defaultValue="Kuala Lumpur, Malaysia"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-4">
                <button className="btn-primary px-6 py-2 rounded-lg">
                  Save Changes
                </button>
                <button className="btn-secondary px-6 py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="gradient-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Activity Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Alerts Handled</span>
                  <span className="text-blue-400 font-semibold">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">People Rescued</span>
                  <span className="text-green-400 font-semibold">123</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Response Time</span>
                  <span className="text-yellow-400 font-semibold">4.2 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="text-purple-400 font-semibold">96.8%</span>
                </div>
              </div>
            </div>

            <div className="gradient-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Emergency Contacts</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="font-medium text-white">Fire Department</div>
                  <div className="text-sm text-gray-400">994</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="font-medium text-white">Police</div>
                  <div className="text-sm text-gray-400">999</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="font-medium text-white">Medical Emergency</div>
                  <div className="text-sm text-gray-400">999</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default App
