import React from 'react'
import { useAWSServices } from '../hooks/useAWSServices'
import { CheckCircle, XCircle, RefreshCw, Activity, Database, Zap, Brain, Cloud } from 'lucide-react'

const AWSServiceMonitor = () => {
  const { status, loading, checkConnections } = useAWSServices()

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'kinesis':
        return Activity
      case 'bedrock':
        return Brain
      case 'lambda':
        return Zap
      case 'comprehend':
        return Database
      case 's3':
        return Cloud
      default:
        return CheckCircle
    }
  }

  const getServiceName = (service: string) => {
    switch (service) {
      case 'kinesis':
        return 'Kinesis Data Streams'
      case 'bedrock':
        return 'Bedrock AI'
      case 'lambda':
        return 'Lambda Functions'
      case 'comprehend':
        return 'Comprehend NLP'
      case 's3':
        return 'S3 Storage'
      default:
        return service
    }
  }

  const getServiceDescription = (service: string) => {
    switch (service) {
      case 'kinesis':
        return 'Real-time data streaming'
      case 'bedrock':
        return 'AI-powered analysis'
      case 'lambda':
        return 'Serverless processing'
      case 'comprehend':
        return 'Natural language processing'
      case 's3':
        return 'Data storage and retrieval'
      default:
        return 'Service status'
    }
  }

  const connectedServices = Object.values(status).filter(Boolean).length - 1 // Exclude lastChecked
  const totalServices = 5

  return (
    <div className="gradient-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">AWS Backend Services</h3>
          <p className="text-gray-400 text-sm">
            {connectedServices}/{totalServices} services connected
            {status.lastChecked && (
              <span className="ml-2">
                • Last checked: {status.lastChecked.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={checkConnections}
          disabled={loading}
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overall Status */}
      <div className="mb-6 p-4 rounded-lg bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              connectedServices === totalServices ? 'bg-green-500' : 
              connectedServices > 0 ? 'bg-yellow-500' : 'bg-red-500'
            } animate-pulse`}></div>
            <span className="text-white font-medium">
              Backend Integration Status
            </span>
          </div>
          <span className={`text-sm font-medium ${
            connectedServices === totalServices ? 'text-green-400' : 
            connectedServices > 0 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {connectedServices === totalServices ? 'All Systems Operational' : 
             connectedServices > 0 ? 'Partial Connection' : 'Services Offline'}
          </span>
        </div>
      </div>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(status).map(([service, connected]) => {
          if (service === 'lastChecked') return null
          
          const ServiceIcon = getServiceIcon(service)
          const isConnected = connected as boolean
          
          return (
            <div
              key={service}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                isConnected
                  ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                  : 'bg-red-500/10 border-red-500/30 hover:border-red-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isConnected ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <ServiceIcon className={`h-4 w-4 ${
                      isConnected ? 'text-green-400' : 'text-red-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">
                      {getServiceName(service)}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {getServiceDescription(service)}
                    </p>
                  </div>
                </div>
                {isConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${
                  isConnected ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
                {loading && (
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Integration Tips */}
      {connectedServices < totalServices && (
        <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <h4 className="text-yellow-400 font-medium mb-2">Integration Tips:</h4>
          <ul className="text-yellow-300 text-sm space-y-1">
            <li>• Ensure AWS credentials are properly configured in .env</li>
            <li>• Check IAM permissions for all services</li>
            <li>• Verify service regions match your configuration</li>
            <li>• Confirm Lambda functions are deployed and accessible</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default AWSServiceMonitor
