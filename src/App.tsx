import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Dashboard from './components/Dashboard'
import AlertSystem from './components/AlertSystem'
import RouteOptimizer from './components/RouteOptimizer'
import UserProfile from './components/UserProfile'
import Login from './components/Login'
import SignUp from './components/SignUp'
import ProtectedRoute from './components/ProtectedRoute'
import ChatBot from './components/ChatBot'
import Footer from './components/Footer'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen gradient-bg-1 relative overflow-hidden">
          {/* Floating blue orbs for background decoration */}
          <div className="floating-orb"></div>
          <div className="floating-orb"></div>
          <div className="floating-orb"></div>
          
          <div className="relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected Routes */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={
                      <>
                        <Hero />
                        <Dashboard />
                        <RouteOptimizer />
                      </>
                    } />
                    <Route path="/alerts" element={<AlertSystem />} />
                    <Route path="/routes" element={<RouteOptimizer />} />
                    <Route path="/profile" element={<UserProfile />} />
                  </Routes>
                  <ChatBot />
                  <Footer />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
