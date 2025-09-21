import React, { useState, useEffect } from 'react'
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw, Settings, Shield, Key, Folder, Globe, AlertTriangle } from 'lucide-react'
import { s3Service, S3ConnectionStatus } from '../utils/s3Service'

const S3TestPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<S3ConnectionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const status = await s3Service.testConnection()
      setConnectionStatus(status)
      setLastChecked(new Date())
    } catch (error) {
      console.error('Connection test failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (connected: boolean, hasError: boolean) => {
    if (hasError) return 'text-red-400 bg-red-500/20'
    if (connected) return 'text-green-400 bg-green-500/20'
    return 'text-yellow-400 bg-yellow-500/20'
  }

  const getStatusText = () => {
    if (!connectionStatus) return 'Testing...'
    if (connectionStatus.error) return 'Error'
    if (connectionStatus.connected) return 'Connected'
    return 'Disconnected'
  }

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="h-4 w-4 animate-spin" />
    if (!connectionStatus) return <AlertCircle className="h-4 w-4 text-gray-400" />
    if (connectionStatus.error) return <XCircle className="h-4 w-4 text-red-400" />
    if (connectionStatus.connected) return <CheckCircle className="h-4 w-4 text-green-400" />
    return <AlertCircle className="h-4 w-4 text-yellow-400" />
  }

  return (
    <>
      {/* Test Panel Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg transition-all ${
          isOpen ? 'scale-0' : 'scale-100 hover:scale-110'
        }`}
      >
        <Database className="h-6 w-6 text-white" />
      </button>

      {/* Test Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] gradient-card rounded-xl shadow-2xl flex flex-col animate-fadeInUp">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Database className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">S3 Connection</h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(
                    connectionStatus?.connected || false, 
                    !!connectionStatus?.error
                  )}`}>
                    {getStatusText()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          {/* Connection Details */}
          <div className="p-4 border-b border-gray-700">
            <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configuration</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Bucket:</span>
                <span className="text-blue-400 font-mono">
                  {connectionStatus?.bucketName || import.meta.env.VITE_S3_BUCKET_NAME}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Region:</span>
                <span className="text-blue-400">
                  {connectionStatus?.region || import.meta.env.VITE_AWS_REGION}
                </span>
              </div>
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
            </div>
          </div>

          {/* Test Results */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium">Connection Status</h4>
              <button
                onClick={testConnection}
                disabled={isLoading}
                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition-colors disabled:opacity-50 flex items-center space-x-1"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Test</span>
              </button>
            </div>

            {lastChecked && (
              <div className="text-xs text-gray-400 mb-4">
                Last checked: {lastChecked.toLocaleTimeString()}
              </div>
            )}

            <div className="space-y-3">
              {/* Credentials Check */}
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-yellow-400" />
                    <span className="text-white font-medium text-sm">AWS Credentials</span>
                  </div>
                  {connectionStatus?.credentialsValid ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                </div>
                <p className="text-gray-300 text-xs">
                  {connectionStatus?.credentialsValid 
                    ? 'AWS credentials are valid and working'
                    : 'Check AWS Access Key ID and Secret Access Key in .env file'
                  }
                </p>
              </div>

              {/* Bucket Exists Check */}
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4 text-blue-400" />
                    <span className="text-white font-medium text-sm">Bucket Access</span>
                  </div>
                  {connectionStatus?.bucketExists ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                </div>
                <p className="text-gray-300 text-xs">
                  {connectionStatus?.bucketExists 
                    ? `Bucket '${connectionStatus.bucketName}' exists and is accessible`
                    : connectionStatus?.error || 'Bucket access test pending'
                  }
                </p>
              </div>

              {/* CORS Check */}
              {connectionStatus?.corsIssue && (
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-orange-400" />
                      <span className="text-white font-medium text-sm">CORS Configuration</span>
                    </div>
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                  </div>
                  <p className="text-orange-300 text-xs mb-2">
                    Browser requests to S3 are blocked by CORS policy
                  </p>
                  <div className="text-orange-300 text-xs space-y-1">
                    <p><strong>Required CORS Policy for bucket:</strong></p>
                    <div className="bg-gray-900/50 p-2 rounded font-mono text-xs">
                      {`{
  "AllowedHeaders": ["*"],
  "AllowedMethods": ["GET", "HEAD"],
  "AllowedOrigins": ["*"],
  "ExposeHeaders": []
}`}
                    </div>
                  </div>
                </div>
              )}

              {/* Read Permission Check */}
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-purple-400" />
                    <span className="text-white font-medium text-sm">Read Permissions</span>
                  </div>
                  {connectionStatus?.hasReadPermission ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                </div>
                <p className="text-gray-300 text-xs">
                  {connectionStatus?.hasReadPermission 
                    ? 'Read permissions confirmed - can list and fetch objects'
                    : 'Cannot read from bucket - check IAM permissions'
                  }
                </p>
              </div>

              {/* Overall Status */}
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-cyan-400" />
                    <span className="text-white font-medium text-sm">Overall Status</span>
                  </div>
                  {connectionStatus?.connected ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                </div>
                <p className="text-gray-300 text-xs">
                  {connectionStatus?.connected 
                    ? '✅ S3 integration ready! Waiting for backend data...'
                    : connectionStatus?.error || 'Connection test in progress'
                  }
                </p>
              </div>

              {/* Next Steps */}
              {connectionStatus?.connected && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <h5 className="text-green-400 font-medium text-sm mb-2">✅ Ready for Data</h5>
                  <div className="text-green-300 text-xs space-y-1">
                    <p>• S3 connection is working perfectly</p>
                    <p>• Bucket is empty (expected before backend starts)</p>
                    <p>• Once your friend's pipeline runs, data will appear automatically</p>
                    <p>• The LiveTwitterFeed will start showing alerts</p>
                  </div>
                </div>
              )}

              {connectionStatus?.corsIssue && (
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <h5 className="text-orange-400 font-medium text-sm mb-2">🔧 CORS Fix Needed</h5>
                  <div className="text-orange-300 text-xs space-y-1">
                    <p>• Ask your friend to add CORS policy to the S3 bucket</p>
                    <p>• This allows browser requests to access the bucket</p>
                    <p>• Once CORS is configured, connection will work</p>
                    <p>• Alternative: Use a proxy server for S3 requests</p>
                  </div>
                </div>
              )}

              {connectionStatus?.error && !connectionStatus?.corsIssue && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <h5 className="text-red-400 font-medium text-sm mb-2">❌ Connection Issue</h5>
                  <p className="text-red-300 text-xs mb-2">{connectionStatus.error}</p>
                  <div className="text-red-300 text-xs space-y-1">
                    <p><strong>Common fixes:</strong></p>
                    <p>• Verify bucket name: {connectionStatus.bucketName}</p>
                    <p>• Check AWS credentials in .env file</p>
                    <p>• Ensure IAM user has S3 read permissions</p>
                    <p>• Confirm bucket region matches configuration</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default S3TestPanel
