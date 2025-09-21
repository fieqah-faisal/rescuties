import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Bot, User, Loader2, AlertTriangle } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  message: string
  timestamp: string
  sessionId?: string
  intentName?: string
  slots?: Record<string, any>
}

interface LexResponse {
  message?: string
  intentName?: string
  dialogState?: string
  slots?: Record<string, any>
  sessionAttributes?: Record<string, any>
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      type: 'bot',
      message: 'Hello! I\'m your AI disaster response assistant powered by Amazon Lex. I can help you with:\n\n• Real-time disaster alerts\n• Emergency evacuation routes\n• Safety recommendations\n• Resource locations\n• Emergency contacts\n\nHow can I assist you today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize Lex connection (placeholder for actual implementation)
  useEffect(() => {
    initializeLexConnection()
  }, [])

  const initializeLexConnection = async () => {
    try {
      // TODO: Initialize Amazon Lex Runtime V2 client
      // This will be implemented when AWS credentials are configured
      console.log('🤖 Initializing Amazon Lex connection...')
      console.log('Session ID:', sessionId)
      console.log('Bot Name: DisasterResponseBot (placeholder)')
      console.log('Bot Alias: TSTALIASID (placeholder)')
      
      // Simulate connection check
      setTimeout(() => {
        setConnectionStatus('connected')
        console.log('✅ Amazon Lex connection ready')
      }, 1000)
    } catch (error) {
      console.error('❌ Failed to initialize Lex connection:', error)
      setConnectionStatus('error')
    }
  }

  const sendMessageToLex = async (message: string): Promise<LexResponse> => {
    try {
      // TODO: Replace with actual Amazon Lex Runtime V2 API call
      console.log('📤 Sending to Lex:', { message, sessionId })
      
      // Simulate Lex API call structure
      const lexRequest = {
        botId: process.env.VITE_LEX_BOT_ID || 'placeholder-bot-id',
        botAliasId: process.env.VITE_LEX_BOT_ALIAS_ID || 'TSTALIASID',
        localeId: 'en_US',
        sessionId: sessionId,
        text: message,
        sessionState: {
          sessionAttributes: {},
          dialogAction: {
            type: 'ElicitIntent'
          }
        }
      }

      // Placeholder response - will be replaced with actual Lex API call
      const mockResponse = await simulateLexResponse(message)
      
      console.log('📥 Lex response:', mockResponse)
      return mockResponse
    } catch (error) {
      console.error('❌ Lex API error:', error)
      throw error
    }
  }

  // Simulate Lex responses for development (remove when integrating real Lex)
  const simulateLexResponse = async (userMessage: string): Promise<LexResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
    
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('flood') || lowerMessage.includes('banjir')) {
      return {
        message: 'I can help you with flood information. Based on current data, there are active flood warnings in Selangor and Pahang. Would you like specific evacuation routes or shelter locations?',
        intentName: 'FloodInquiry',
        dialogState: 'ElicitSlot',
        slots: { location: null, informationType: null }
      }
    } else if (lowerMessage.includes('landslide') || lowerMessage.includes('tanah runtuh')) {
      return {
        message: 'Landslide alerts are currently active in Cameron Highlands and Genting areas. I can provide safety guidelines and alternative routes. What specific information do you need?',
        intentName: 'LandslideInquiry',
        dialogState: 'ElicitSlot',
        slots: { location: null, urgencyLevel: null }
      }
    } else if (lowerMessage.includes('route') || lowerMessage.includes('jalan')) {
      return {
        message: 'I can help you find the safest evacuation routes. Please provide your current location and destination, and I\'ll calculate the best path avoiding disaster zones.',
        intentName: 'RouteOptimization',
        dialogState: 'ElicitSlot',
        slots: { currentLocation: null, destination: null }
      }
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('kecemasan')) {
      return {
        message: 'For immediate emergencies, call 999. I can also provide:\n• Nearest hospital locations\n• Emergency shelter information\n• Rescue team contacts\n\nWhat type of emergency assistance do you need?',
        intentName: 'EmergencyAssistance',
        dialogState: 'ElicitSlot',
        slots: { emergencyType: null, location: null }
      }
    } else {
      return {
        message: 'I understand you need assistance with disaster response. I can help with flood alerts, landslide warnings, evacuation routes, and emergency information. Could you please be more specific about what you need?',
        intentName: 'GeneralInquiry',
        dialogState: 'ElicitIntent'
      }
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString(),
      sessionId
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const lexResponse = await sendMessageToLex(userMessage.message)
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        message: lexResponse.message || 'I apologize, but I couldn\'t process your request. Please try again.',
        timestamp: new Date().toLocaleTimeString(),
        sessionId,
        intentName: lexResponse.intentName,
        slots: lexResponse.slots
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'bot',
        message: 'I\'m experiencing technical difficulties. Please try again in a moment or contact emergency services directly if this is urgent.',
        timestamp: new Date().toLocaleTimeString(),
        sessionId
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    setInputMessage(action)
  }

  const quickActions = [
    'Check flood status in KL',
    'Find evacuation routes',
    'Get emergency contacts',
    'Landslide warnings'
  ]

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-yellow-500'
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Lex Connected'
      case 'error': return 'Connection Error'
      default: return 'Connecting...'
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full btn-primary flex items-center justify-center shadow-lg transition-all ${
          isOpen ? 'scale-0' : 'scale-100 hover:scale-110'
        }`}
      >
        <MessageCircle className="h-6 w-6 text-white" />
        {connectionStatus === 'connected' && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] gradient-card rounded-xl shadow-2xl flex flex-col animate-fadeInUp">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white p-1">
                <img 
                  src="https://cdn.chatandbuild.com/users/688b11cfde83ff4065553da3/cloud-cuties-1758351688316-474152956-1758351688316-440085577.png" 
                  alt="Cloud Cuties Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Assistant</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}></div>
                  <span className={`text-xs ${
                    connectionStatus === 'connected' ? 'text-green-400' : 
                    connectionStatus === 'error' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {getConnectionStatusText()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[85%] ${
                  msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.type === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-gradient-to-r from-purple-600 to-purple-400'
                  }`}>
                    {msg.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{msg.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">{msg.timestamp}</span>
                      {msg.intentName && (
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                          {msg.intentName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  </div>
                  <div className="bg-gray-800 text-gray-300 rounded-lg p-3">
                    <p className="text-sm">AI is thinking...</p>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Connection Status Warning */}
          {connectionStatus === 'error' && (
            <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20">
              <div className="flex items-center space-x-2 text-red-400 text-xs">
                <AlertTriangle className="h-4 w-4" />
                <span>Amazon Lex connection failed. Using fallback responses.</span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  disabled={isLoading}
                  className="text-xs p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Ask about disasters, routes, or emergency info..."
                disabled={isLoading}
                className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 text-white animate-spin" />
                ) : (
                  <Send className="h-4 w-4 text-white" />
                )}
              </button>
            </div>

            {/* Session Info */}
            <div className="mt-2 text-xs text-gray-500 text-center">
              Session: {sessionId.slice(-8)}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBot
