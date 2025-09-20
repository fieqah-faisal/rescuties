import React from 'react'
import { Shield, Zap, MapPin, Brain, Cloud } from 'lucide-react'

const Hero = () => {
  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full glass-effect mb-8">
            <Cloud className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Powered by AWS Cloud Services</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fadeInUp">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              AI-Driven Disaster
            </span>
            <br />
            <span className="text-white">Response Platform</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            <span className="brand-font text-2xl bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Rescuties</span> monitors social media in real-time, detects disasters faster than traditional systems, 
            and guides rescue teams with optimal routes to save lives across Malaysia.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="btn-primary px-10 py-4 rounded-xl text-white font-semibold text-lg">
              Start Monitoring
            </button>
            <button className="btn-secondary px-10 py-4 rounded-xl text-gray-300 font-semibold text-lg">
              View Demo
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="gradient-card rounded-2xl p-8 group">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">AI-Powered Detection</h3>
            <p className="text-gray-400 leading-relaxed">
              Advanced AI analyzes social media posts and meteorological data using Amazon Comprehend and Bedrock to detect disasters in real-time.
            </p>
          </div>

          <div className="gradient-card rounded-2xl p-8 group">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Instant Alerts</h3>
            <p className="text-gray-400 leading-relaxed">
              Immediate notifications to rescue teams via AWS SNS when floods or landslides are detected, reducing critical response time.
            </p>
          </div>

          <div className="gradient-card rounded-2xl p-8 group">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Smart Routing</h3>
            <p className="text-gray-400 leading-relaxed">
              Google Maps integration provides safest and fastest routes to affected areas, optimizing rescue operations and resource deployment.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="gradient-card rounded-2xl p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-gray-400">Monitoring</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform">{'<5min'}</div>
              <div className="text-gray-400">Response Time</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-blue-300 mb-2 group-hover:scale-110 transition-transform">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-cyan-300 mb-2 group-hover:scale-110 transition-transform">Malaysia</div>
              <div className="text-gray-400">Coverage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
