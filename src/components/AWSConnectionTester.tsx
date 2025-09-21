import React, { useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Play, RefreshCw, Database, Activity, Brain, Zap, Cloud } from 'lucide-react'
import { 
  kinesisService, 
  bedrockService, 
  lambdaService, 
  comprehendService,
  testAWSConnections 
} from '../utils/awsServices'
import { s3Service } from '../utils/s3Service'

interface TestResult {
  service: string
  status: 'success' | 'error' | 'testing'
  message: string
  details?: any
  timestamp: Date
}

const AWSConnectionTester = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>('')

  const addResult = (service: string, status: 'success' | 'error' | 'testing', message: string, details?: any) => {
    setTestResults(prev => [...prev, {
      service,
      status,
      message,
      details,
      timestamp: new Date()
    }])
  }

  const clearResults = () => {
    setTestResults([])
  }

  const runComprehensiveTest = async () => {
    setIsRunning(true)
    clearResults()

    try {
      // Test 1: Check Environment Variables
      setCurrentTest('Environment Variables')
      addResult('env', 'testing', 'Checking environment variables...')
      
      const accessKey = import.meta.env.VITE_AWS_ACCESS_KEY_ID
      const secretKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
      const region = import.meta.env.VITE_AWS_REGION
      const bucketName = import.meta.env.VITE_S3_BUCKET_NAME

      if (!accessKey || !secretKey) {
        addResult('env', 'error', 'AWS credentials missing from environment variables')
        return
      }

      addResult('env', 'success', `Credentials found - Access Key: ${accessKey.substring(0, 8)}..., Region: ${region}, Bucket: ${bucketName}`)

      // Test 2: S3 Connection
      setCurrentTest('S3 Storage')
      addResult('s3', 'testing', 'Testing S3 connection...')
      
      try {
        const s3Status = await s3Service.testConnection()
        if (s3Status.connected) {
          addResult('s3', 'success', `S3 connected successfully to bucket: ${s3Status.bucketName}`, s3Status)
          
          // Try to fetch actual data
          const s3Data = await s3Service.getLatestDisasterData()
          addResult('s3', 'success', `S3 data fetch: Found ${s3Data.length} disaster records`, { dataCount: s3Data.length, sampleData: s3Data.slice(0, 2) })
        } else {
          addResult('s3', 'error', `S3 connection failed: ${s3Status.error}`, s3Status)
        }
      } catch (error: any) {
        addResult('s3', 'error', `S3 error: ${error.message}`, error)
      }

      // Test 3: Kinesis
      setCurrentTest('Kinesis Data Streams')
      addResult('kinesis', 'testing', 'Testing Kinesis connection...')
      
      try {
        const streams = await kinesisService.listStreams()
        addResult('kinesis', 'success', `Kinesis connected - Found ${streams.length} streams`, { streams })
        
        const streamStatus = await kinesisService.checkStreamStatus()
        addResult('kinesis', 'success', `Stream status: ${streamStatus.status}, Shards: ${streamStatus.shards}`, streamStatus)
        
        // Test sending a record
        try {
          const testRecord = await kinesisService.putRecord({
            test: true,
            message: 'Frontend connection test',
            timestamp: new Date().toISOString()
          }, 'test-partition')
          addResult('kinesis', 'success', `Test record sent successfully - Sequence: ${testRecord.SequenceNumber}`, testRecord)
        } catch (error: any) {
          addResult('kinesis', 'error', `Failed to send test record: ${error.message}`, error)
        }
      } catch (error: any) {
        addResult('kinesis', 'error', `Kinesis error: ${error.message}`, error)
      }

      // Test 4: Comprehend
      setCurrentTest('Comprehend NLP')
      addResult('comprehend', 'testing', 'Testing Comprehend NLP...')
      
      try {
        const testText = "There is severe flooding in Kuala Lumpur causing major disruptions"
        const sentiment = await comprehendService.analyzeSentiment(testText)
        addResult('comprehend', 'success', `Sentiment analysis successful - Result: ${sentiment.Sentiment}`, sentiment)
        
        const entities = await comprehendService.extractEntities(testText)
        addResult('comprehend', 'success', `Entity extraction successful - Found ${entities.length} entities`, entities)
        
        const keyPhrases = await comprehendService.extractKeyPhrases(testText)
        addResult('comprehend', 'success', `Key phrases extraction successful - Found ${keyPhrases.length} phrases`, keyPhrases)
      } catch (error: any) {
        addResult('comprehend', 'error', `Comprehend error: ${error.message}`, error)
      }

      // Test 5: Bedrock (if available)
      setCurrentTest('Bedrock AI')
      addResult('bedrock', 'testing', 'Testing Bedrock AI...')
      
      try {
        const testAnalysis = await bedrockService.analyzeDisasterText("Flash flood reported in downtown Kuala Lumpur with water levels rising rapidly")
        addResult('bedrock', 'success', 'Bedrock AI analysis successful', { analysis: testAnalysis })
      } catch (error: any) {
        addResult('bedrock', 'error', `Bedrock error: ${error.message}`, error)
      }

      // Test 6: Lambda (if functions exist)
      setCurrentTest('Lambda Functions')
      addResult('lambda', 'testing', 'Testing Lambda functions...')
      
      try {
        // This will likely fail if functions don't exist, but we'll test the connection
        const lambdaTest = await lambdaService.invokeFunction('test-function', { test: true })
        addResult('lambda', 'success', 'Lambda function invoked successfully', lambdaTest)
      } catch (error: any) {
        if (error.message.includes('Function not found')) {
          addResult('lambda', 'error', 'Lambda functions not deployed yet (this is expected)', error)
        } else {
          addResult('lambda', 'error', `Lambda error: ${error.message}`, error)
        }
      }

    } catch (error: any) {
      addResult('general', 'error', `General test error: ${error.message}`, error)
    } finally {
      setIsRunning(false)
      setCurrentTest('')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'testing':
        return <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 's3':
        return <Cloud className="h-4 w-4" />
      case 'kinesis':
        return <Activity className="h-4 w-4" />
      case 'comprehend':
        return <Database className="h-4 w-4" />
      case 'bedrock':
        return <Brain className="h-4 w-4" />
      case 'lambda':
        return <Zap className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="gradient-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">AWS Connection Tester</h3>
        <div className="flex items-center space-x-3">
          {isRunning && (
            <div className="flex items-center space-x-2 text-blue-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Testing {currentTest}...</span>
            </div>
          )}
          <button
            onClick={runComprehensiveTest}
            disabled={isRunning}
            className="flex items-center space-x-2 btn-primary px-4 py-2 rounded-lg text-sm"
          >
            <Play className="h-4 w-4" />
            <span>Run Full Test</span>
          </button>
          <button
            onClick={clearResults}
            className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Test Results */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {testResults.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Click "Run Full Test" to verify AWS service connections</p>
          </div>
        ) : (
          testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                result.status === 'success'
                  ? 'bg-green-500/10 border-green-500/30'
                  : result.status === 'error'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    result.status === 'success' ? 'bg-green-500/20' :
                    result.status === 'error' ? 'bg-red-500/20' : 'bg-blue-500/20'
                  }`}>
                    {getServiceIcon(result.service)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium capitalize">{result.service}</span>
                      {getStatusIcon(result.status)}
                    </div>
                    <p className="text-gray-300 text-sm mt-1">{result.message}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {result.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              {result.details && (
                <details className="mt-3">
                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                    View Details
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-900/50 rounded text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quick Tips */}
      <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
        <h4 className="text-blue-400 font-medium mb-2">Troubleshooting Tips:</h4>
        <ul className="text-blue-300 text-sm space-y-1">
          <li>• If S3 fails: Check bucket name and CORS configuration</li>
          <li>• If Kinesis fails: Verify stream name exists in AWS console</li>
          <li>• If Comprehend fails: Check IAM permissions for text analysis</li>
          <li>• If Bedrock fails: Ensure model access is enabled in AWS console</li>
          <li>• If Lambda fails: Functions may not be deployed yet (expected)</li>
        </ul>
      </div>
    </div>
  )
}

export default AWSConnectionTester
