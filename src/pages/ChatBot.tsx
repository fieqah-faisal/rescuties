import React from 'react'
import { MessageCircle, Bot, Users, Zap, Shield, Activity } from 'lucide-react'

const ChatBot = () => {
  const chatExamples = [
    {
      question: "What's the flood situation in KL?",
      response: "Current flood alerts show high water levels in KLCC area. Evacuation routes via Jalan Ampang are recommended."
    },
    {
      question: "Find me evacuation routes from Selangor",
      response: "Optimal evacuation routes: 1) NKVE Highway to Ipoh, 2) PLUS Highway to Melaka, 3) Local roads to higher ground areas."
    },
    {
      question: "Emergency contacts for landslide rescue",
      response: "Emergency: 999, JPAM: 03-8064 2222, Local Fire Dept: 03-2274 1122. Rescue teams dispatched to Cameron Highlands."
    }
  ]

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
            <h2 className="text-4xl font-bold text-white">AI Chat Assistant</h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get instant help with disaster information, evacuation routes, and emergency assistance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="gradient-card rounded-xl p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-purple-400">24/7</span>
            </div>
            <h3 className="text-white font-semibold mb-2">AI Available</h3>
            <p className="text-gray-400 text-sm">Always ready to help</p>
          </div>

          <div className="gradient-card rounded-xl p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-400">2,847</span>
            </div>
            <h3 className="text-white font-semibold mb-2">People Helped</h3>
            <p className="text-gray-400 text-sm">This month</p>
          </div>

          <div className="gradient-card rounded-xl p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-400">< 2s</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Response Time</h3>
            <p className="text-gray-400 text-sm">Average AI response</p>
          </div>

          <div className="gradient-card rounded-xl p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-orange-400">97.3%</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Accuracy Rate</h3>
            <p className="text-gray-400 text-sm">Information accuracy</p>
          </div>
        </div>

        {/* Chat Examples */}
        <div className="gradient-card rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">Example Conversations</h3>
          <div className="space-y-6">
            {chatExamples.map((example, index) => (
              <div key={index} className="space-y-3">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg p-3 max-w-md">
                    <p className="text-sm">{example.question}</p>
                  </div>
                </div>
                
                {/* Bot Response */}
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-800 text-gray-300 rounded-lg p-3 max-w-md">
                      <p className="text-sm">{example.response}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="gradient-card rounded-xl p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Real-time Chat</h3>
            <p className="text-gray-400 text-sm">Instant responses to your disaster-related questions and emergency needs.</p>
          </div>

          <div className="gradient-card rounded-xl p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Emergency Assistance</h3>
            <p className="text-gray-400 text-sm">Get immediate help with evacuation routes, emergency contacts, and safety guidelines.</p>
          </div>

          <div className="gradient-card rounded-xl p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Live Updates</h3>
            <p className="text-gray-400 text-sm">Access real-time disaster information and status updates across Malaysia.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-300 mb-4">Click the chat button in the bottom right to start a conversation!</p>
          <div className="flex items-center justify-center space-x-2 text-blue-400">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">AI Assistant is ready to help</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChatBot
