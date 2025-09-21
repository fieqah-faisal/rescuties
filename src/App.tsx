import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Alerts from './pages/Alerts'
import RoutesPage from './pages/Routes'
import Chatbot from './components/Chatbot'
import NotificationCenter from './components/NotificationCenter'
import SNSTestPanel from './components/SNSTestPanel'
import S3TestPanel from './components/S3TestPanel'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/routes" element={<RoutesPage />} />
            </Routes>
          </main>
          
          {/* Floating Components */}
          <Chatbot />
          <NotificationCenter />
          <SNSTestPanel />
          <S3TestPanel />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
