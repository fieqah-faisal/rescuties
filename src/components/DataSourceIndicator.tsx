import React, { useState, useEffect } from 'react'
import { Database, Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import { s3Service } from '../utils/s3Service'
import { useAWSServices } from '../hooks/useAWSServices'

interface DataSource {
  name: string
  status: 'connected' | 'disconnected' | 'checking'
  lastUpdate?: Date
  recordCount?: number
  error?: string
}

const DataSourceIndicator = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const { status: awsStatus } = useAWSServices()

  const checkDataSources = async () => {
    setIsChecking(true)
    const sources: DataSource[] = []

    // Check S3 Data Source
    try {
      const s3Status = await s3Service.testConnection()
      const s3Data = await s3Service.getLatestDisasterData()
      
      sources.push({
        name: 'S3 Disaster Data',
        status: s3Status.connected ? 'connected' : 'disconnected',
        lastUpdate: new Date(),
        recordCount: s3Data.length,
        error: s3Status.error
      })
    } catch (error: any) {
      sources.push({
        name: 'S3 Disaster Data',
        status: 'disconnected',
        error: error.message
      })
    }

    // Check AWS Services Status
    sources.push({
      name: 'Kinesis Stream',
      status: awsStatus.kinesis ? 'connected' : 'disconnected',
      lastUpdate: awsStatus.lastChecked || undefined
    })

    sources.push({
      name: 'Comprehend NLP',
      status: awsStatus.comprehend ? 'connected' : 'disconnected',
      lastUpdate: awsStatus.lastChecked || undefined
    })

    sources.push({
      name: 'Bedrock AI',
      status: awsStatus.bedrock ? 'connected' : 'disconnected',
      lastUpdate: awsStatus.lastChecked || undefined
    })

    setDataSources(sources)
    setIsChecking(false)
  }

  useEffect(() => {
    checkDataSources()
    const interval = setInterval(checkDataSources, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [awsStatus])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-red-400" />
      case 'checking':
        return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const connectedCount = dataSources.filter(source => source.status === 'connected').length
  const totalCount = dataSources.length

  return (
    <div className="gradient-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
            <Database className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h4 className="text-white font-medium">Data Sources</h4>
            <p className="text-gray-400 text-xs">
              {connectedCount}/{totalCount} sources active
            </p>
          </div>
        </div>
        <button
          onClick={checkDataSources}
          disabled={isChecking}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-3">
        {dataSources.map((source, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border transition-all duration-300 ${
              source.status === 'connected'
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                {getStatusIcon(source.status)}
                <span className="text-white text-sm font-medium">{source.name}</span>
              </div>
              {source.recordCount !== undefined && (
                <span className="text-xs text-gray-400">
                  {source.recordCount} records
                </span>
              )}
            </div>
            
            {source.error && (
              <p className="text-red-400 text-xs mt-1">{source.error}</p>
            )}
            
            {source.lastUpdate && (
              <p className="text-gray-400 text-xs">
                Last checked: {source.lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Data Source Status Summary */}
      <div className="mt-4 p-3 rounded-lg bg-gray-800/50">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Overall Status:</span>
          <div className="flex items-center space-x-2">
            {connectedCount === totalCount ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">All Systems Online</span>
              </>
            ) : connectedCount > 0 ? (
              <>
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <span className="text-yellow-400 text-sm font-medium">Partial Connection</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-red-400 text-sm font-medium">Services Offline</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataSourceIndicator
