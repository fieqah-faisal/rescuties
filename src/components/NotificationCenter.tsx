import React, { useState, useEffect } from 'react'
import { Bell, BellRing, Mail, MessageSquare, Phone, Settings, X, Check, AlertTriangle, Users, MapPin, Send, Loader, Shield, Key, Plus } from 'lucide-react'
import { snsClient } from '../lib/sns-client'
import type { SNSSubscription, NotificationMessage } from '../lib/sns-client'

interface NotificationSubscription {
  id: string
  type: 'sms' | 'email'
  endpoint: string
  status: 'pending' | 'confirmed' | 'failed'
  subscriptionArn?: string
}

interface DisasterNotification {
  id: string
  type: 'flood' | 'landslide' | 'wildfire' | 'earthquake'
  title: string
  message: string
  location: string
  severity: 'high' | 'medium' | 'low'
  timestamp: string
  sent: boolean
}

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'alerts' | 'subscriptions' | 'settings'>('alerts')
  const [subscriptions, setSubscriptions] = useState<NotificationSubscription[]>([])
  const [notifications, setNotifications] = useState<DisasterNotification[]>([])
  const [newSubscription, setNewSubscription] = useState({ type: 'email' as 'sms' | 'email', endpoint: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected')
  const [lastError, setLastError] = useState<string | null>(null)

  // Sample disaster notifications
  const sampleNotifications: DisasterNotification[] = [
    {
      id: '1',
      type: 'flood',
      title: 'Flash Flood Alert - Kuala Lumpur',
      message: 'Severe flooding detected in KLCC area. Immediate evacuation recommended for ground floor residents.',
      location: 'Kuala Lumpur City Center',
      severity: 'high',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      sent: true
    },
    {
      id: '2',
      type: 'landslide',
      title: 'Landslide Warning - Cameron Highlands',
      message: 'Slope instability detected on main road to Tanah Rata. Alternative routes recommended.',
      location: 'Cameron Highlands, Pahang',
      severity: 'medium',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      sent: true
    },
    {
      id: '3',
      type: 'wildfire',
      title: 'Forest Fire Alert - Taman Negara',
      message: 'Rapidly spreading forest fire in national park. Evacuation in progress for nearby areas.',
      location: 'Taman Negara, Pahang',
      severity: 'high',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      sent: false
    }
  ]

  useEffect(() => {
    // Initialize with sample data
    setNotifications(sampleNotifications)
    
    // Load saved subscriptions from localStorage
    const savedSubscriptions = localStorage.getItem('disaster-subscriptions')
    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions))
    }

    // Initialize SNS connection
    initializeSNSConnection()
  }, [])

  const initializeSNSConnection = async () => {
    try {
      console.log('📡 Initializing Amazon SNS connection...')
      
      const isValid = await snsClient.validateConnection()
      const status = snsClient.getConnectionStatus()
      const error = snsClient.getLastError()
      
      setConnectionStatus(status)
      setLastError(error)
      
      if (isValid) {
        console.log('✅ Amazon SNS connection ready')
      } else {
        console.error('❌ SNS connection failed:', error)
      }
    } catch (error) {
      console.error('❌ Failed to initialize SNS connection:', error)
      setConnectionStatus('error')
      setLastError(`Connection error: ${error}`)
    }
  }

  const handleSubscribe = async () => {
    if (!newSubscription.endpoint.trim() || isLoading) return

    setIsLoading(true)
    
    try {
      const subscription: SNSSubscription = {
        protocol: newSubscription.type,
        endpoint: newSubscription.endpoint,
        topicArn: import.meta.env.VITE_SNS_TOPIC_ARN
      }

      const response = await snsClient.subscribe(subscription)
      
      if (response.success) {
        const newSub: NotificationSubscription = {
          id: `sub-${Date.now()}`,
          type: newSubscription.type,
          endpoint: newSubscription.endpoint,
          status: 'pending',
          subscriptionArn: response.subscriptionArn
        }

        const updatedSubscriptions = [...subscriptions, newSub]
        setSubscriptions(updatedSubscriptions)
        localStorage.setItem('disaster-subscriptions', JSON.stringify(updatedSubscriptions))
        
        setNewSubscription({ type: 'email', endpoint: '' })
        
        // Simulate confirmation after a delay
        setTimeout(() => {
          setSubscriptions(prev => prev.map(sub => 
            sub.id === newSub.id ? { ...sub, status: 'confirmed' } : sub
          ))
        }, 3000)
      } else {
        console.error('Subscription failed:', response.error)
      }
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnsubscribe = async (subscriptionId: string) => {
    const subscription = subscriptions.find(sub => sub.id === subscriptionId)
    if (!subscription?.subscriptionArn) return

    try {
      const response = await snsClient.unsubscribe(subscription.subscriptionArn)
      
      if (response.success) {
        const updatedSubscriptions = subscriptions.filter(sub => sub.id !== subscriptionId)
        setSubscriptions(updatedSubscriptions)
        localStorage.setItem('disaster-subscriptions', JSON.stringify(updatedSubscriptions))
      }
    } catch (error) {
      console.error('Unsubscribe error:', error)
    }
  }

  const sendTestNotification = async () => {
    if (subscriptions.length === 0) return

    setIsLoading(true)
    
    try {
      const testMessage: NotificationMessage = {
        subject: '🧪 Test Alert - Rescuties Notification System',
        message: 'This is a test notification from the Rescuties disaster response platform. Your notification subscription is working correctly.\n\nIf you received this message, your emergency alerts are properly configured.',
        attributes: {
          alertType: 'test',
          severity: 'low',
          location: 'System Test',
          platform: 'rescuties'
        }
      }

      const response = await snsClient.publishMessage(testMessage)
      
      if (response.success) {
        console.log('✅ Test notification sent successfully')
      }
    } catch (error) {
      console.error('Test notification error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendDisasterAlert = async (notification: DisasterNotification) => {
    if (subscriptions.length === 0) return

    setIsLoading(true)

    try {
      const alertMessage: NotificationMessage = {
        subject: `🚨 ${notification.title}`,
        message: `${notification.message}\n\nLocation: ${notification.location}\nSeverity: ${notification.severity.toUpperCase()}\nTime: ${new Date(notification.timestamp).toLocaleString()}\n\nFor more information and updates, visit the Rescuties platform.\n\nStay safe and follow local emergency guidelines.`,
        attributes: {
          alertType: notification.type,
          severity: notification.severity,
          location: notification.location,
          timestamp: notification.timestamp,
          platform: 'rescuties'
        }
      }

      const response = await snsClient.publishMessage(alertMessage)
      
      if (response.success) {
        setNotifications(prev => prev.map(notif => 
          notif.id === notification.id ? { ...notif, sent: true } : notif
        ))
        console.log('✅ Disaster alert sent successfully')
      }
    } catch (error) {
      console.error('Disaster alert error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'flood': return '🌊'
      case 'landslide': return '⛰️'
      case 'wildfire': return '🔥'
      case 'earthquake': return '⚡'
      default: return '⚠️'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'low': return 'text-green-400 bg-green-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400 bg-green-500/20'
      case 'error': return 'text-red-400 bg-red-500/20'
      default: return 'text-yellow-400 bg-yellow-500/20'
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected'
      case 'error': return 'Error'
      default: return 'Connecting...'
    }
  }

  const unsentNotifications = notifications.filter(n => !n.sent)

  return (
    <>
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full btn-secondary flex items-center justify-center shadow-lg transition-all ${
          isOpen ? 'scale-0' : 'scale-100 hover:scale-110'
        }`}
      >
        {unsentNotifications.length > 0 ? (
          <BellRing className="h-6 w-6 text-white animate-pulse" />
        ) : (
          <Bell className="h-6 w-6 text-white" />
        )}
        {unsentNotifications.length > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
            {unsentNotifications.length}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-96 h-[600px] gradient-card rounded-xl shadow-2xl flex flex-col animate-fadeInUp">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Disaster Alerts</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500' : 
                    connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className={`text-xs px-2 py-1 rounded ${getConnectionStatusColor()}`}>
                    SNS {getConnectionStatusText()}
                  </span>
                </div>
                {lastError && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Shield className="h-3 w-3 text-red-400" />
                    <span className="text-xs text-red-400 truncate max-w-48" title={lastError}>
                      {lastError}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700">
            <button 
              onClick={() => setActiveTab('alerts')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'alerts' 
                  ? 'text-white bg-blue-500/20 border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Alerts ({notifications.length})
            </button>
            <button 
              onClick={() => setActiveTab('subscriptions')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'subscriptions' 
                  ? 'text-white bg-blue-500/20 border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Subscriptions ({subscriptions.length})
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'settings' 
                  ? 'text-white bg-blue-500/20 border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div className="p-4 space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(notification.severity)}`}>
                        {notification.severity}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-xs mb-3">{notification.message}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <MapPin className="h-3 w-3" />
                        <span>{notification.location}</span>
                      </div>
                      <span className="text-gray-500">{formatTimeAgo(notification.timestamp)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700/50">
                      <div className="flex items-center space-x-2">
                        {notification.sent ? (
                          <div className="flex items-center space-x-1 text-green-400">
                            <Check className="h-3 w-3" />
                            <span className="text-xs">Sent</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-xs">Pending</span>
                          </div>
                        )}
                      </div>
                      
                      {!notification.sent && subscriptions.length > 0 && (
                        <button
                          onClick={() => sendDisasterAlert(notification)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50 flex items-center space-x-1"
                        >
                          {isLoading ? <Loader className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                          <span>Send Alert</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && (
              <div className="p-4 space-y-4">
                {/* Add Subscription */}
                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-3">Subscribe to Alerts</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <select
                        value={newSubscription.type}
                        onChange={(e) => setNewSubscription(prev => ({ ...prev, type: e.target.value as 'sms' | 'email' }))}
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="email">📧 Email</option>
                        <option value="sms">📱 SMS</option>
                      </select>
                      
                      <input
                        type={newSubscription.type === 'email' ? 'email' : 'tel'}
                        value={newSubscription.endpoint}
                        onChange={(e) => setNewSubscription(prev => ({ ...prev, endpoint: e.target.value }))}
                        placeholder={newSubscription.type === 'email' ? 'Enter email address' : 'Enter phone number (+60...)'}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                      />
                      
                      <button
                        onClick={handleSubscribe}
                        disabled={isLoading || !newSubscription.endpoint.trim()}
                        className="px-4 py-2 btn-primary rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        {isLoading ? <Loader className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                        <span>Subscribe</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Existing Subscriptions */}
                {subscriptions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-white font-medium">Active Subscriptions</h4>
                    {subscriptions.map((sub) => (
                      <div key={sub.id} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {sub.type === 'email' ? <Mail className="h-4 w-4 text-blue-400" /> : <Phone className="h-4 w-4 text-green-400" />}
                            <div>
                              <p className="text-white text-sm">{sub.endpoint}</p>
                              <p className={`text-xs ${
                                sub.status === 'confirmed' ? 'text-green-400' : 
                                sub.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {sub.status === 'confirmed' ? '✅ Confirmed' : 
                                 sub.status === 'pending' ? '⏳ Pending' : '❌ Failed'}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnsubscribe(sub.id)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Unsubscribe
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Test Notification */}
                {subscriptions.length > 0 && (
                  <button
                    onClick={sendTestNotification}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span>Send Test Notification</span>
                  </button>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="p-4 space-y-4">
                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                    <Key className="h-4 w-4" />
                    <span>SNS Configuration</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Access Key:</span>
                      <span className={import.meta.env.VITE_AWS_ACCESS_KEY_ID ? 'text-green-400' : 'text-red-400'}>
                        {import.meta.env.VITE_AWS_ACCESS_KEY_ID ? 
                          `${import.meta.env.VITE_AWS_ACCESS_KEY_ID.substring(0, 8)}...` : 
                          'Missing'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Secret Key:</span>
                      <span className={import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ? 'text-green-400' : 'text-red-400'}>
                        {import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ? 'Present' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Region:</span>
                      <span className="text-blue-400">{import.meta.env.VITE_AWS_REGION}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Topic ARN:</span>
                      <span className={import.meta.env.VITE_SNS_TOPIC_ARN ? 'text-green-400' : 'text-red-400'}>
                        {import.meta.env.VITE_SNS_TOPIC_ARN ? 'Present' : 'Missing'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={initializeSNSConnection}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-purple-500/20 text-purple-400 rounded text-sm hover:bg-purple-500/30 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
                  <span>Test Connection</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default NotificationCenter
