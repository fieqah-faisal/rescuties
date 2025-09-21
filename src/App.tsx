import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './components/Dashboard'
import AlertSystem from './components/AlertSystem'
import RouteOptimizer from './components/RouteOptimizer'
import UserProfile from './components/UserProfile'
import ChatBot from './components/ChatBot'
import NotificationCenter from './components/NotificationCenter'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <Navbar />
        
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alerts" element={<AlertSystem />} />
            <Route path="/routes" element={<RouteOptimizer />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>

        {/* Floating Components */}
        <ChatBot />
        <NotificationCenter />
      </div>
    </Router>
  )
}

export default App
