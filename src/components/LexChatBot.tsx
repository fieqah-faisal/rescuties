import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Bot, User, Mic, MicOff, Volume2 } from 'lucide-react'

interface LexMessage {
  id: number
  type: 'user' | 'bot'
  message: string
  timestamp: string
  audioUrl?: string
  sessionAttributes?: any
}

const LexChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<LexMessage[]>([
    {
      id: 1,
      type: 'bot',
      message: 'Hello! I\'m your Amazon Lex-powered disaster response assistant. I can help you with emergency information, route planning, and real-time alerts. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  
  // Refs for audio functionality
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Placeholder for Amazon Lex SDK initialization
  useEffect(() => {
    console.log('TODO: Initialize Amazon Lex SDK')
    console.log('Session ID:', sessionId)
    console.log('TODO: Configure Lex bot name, alias, and region')
    
    // Example Lex configuration that would be needed:
    /*
    const lexConfig = {
      botName: 'RescutiesBot',
      botAlias: 'PROD',
      region: 'us-east-1',
      identityPoolId: 'your-cognito-identity-pool-id'
    }
    */
  }, [sessionId])

  const sendMessageToLex = async (message: string, audioBlob?: Blob) => {
    setIsLoading(true)
    
    try {
      // Placeholder for Amazon Lex integration
      console.log('TODO: Send message to Amazon Lex:', {
        message,
        sessionId,
        hasAudio: !!audioBlob,
        timestamp: new Date().toISOString()
      })

      // Simulate Lex API call
      /*
      const lexParams = {
        botName: 'RescutiesBot',
        botAlias: 'PROD',
        userId: sessionId,
        inputText: message,
        sessionAttributes: {},
        requestAttributes: {}
      }
      
      if (audioBlob) {
        // For voice input
        const lexResponse = await lexRuntime.postContent({
          ...lexParams,
          contentType: 'audio/l16; rate=16000; channels=1',
          inputStream: audioBlob
        }).promise()
      } else {
        // For text input
        const lexResponse = await lexRuntime.postText(lexParams).promise()
      }
      */

      // Simulate realistic Lex responses based on disaster management context
      const simulatedResponses = [
        "I've analyzed the current flood situation in Kuala Lumpur. The water level is at 2.3 meters and rising. I recommend evacuating to higher ground immediately.",
        "Based on real-time data, I've found 3 safe evacuation routes from your location. The fastest route via Jalan Ampang is currently clear with an estimated travel time of 15 minutes.",
        "Emergency services have been notified. A rescue team is being dispatched to your area. Please stay in a safe location and keep your phone charged.",
        "Weather update: Heavy rainfall is expected to continue for the next 4 hours. I recommend staying indoors and monitoring flood alerts.",
        "I've located the nearest emergency shelter at Dewan Komuniti Wangsa Maju. It has capacity for 200 people and is currently accepting evacuees."
      ]

      const randomResponse = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)]

      setTimeout(() => {
        const botResponse: LexMessage = {
          id: messages.length + 2,
          type: 'bot',
          message: randomResponse,
          timestamp: new Date().toLocaleTimeString(),
          sessionAttributes: {
            // Placeholder for Lex session attributes
            lastIntent: 'DisasterResponse',
            location: 'Kuala Lumpur',
            severity: 'high'
          }
        }
        setMessages(prev => [...prev, botResponse])
        setIsLoading(false)
      }, 1500)

    } catch (error) {
      console.error('Lex integration error:', error)
      const errorResponse: LexMessage = {
        id: messages.length + 2,
        type: 'bot',
        message: 'I apologize, but I\'m having trouble connecting to the disaster response system. Please try again or contact emergency services directly.',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, errorResponse])
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newMessage: LexMessage = {
        id: messages.length + 1,
        type: 'user',
        message: inputMessage,
        timestamp: new Date().toLocaleTimeString()
      }
      
      setMessages(prev => [...prev, newMessage])
      const messageToSend = inputMessage
      setInputMessage('')
      
      await sendMessageToLex(messageToSend)
    }
  }

  const startRecording = async () => {
    try {
      console.log('TODO: Implement voice recording for Lex')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        console.log('TODO: Send audio to Lex for speech recognition')
        
        // Placeholder for voice message
        const voiceMessage: LexMessage = {
          id: messages.length + 1,
          type: 'user',
          message: '[Voice message - processing...]',
          timestamp: new Date().toLocaleTimeString(),
          audioUrl: URL.createObjectURL(audioBlob)
        }
        setMessages(prev => [...prev, voiceMessage])
        
        // Simulate voice-to-text processing
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === voiceMessage.id 
              ? { ...msg, message: 'What is the current flood status in my area?' }
              : msg
          ))
          sendMessageToLex('What is the current flood status in my area?', audioBlob)
        }, 2000)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl)
    audio.play()
  }

  const quickActions = [
    'Check flood status in my area',
    'Find nearest evacuation center',
    'Get emergency contact numbers',
    'Report a disaster incident',
    'Request rescue assistance',
    'Weather forecast update'
  ]

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
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] gradient-card rounded-xl shadow-2xl flex flex-col animate-fadeInUp">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-orange-500 p-1">
                <Bot className="w-full h-full text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Amazon Lex Assistant</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-green-400 text-xs">Connected to AWS</span>
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

          {/* Lex Integration Status */}
          <div className="px-4 py-2 bg-orange-500/10 border-b border-orange-500/20">
            <div className="flex items-center space-x-2 text-orange-400 text-xs">
              <Bot className="h-3 w-3" />
              <span>Amazon Lex integration pending • Session: {sessionId.slice(-8)}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.type === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-gradient-to-r from-orange-600 to-orange-400'
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
                    <p className="text-sm">{msg.message}</p>
                    {msg.audioUrl && (
                      <button
                        onClick={() => playAudio(msg.audioUrl!)}
                        className="mt-2 flex items-center space-x-1 text-xs opacity-70 hover:opacity-100"
                      >
                        <Volume2 className="h-3 w-3" />
                        <span>Play audio</span>
                      </button>
                    )}
                    <span className="text-xs opacity-70 mt-1 block">{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-orange-400 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="rounded-lg p-3 bg-gray-800 text-gray-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(action)}
                  className="text-xs p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
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
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about disasters, routes, or emergency info..."
                className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
              />
              
              {/* Voice Input Button */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isRecording ? (
                  <MicOff className="h-4 w-4 text-white" />
                ) : (
                  <Mic className="h-4 w-4 text-white" />
                )}
              </button>
              
              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center disabled:opacity-50"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LexChatBot
