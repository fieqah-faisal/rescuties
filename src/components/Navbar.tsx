import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, AlertTriangle, Map, Home, User, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user, isLoggedIn } = useAuth()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const NavLink = ({ to, children, icon: Icon }: { to: string, children: React.ReactNode, icon: any }) => (
    <Link 
      to={to} 
      className={`relative flex items-center space-x-2 text-white hover:text-blue-300 transition-all duration-300 group py-2 ${
        isActive(to) ? 'text-white' : ''
      }`}
    >
      <Icon className={`h-4 w-4 transition-colors duration-300 ${
        isActive(to) ? 'text-blue-400' : 'group-hover:text-blue-400'
      }`} />
      <span className="relative">
        {children}
        {/* Blue gradient underline */}
        <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 transition-all duration-300 ${
          isActive(to) ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
        }`}></span>
      </span>
    </Link>
  )

  const NavButton = ({ onClick, children, icon: Icon }: { onClick: () => void, children: React.ReactNode, icon: any }) => (
    <button 
      onClick={onClick}
      className="relative flex items-center space-x-2 text-white hover:text-blue-300 transition-all duration-300 group py-2"
    >
      <Icon className="h-4 w-4 transition-colors duration-300 group-hover:text-blue-400" />
      <span className="relative">
        {children}
        {/* Blue gradient underline */}
        <span className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 transition-all duration-300 w-0 opacity-0 group-hover:w-full group-hover:opacity-100"></span>
      </span>
    </button>
  )

  const MobileNavLink = ({ to, children, icon: Icon }: { to: string, children: React.ReactNode, icon: any }) => (
    <Link 
      to={to} 
      className={`relative flex items-center space-x-2 text-white hover:text-blue-300 transition-all duration-300 py-3 ${
        isActive(to) ? 'text-white' : ''
      }`}
      onClick={() => setIsOpen(false)}
    >
      <Icon className={`h-4 w-4 transition-colors duration-300 ${
        isActive(to) ? 'text-blue-400' : ''
      }`} />
      <span className="relative">
        {children}
        {/* Blue gradient underline for mobile */}
        <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 transition-all duration-300 ${
          isActive(to) ? 'w-full opacity-100' : 'w-0 opacity-0'
        }`}></span>
      </span>
    </Link>
  )

  const MobileNavButton = ({ onClick, children, icon: Icon }: { onClick: () => void, children: React.ReactNode, icon: any }) => (
    <button 
      onClick={() => {
        onClick()
        setIsOpen(false)
      }}
      className="relative flex items-center space-x-2 text-white hover:text-blue-300 transition-all duration-300 py-3 w-full text-left"
    >
      <Icon className="h-4 w-4 transition-colors duration-300" />
      <span className="relative">
        {children}
        {/* Blue gradient underline for mobile */}
        <span className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 transition-all duration-300 w-0 opacity-0"></span>
      </span>
    </button>
  )

  // Show login button if not authenticated
  if (!isLoggedIn) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 transparent-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img 
                  src="https://cdn.chatandbuild.com/users/688b11cfde83ff4065553da3/cloud-cuties-1-1758355206652-870178326-1758355206651-969070550.png" 
                  alt="Rescuties Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl brand-font bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Rescuties
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="btn-primary px-6 py-2 rounded-lg text-white font-medium transition-all"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="btn-secondary px-6 py-2 rounded-lg text-white font-medium transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transparent-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img 
                src="https://cdn.chatandbuild.com/users/688b11cfde83ff4065553da3/cloud-cuties-1-1758355206652-870178326-1758355206651-969070550.png" 
                alt="Rescuties Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl brand-font bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Rescuties
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" icon={Home}>Home</NavLink>
            <NavLink to="/alerts" icon={AlertTriangle}>Alerts</NavLink>
            <NavLink to="/routes" icon={Map}>Routes</NavLink>
            <NavLink to="/profile" icon={User}>Profile</NavLink>
            
            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-3 text-gray-300">
                <span className="text-sm">Welcome, {user.username}</span>
              </div>
            )}
            
            <NavButton onClick={handleLogout} icon={LogOut}>Logout</NavButton>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:text-blue-400 hover:bg-white/10 transition-all duration-300"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 mobile-nav-bg animate-slideIn">
            <div className="px-4 py-6 space-y-2">
              <MobileNavLink to="/" icon={Home}>Home</MobileNavLink>
              <MobileNavLink to="/alerts" icon={AlertTriangle}>Alerts</MobileNavLink>
              <MobileNavLink to="/routes" icon={Map}>Routes</MobileNavLink>
              <MobileNavLink to="/profile" icon={User}>Profile</MobileNavLink>
              
              {/* User Info Mobile */}
              {user && (
                <div className="py-3 text-gray-300 border-t border-gray-600 mt-4 pt-4">
                  <span className="text-sm">Welcome, {user.username}</span>
                </div>
              )}
              
              <MobileNavButton onClick={handleLogout} icon={LogOut}>Logout</MobileNavButton>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
