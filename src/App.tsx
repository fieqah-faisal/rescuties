import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Dashboard from './components/Dashboard'
import AlertSystem from './components/AlertSystem'
import RouteOptimizer from './components/RouteOptimizer'
import UserProfile from './components/UserProfile'
import Login from './components/Login'
import ChatBot from './components/ChatBot'
import LexChatBot from './components/LexChatBot'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="min-h-screen gradient-bg-1 relative overflow-hidden">
        {/* Floating blue orbs for background decoration */}
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        
        <div className="relative z-10">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <>
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
                {/* Basic AI Assistant (left side) */}
                <ChatBot />
                {/* Amazon Lex Assistant (right side) */}
                <LexChatBot />
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
