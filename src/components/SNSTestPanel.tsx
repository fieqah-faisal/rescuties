import React, { useState, useEffect } from 'react'
import { TestTube, CheckCircle, XCircle, AlertCircle, Send, Phone, Mail, Settings, Loader, Shield, Key } from 'lucide-react'
import { snsClient } from '../lib/sns-client'
import type { NotificationMessage } from '../lib/sns-client'

const SNSTestPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected')
  const [isLoading, setIsLoading] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Array<{
    id: string
    test: string
    status: 'success' | 'error' | 'pending'
    message: string
    timestamp: string
  }>>([])

  const [testConfig, setTestConfig] = useState({
    phoneNumber: '',
    email: '',
    testMessage: 'This is a test message from Rescuties SNS integration.'
  })

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    setIsLoading(true)
    try {
      const isValid = await snsClient.validateConnection()
      const status = snsClient.getConnectionStatus()
      const error = snsClient.getLastError()
      
      setConnectionStatus(status)
      setLastError(error)
      
      addTestResult({
        test: 'Connection Check',
        status: isValid ? 'success' : 'error',
        message: isValid 
          ? 'SNS connection validated successfully' 
          : `SNS connection failed: ${error || 'Unknown error'}`
      })
    } catch (error) {
      setConnectionStatus('error')
      setLastError(`Connection error: ${error}`)
      addTestResult({
        test: 'Connection Check',
        status: 'error',
        message: `Connection error: ${error}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTestResult = (result: Omit<typeof testResults[0], 'id' | 'timestamp'>) => {
    const newResult = {
      ...result,
      id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toLocaleTimeString()
    }
    setTestResults(prev => [newResult, ...prev.slice(0, 9)]) // Keep last 10 results
  }

  const testTopicPublish = async () => {
    setIsLoading(true)
    addTestResult({
      test: 'Topic Publish',
      status: 'pending',
      message: 'Publishing test message to SNS topic...'
    })

    try {
      const message: NotificationMessage = {
        subject: '🧪 SNS Test - Rescuties Platform',
        message: `${testConfig.testMessage}\n\nTopic ARN: ${import.meta.env.VITE_SNS_TOPIC_ARN}\nTimestamp: ${new Date().toISOString()}`,
        attributes: {
          testType: 'topic-publish',
          platform: 'rescuties',
          environment: 'development'
        }
      }

      const response = await snsClient.publishMessage(message)
      
      if (response.success) {
        addTestResult({
          test: 'Topic Publish',
          status: 'success',
          message: `Message published successfully. Message ID: ${response.messageId}`
        })
      } else {
        addTestResult({
          test: 'Topic Publish',
          status: 'error',
          message: response.error || 'Failed to publish message'
        })
      }
    } catch (error) {
      addTestResult({
        test: 'Topic Publish',
        status: 'error',
        message: `Publish error: ${error}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testSMSSubscription = async () => {
    if (!testConfig.phoneNumber.trim()) {
      addTestResult({
        test: 'SMS Subscription',
        status: 'error',
        message: 'Phone number is required for SMS testing'
      })
      return
    }

    setIsLoading(true)
    addTestResult({
      test: 'SMS Subscription',
      status: 'pending',
      message: 'Creating SMS subscription...'
    })

    try {
      const subscription = {
        protocol: 'sms' as const,
        endpoint: testConfig.phoneNumber,
        topicArn: import.meta.env.VITE_SNS_TOPIC_ARN
      }

      const response = await snsClient.subscribe(subscription)
      
      if (response.success) {
        addTestResult({
          test: 'SMS Subscription',
          status: 'success',
          message: `SMS subscription created. ARN: ${response.subscriptionArn}`
        })
      } else {
        addTestResult({
          test: 'SMS Subscription',
          status: 'error',
          message: response.error || 'Failed to create SMS subscription'
        })
      }
    } catch (error) {
      addTestResult({
        test: 'SMS Subscription',
        status: 'error',
        message: `SMS subscription error: ${error}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testEmailSubscription = async () => {
    if (!testConfig.email.trim()) {
      addTestResult({
        test: 'Email Subscription',
        status: 'error',
        message: 'Email address is required for email testing'
      })
      return
    }

    setIsLoading(true)
    addTestResult({
      test: 'Email Subscription',
      status: 'pending',
      message: 'Creating email subscription...'
    })

    try {
      const subscription = {
        protocol: 'email' as const,
        endpoint: testConfig.email,
        topicArn: import.meta.env.VITE_SNS_TOPIC_ARN
      }

      const response = await snsClient.subscribe(subscription)
      
      if (response.success) {
        addTestResult({
          test: 'Email Subscription',
          status: 'success',
          message: `Email subscription created. ARN: ${response.subscriptionArn}`
        })
      } else {
        addTestResult({
          test: 'Email Subscription',
          status: 'error',
          message: response.error || 'Failed to create email subscription'
        })
      }
    } catch (error) {
      addTestResult({
        test: 'Email Subscription',
        status: 'error',
        message: `Email subscription error: ${error}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />
      case 'pending': return <Loader className="h-4 w-4 text-yellow-400 animate-spin" />
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
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
      default: return 'Disconnected'
    }
  }

  return (
    <>
      {/* Test Panel Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg transition-all ${
          isOpen ? 'scale-0' : 'scale-100 hover:scale-110'
        }`}
      >
        <TestTube className="h-6 w-6 text-white" />
      </button>

      {/* Test Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] gradient-card rounded-xl shadow-2xl flex flex-col animate-fadeInUp">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <TestTube className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">SNS Testing</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500' : 
                    connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className={`text-xs px-2 py-1 rounded ${getConnectionStatusColor()}`}>
                    {getConnectionStatusText()}
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
              ×
            </button>
          </div>

          {/* Credentials Status */}
          <div className="p-4 border-b border-gray-700">
            <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>Credentials Status</span>
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

          {/* Test Configuration */}
          <div className="p-4 border-b border-gray-700">
            <h4 className="text-white font-medium mb-3">Test Configuration</h4>
            <div className="space-y-3">
              <input
                type="tel"
                value={testConfig.phoneNumber}
                onChange={(e) => setTestConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="Phone number (e.g., +60123456789)"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-purple-500 focus:outline-none"
              />
              <input
                type="email"
                value={testConfig.email}
                onChange={(e) => setTestConfig(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email address"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-purple-500 focus:outline-none"
              />
              <textarea
                value={testConfig.testMessage}
                onChange={(e) => setTestConfig(prev => ({ ...prev, testMessage: e.target.value }))}
                placeholder="Test message"
                rows={2}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Test Actions */}
          <div className="p-4 border-b border-gray-700">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={checkConnection}
                disabled={isLoading}
                className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
              >
                <Settings className="h-3 w-3" />
                <span>Check</span>
              </button>
              
              <button
                onClick={testTopicPublish}
                disabled={isLoading}
                className="px-3 py-2 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30 transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
              >
                <Send className="h-3 w-3" />
                <span>Publish</span>
              </button>
              
              <button
                onClick={testSMSSubscription}
                disabled={isLoading || !testConfig.phoneNumber.trim()}
                className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded text-sm hover:bg-purple-500/30 transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
              >
                <Phone className="h-3 w-3" />
                <span>SMS</span>
              </button>
              
              <button
                onClick={testEmailSubscription}
                disabled={isLoading || !testConfig.email.trim()}
                className="px-3 py-2 bg-pink-500/20 text-pink-400 rounded text-sm hover:bg-pink-500/30 transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
              >
                <Mail className="h-3 w-3" />
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Test Results */}
          <div className="flex-1 overflow-y-auto p-4">
            <h4 className="text-white font-medium mb-3">Test Results</h4>
            <div className="space-y-2">
              {testResults.length === 0 ? (
                <div className="text-gray-400 text-sm text-center py-8">
                  No tests run yet. Click a test button to start.
                </div>
              ) : (
                testResults.map((result) => (
                  <div key={result.id} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(result.status)}
                        <span className="text-white font-medium text-sm">{result.test}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{result.timestamp}</span>
                    </div>
                    <p className="text-gray-300 text-xs break-words">{result.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SNSTestPanel
