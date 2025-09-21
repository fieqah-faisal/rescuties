import { useState, useEffect } from 'react'
import { 
  kinesisService, 
  bedrockService, 
  lambdaService, 
  comprehendService,
  testAWSConnections 
} from '../utils/awsServices'

export interface AWSServiceStatus {
  kinesis: boolean
  bedrock: boolean
  lambda: boolean
  comprehend: boolean
  s3: boolean
  lastChecked: Date | null
}

export const useAWSServices = () => {
  const [status, setStatus] = useState<AWSServiceStatus>({
    kinesis: false,
    bedrock: false,
    lambda: false,
    comprehend: false,
    s3: false,
    lastChecked: null
  })
  const [loading, setLoading] = useState(true)

  const checkConnections = async () => {
    setLoading(true)
    try {
      const results = await testAWSConnections()
      setStatus({
        ...results,
        lastChecked: new Date()
      })
    } catch (error) {
      console.error('Error checking AWS connections:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConnections()
    
    // Check connections every 5 minutes
    const interval = setInterval(checkConnections, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    status,
    loading,
    checkConnections,
    services: {
      kinesis: kinesisService,
      bedrock: bedrockService,
      lambda: lambdaService,
      comprehend: comprehendService
    }
  }
}

export const useDisasterAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const analyzeText = async (text: string) => {
    setAnalyzing(true)
    try {
      // Use Comprehend for basic analysis
      const comprehendResults = await comprehendService.analyzeDisasterText(text)
      
      // Use Bedrock for advanced AI analysis
      const bedrockResults = await bedrockService.analyzeDisasterText(text)
      
      const combinedResults = {
        comprehend: comprehendResults,
        bedrock: bedrockResults,
        timestamp: new Date().toISOString()
      }
      
      setResults(combinedResults)
      
      // Send to Kinesis for processing
      await kinesisService.putRecord({
        type: 'disaster_analysis',
        text,
        results: combinedResults
      }, `analysis-${Date.now()}`)
      
      return combinedResults
    } catch (error) {
      console.error('Error analyzing text:', error)
      throw error
    } finally {
      setAnalyzing(false)
    }
  }

  return {
    analyzing,
    results,
    analyzeText
  }
}

export const useKinesisStream = (streamName?: string) => {
  const [streamStatus, setStreamStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const checkStream = async () => {
    try {
      const service = streamName ? new (await import('../utils/awsServices')).KinesisService(streamName) : kinesisService
      const status = await service.checkStreamStatus()
      setStreamStatus(status)
    } catch (error) {
      console.error('Error checking stream:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendRecord = async (data: any, partitionKey?: string) => {
    try {
      const service = streamName ? new (await import('../utils/awsServices')).KinesisService(streamName) : kinesisService
      return await service.putRecord(data, partitionKey)
    } catch (error) {
      console.error('Error sending record:', error)
      throw error
    }
  }

  useEffect(() => {
    checkStream()
  }, [streamName])

  return {
    streamStatus,
    loading,
    sendRecord,
    checkStream
  }
}
