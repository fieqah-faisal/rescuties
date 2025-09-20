import React from 'react'
import { Link } from 'react-router-dom'
import { Cloud, Github, Twitter, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="relative py-16 border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
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
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              AI-driven disaster response platform powered by AWS cloud services, 
              helping save lives across Malaysia through real-time monitoring and intelligent alerts.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Cloud className="h-4 w-4 text-blue-400" />
              <span>Powered by AWS Cloud Infrastructure</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/alerts" className="hover:text-blue-400 transition-colors">Alert System</Link></li>
              <li><Link to="/routes" className="hover:text-blue-400 transition-colors">Route Optimizer</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">AI Assistant</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 <span className="brand-font text-blue-400">Rescuties</span>. Built for disaster response and emergency management.
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
