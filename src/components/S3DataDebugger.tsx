import React, { useState } from 'react'
import { Database, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { s3Service } from '../utils/s3Service'

const S3DataDebugger = () => {
  const [isDebugging, setIsDebugging] = useState(false)
  const [debugResults, setDebugResults] = useState<any>(null)
  const [rawData, setRawData] = useState<string>('')

  const runDebugTest = async () => {
    setIsDebugging(true)
    setDebugResults(null)
    setRawData('')

    try {
      console.log('🔍 Starting S3 Debug Test...')
      
      // Test 1: Connection
      const connectionStatus = await s3Service.testConnection()
      
      // Test 2: Raw data fetch
      const disasterData = await s3Service.getLatestDisasterData()
      
      // Test 3: High severity alerts
      const highSeverityAlerts = await s3Service.getHighSeverityAlerts()

      const results = {
        connection: connectionStatus,
        dataCount: disasterData.length,
        highSeverityCount: highSeverityAlerts.length,
        sampleData: disasterData.slice(0, 3), // First 3 records
        timestamp: new Date().toISOString()
      }

      setDebugResults(results)
      setRawData(JSON.stringify(results, null, 2))
      
      console.log('✅ Debug test completed:', results)
    } catch (error) {
      console.error('❌ Debug test failed:', error)
      setDebugResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsDebugging(false)
    }
  }

  return (
    <div className="gradient-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">S3 Data Debugger</h3>
        </div>
        <button
          onClick={runDebugTest}
          disabled={isDebugging}
          className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isDebugging ? 'animate-spin' : ''}`} />
          <span>{isDebugging ? 'Testing...' : 'Run Debug Test'}</span>
        </button>
      </div>

      {debugResults && (
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
            <div className="flex items-center space-x-2 mb-2">
              {debugResults.connection?.connected ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
              <h4 className="text-white font-medium">S3 Connection</h4>
            </div>
            <div className="text-sm text-gray-300 space-y-1">
              <p>Bucket: {debugResults.connection?.bucketName}</p>
              <p>Region: {debugResults.connection?.region}</p>
              <p>Connected: {debugResults.connection?.connected ? 'Yes' : 'No'}</p>
              <p>Bucket Exists: {debugResults.connection?.bucketExists ? 'Yes' : 'No'}</p>
              <p>Read Permission: {debugResults.connection?.hasReadPermission ? 'Yes' : 'No'}</p>
              {debugResults.connection?.error && (
                <p className="text-red-400">Error: {debugResults.connection.error}</p>
              )}
            </div>
          </div>

          {/* Data Summary */}
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="h-5 w-5 text-blue-400" />
              <h4 className="text-white font-medium">Data Summary</h4>
            </div>
            <div className="text-sm text-gray-300 space-y-1">
              <p>Total Records: {debugResults.dataCount || 0}</p>
              <p>High Severity Alerts: {debugResults.highSeverityCount || 0}</p>
              <p>Last Updated: {debugResults.timestamp}</p>
            </div>
          </div>

          {/* Sample Data */}
          {debugResults.sampleData && debugResults.sampleData.length > 0 && (
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <h4 className="text-white font-medium">Sample Data</h4>
              </div>
              <div className="space-y-2">
                {debugResults.sampleData.map((item: any, index: number) => (
                  <div key={index} className="text-xs text-gray-300 p-2 bg-gray-900/50 rounded">
                    <p><strong>Type:</strong> {item.disaster_type}</p>
                    <p><strong>Severity:</strong> {item.severity}</p>
                    <p><strong>Location:</strong> {item.location?.place_name || 'Unknown'}</p>
                    <p><strong>Text:</strong> {item.text?.substring(0, 100)}...</p>
                    <p><strong>Created:</strong> {item.created_at}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw JSON Data */}
          <details className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
            <summary className="text-white font-medium cursor-pointer">Raw Debug Data</summary>
            <pre className="mt-2 text-xs text-gray-300 overflow-auto max-h-64 bg-gray-900/50 p-2 rounded">
              {rawData}
            </pre>
          </details>
        </div>
      )}

      {!debugResults && (
        <div className="text-center py-8 text-gray-400">
          <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Click "Run Debug Test" to check S3 connection and data</p>
        </div>
      )}
    </div>
  )
}

export default S3DataDebugger
