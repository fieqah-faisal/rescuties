import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, MapPin, Bell, Users, ArrowRight, Zap, Globe, Heart } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Real-time Disaster Alerts",
      description: "Get instant notifications about floods, landslides, and other natural disasters in your area with AI-powered early warning systems.",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Smart Route Optimization",
      description: "Find the safest evacuation routes with real-time traffic data and disaster zone avoidance using Google Maps integration.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Multi-Channel Notifications",
      description: "Receive alerts via SMS, email, and in-app notifications powered by Amazon SNS for maximum reliability.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "AI-Powered Assistant",
      description: "Chat with our intelligent disaster response bot powered by Amazon Lex for personalized emergency guidance.",
      color: "from-green-500 to-teal-500"
    }
  ]

  const stats = [
    { number: "24/7", label: "Monitoring", icon: <Zap className="h-5 w-5" /> },
    { number: "99.9%", label: "Uptime", icon: <Globe className="h-5 w-5" /> },
    { number: "1000+", label: "Lives Protected", icon: <Heart className="h-5 w-5" /> },
    { number: "5sec", label: "Alert Speed", icon: <Bell className="h-5 w-5" /> }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <img 
                src="https://cdn.chatandbuild.com/users/688b11cfde83ff4065553da3/cloud-cuties-1758351688316-474152956-1758351688316-440085577-white.png" 
                alt="Rescuties Logo" 
                className="h-20 w-20 mr-4"
              />
              <h1 className="text-6xl font-bold brand-font bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Rescuties
              </h1>
            </div>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Malaysia's most advanced AI-driven disaster alert and response platform. 
              Protecting communities with real-time monitoring, intelligent alerts, and smart evacuation planning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/dashboard"
                className="btn-primary px-8 py-4 text-lg font-semibold rounded-xl flex items-center space-x-2 hover:scale-105 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link
                to="/alerts"
                className="btn-secondary px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all"
              >
                View Live Alerts
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center gradient-card p-6 rounded-xl">
                <div className="flex items-center justify-center mb-2 text-blue-400">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Advanced Disaster Response Technology
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powered by AWS services and cutting-edge AI to keep Malaysian communities safe
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="gradient-card p-8 rounded-xl hover:scale-105 transition-all">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900/50 to-blue-900/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Built with Enterprise-Grade Technology
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Leveraging Amazon Web Services and Google Cloud Platform for maximum reliability and performance
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Amazon Lex", desc: "AI Chatbot", color: "from-orange-500 to-red-500" },
              { name: "Amazon SNS", desc: "Notifications", color: "from-blue-500 to-cyan-500" },
              { name: "Google Maps", desc: "Route Planning", color: "from-green-500 to-teal-500" },
              { name: "AWS Amplify", desc: "Cloud Hosting", color: "from-purple-500 to-pink-500" }
            ].map((tech, index) => (
              <div key={index} className="gradient-card p-6 rounded-xl">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tech.color} mx-auto mb-4`}></div>
                <h3 className="text-white font-semibold mb-2">{tech.name}</h3>
                <p className="text-gray-400 text-sm">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="gradient-card p-12 rounded-2xl">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Stay Protected?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of Malaysians who trust Rescuties for disaster preparedness and emergency response.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="btn-primary px-8 py-4 text-lg font-semibold rounded-xl flex items-center justify-center space-x-2 hover:scale-105 transition-all"
              >
                <Shield className="h-5 w-5" />
                <span>Start Monitoring</span>
              </Link>
              
              <Link
                to="/routes"
                className="btn-secondary px-8 py-4 text-lg font-semibold rounded-xl flex items-center justify-center space-x-2 hover:scale-105 transition-all"
              >
                <MapPin className="h-5 w-5" />
                <span>Plan Routes</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="https://cdn.chatandbuild.com/users/688b11cfde83ff4065553da3/cloud-cuties-1758351688316-474152956-1758351688316-440085577-white.png" 
                  alt="Rescuties Logo" 
                  className="h-8 w-8 mr-2"
                />
                <span className="text-xl font-bold brand-font bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Rescuties</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered disaster response platform protecting Malaysian communities 24/7.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <div className="space-y-2">
                <Link to="/dashboard" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
                <Link to="/alerts" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  Live Alerts
                </Link>
                <Link to="/routes" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  Route Optimizer
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <div className="space-y-2">
                <Link to="/profile" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  Profile Settings
                </Link>
                <button className="block text-gray-400 hover:text-white transition-colors text-sm text-left">
                  Notification Preferences
                </button>
                <button className="block text-gray-400 hover:text-white transition-colors text-sm text-left">
                  Emergency Contacts
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <button className="block text-gray-400 hover:text-white transition-colors text-sm text-left">
                  Help Center
                </button>
                <button className="block text-gray-400 hover:text-white transition-colors text-sm text-left">
                  Emergency Hotlines
                </button>
                <button className="block text-gray-400 hover:text-white transition-colors text-sm text-left">
                  System Status
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 Rescuties. Built with ChatAndBuild. Protecting Malaysian communities with AI-powered disaster response.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
