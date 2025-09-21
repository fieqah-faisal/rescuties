import { 
  KinesisClient, 
  PutRecordCommand, 
  DescribeStreamCommand,
  ListStreamsCommand 
} from '@aws-sdk/client-kinesis'
import { 
  BedrockRuntimeClient, 
  InvokeModelCommand 
} from '@aws-sdk/client-bedrock-runtime'
import { 
  LambdaClient, 
  InvokeCommand 
} from '@aws-sdk/client-lambda'
import { 
  ComprehendClient, 
  DetectSentimentCommand,
  DetectEntitiesCommand,
  DetectKeyPhrasesCommand 
} from '@aws-sdk/client-comprehend'

// AWS Configuration with enhanced error handling
const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1'
const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID || ''
const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''

console.log('🔧 AWS Configuration Check:')
console.log('  Region:', AWS_REGION)
console.log('  Access Key ID:', AWS_ACCESS_KEY_ID ? `${AWS_ACCESS_KEY_ID.substring(0, 8)}...` : 'MISSING')
console.log('  Secret Access Key:', AWS_SECRET_ACCESS_KEY ? 'PRESENT' : 'MISSING')
console.log('  Environment:', import.meta.env.MODE)

// Validate credentials
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.error('❌ AWS credentials missing! Check environment variables in Amplify console.')
  console.error('Required variables: VITE_AWS_ACCESS_KEY_ID, VITE_AWS_SECRET_ACCESS_KEY')
}

const awsConfig = {
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  },
  // Enhanced configuration for production
  maxAttempts: 3,
  retryMode: 'adaptive' as const,
  requestHandler: {
    requestTimeout: 30000,
    connectionTimeout: 10000
  }
}

// Initialize AWS clients with error handling
let kinesisClient: KinesisClient | null = null
let bedrockClient: BedrockRuntimeClient | null = null
let lambdaClient: LambdaClient | null = null
let comprehendClient: ComprehendClient | null = null

try {
  if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
    kinesisClient = new KinesisClient(awsConfig)
    bedrockClient = new BedrockRuntimeClient(awsConfig)
    lambdaClient = new LambdaClient(awsConfig)
    comprehendClient = new ComprehendClient(awsConfig)
    console.log('✅ AWS clients initialized successfully')
  } else {
    console.warn('⚠️ AWS clients not initialized - missing credentials')
  }
} catch (error) {
  console.error('❌ Failed to initialize AWS clients:', error)
}

export { kinesisClient, bedrockClient, lambdaClient, comprehendClient }

// Kinesis Service with enhanced error handling
export class KinesisService {
  private streamName: string

  constructor(streamName: string = 'disaster-alerts-stream') {
    this.streamName = streamName
  }

  async putRecord(data: any, partitionKey: string = 'default') {
    if (!kinesisClient) {
      throw new Error('Kinesis client not initialized - check AWS credentials')
    }

    try {
      const command = new PutRecordCommand({
        StreamName: this.streamName,
        Data: new TextEncoder().encode(JSON.stringify(data)),
        PartitionKey: partitionKey
      })

      const response = await kinesisClient.send(command)
      console.log('✅ Kinesis record sent:', response.SequenceNumber)
      return response
    } catch (error: any) {
      console.error('❌ Kinesis error:', error)
      
      // Enhanced error reporting
      if (error.name === 'AccessDeniedException') {
        throw new Error('Kinesis access denied - check IAM permissions')
      } else if (error.name === 'ResourceNotFoundException') {
        throw new Error(`Kinesis stream '${this.streamName}' not found`)
      } else if (error.name === 'InvalidAccessKeyId') {
        throw new Error('Invalid AWS Access Key ID')
      } else if (error.name === 'SignatureDoesNotMatch') {
        throw new Error('Invalid AWS Secret Access Key')
      }
      
      throw error
    }
  }

  async checkStreamStatus() {
    if (!kinesisClient) {
      return { status: 'ERROR', shards: 0, streamName: this.streamName, error: 'Client not initialized' }
    }

    try {
      const command = new DescribeStreamCommand({
        StreamName: this.streamName
      })

      const response = await kinesisClient.send(command)
      return {
        status: response.StreamDescription?.StreamStatus,
        shards: response.StreamDescription?.Shards?.length || 0,
        streamName: this.streamName
      }
    } catch (error: any) {
      console.error('❌ Kinesis stream check error:', error)
      return { 
        status: 'ERROR', 
        shards: 0, 
        streamName: this.streamName,
        error: error.message || error.name
      }
    }
  }

  async listStreams() {
    if (!kinesisClient) {
      throw new Error('Kinesis client not initialized')
    }

    try {
      const command = new ListStreamsCommand({})
      const response = await kinesisClient.send(command)
      return response.StreamNames || []
    } catch (error) {
      console.error('❌ Kinesis list streams error:', error)
      return []
    }
  }
}

// Bedrock Service with enhanced error handling
export class BedrockService {
  async analyzeDisasterText(text: string, modelId: string = 'anthropic.claude-3-sonnet-20240229-v1:0') {
    if (!bedrockClient) {
      throw new Error('Bedrock client not initialized - check AWS credentials')
    }

    try {
      const prompt = `Analyze this text for disaster-related information:
      
Text: "${text}"

Please provide:
1. Disaster type (flood, landslide, earthquake, wildfire, etc.)
2. Severity level (low, medium, high)
3. Location mentioned (if any)
4. Urgency level (1-10)
5. Key details extracted

Respond in JSON format.`

      const command = new InvokeModelCommand({
        modelId,
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        }),
        contentType: 'application/json',
        accept: 'application/json'
      })

      const response = await bedrockClient.send(command)
      const responseBody = JSON.parse(new TextDecoder().decode(response.body))
      
      console.log('✅ Bedrock analysis complete')
      return responseBody.content[0].text
    } catch (error: any) {
      console.error('❌ Bedrock error:', error)
      
      if (error.name === 'AccessDeniedException') {
        throw new Error('Bedrock access denied - check IAM permissions')
      } else if (error.name === 'ValidationException') {
        throw new Error('Invalid Bedrock model or parameters')
      }
      
      throw error
    }
  }

  async generateDisasterResponse(disasterType: string, severity: string, location: string) {
    if (!bedrockClient) {
      throw new Error('Bedrock client not initialized - check AWS credentials')
    }

    try {
      const prompt = `Generate an emergency response recommendation for:
      
Disaster Type: ${disasterType}
Severity: ${severity}
Location: ${location}

Provide:
1. Immediate actions to take
2. Resources needed
3. Safety precautions
4. Estimated response time
5. Contact information

Keep response concise and actionable.`

      const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 800,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        }),
        contentType: 'application/json',
        accept: 'application/json'
      })

      const response = await bedrockClient.send(command)
      const responseBody = JSON.parse(new TextDecoder().decode(response.body))
      
      return responseBody.content[0].text
    } catch (error) {
      console.error('❌ Bedrock response generation error:', error)
      throw error
    }
  }
}

// Lambda Service with enhanced error handling
export class LambdaService {
  async invokeFunction(functionName: string, payload: any) {
    if (!lambdaClient) {
      throw new Error('Lambda client not initialized - check AWS credentials')
    }

    try {
      const command = new InvokeCommand({
        FunctionName: functionName,
        Payload: JSON.stringify(payload),
        InvocationType: 'RequestResponse'
      })

      const response = await lambdaClient.send(command)
      
      if (response.Payload) {
        const result = JSON.parse(new TextDecoder().decode(response.Payload))
        console.log('✅ Lambda function invoked:', functionName)
        return result
      }
      
      return null
    } catch (error: any) {
      console.error('❌ Lambda invocation error:', error)
      
      if (error.name === 'AccessDeniedException') {
        throw new Error('Lambda access denied - check IAM permissions')
      } else if (error.name === 'ResourceNotFoundException') {
        throw new Error(`Lambda function '${functionName}' not found`)
      }
      
      throw error
    }
  }

  async processDisasterAlert(alertData: any) {
    return this.invokeFunction('process-disaster-alert', alertData)
  }

  async getRouteOptimization(origin: string, destination: string, waypoints: string[]) {
    return this.invokeFunction('optimize-rescue-route', {
      origin,
      destination,
      waypoints,
      timestamp: new Date().toISOString()
    })
  }
}

// Comprehend Service with enhanced error handling
export class ComprehendService {
  async analyzeSentiment(text: string) {
    if (!comprehendClient) {
      throw new Error('Comprehend client not initialized - check AWS credentials')
    }

    try {
      const command = new DetectSentimentCommand({
        Text: text,
        LanguageCode: 'en'
      })

      const response = await comprehendClient.send(command)
      console.log('✅ Comprehend sentiment analysis complete')
      return response
    } catch (error: any) {
      console.error('❌ Comprehend sentiment error:', error)
      
      if (error.name === 'AccessDeniedException') {
        throw new Error('Comprehend access denied - check IAM permissions')
      }
      
      throw error
    }
  }

  async extractEntities(text: string) {
    if (!comprehendClient) {
      throw new Error('Comprehend client not initialized - check AWS credentials')
    }

    try {
      const command = new DetectEntitiesCommand({
        Text: text,
        LanguageCode: 'en'
      })

      const response = await comprehendClient.send(command)
      console.log('✅ Comprehend entity extraction complete')
      return response.Entities || []
    } catch (error) {
      console.error('❌ Comprehend entities error:', error)
      throw error
    }
  }

  async extractKeyPhrases(text: string) {
    if (!comprehendClient) {
      throw new Error('Comprehend client not initialized - check AWS credentials')
    }

    try {
      const command = new DetectKeyPhrasesCommand({
        Text: text,
        LanguageCode: 'en'
      })

      const response = await comprehendClient.send(command)
      console.log('✅ Comprehend key phrases extraction complete')
      return response.KeyPhrases || []
    } catch (error) {
      console.error('❌ Comprehend key phrases error:', error)
      throw error
    }
  }

  async analyzeDisasterText(text: string) {
    try {
      const [sentiment, entities, keyPhrases] = await Promise.all([
        this.analyzeSentiment(text),
        this.extractEntities(text),
        this.extractKeyPhrases(text)
      ])

      return {
        sentiment: sentiment.Sentiment,
        sentimentScore: sentiment.SentimentScore,
        entities,
        keyPhrases,
        analysisTimestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ Comprehend full analysis error:', error)
      throw error
    }
  }
}

// Service instances with null checks
export const kinesisService = new KinesisService()
export const bedrockService = new BedrockService()
export const lambdaService = new LambdaService()
export const comprehendService = new ComprehendService()

// Enhanced connection test function
export async function testAWSConnections() {
  console.log('🔍 Testing AWS service connections...')
  console.log('Environment:', import.meta.env.MODE)
  console.log('Region:', AWS_REGION)
  
  const results = {
    kinesis: false,
    bedrock: false,
    lambda: false,
    comprehend: false,
    s3: false,
    errors: {} as Record<string, string>
  }

  // Test Kinesis
  try {
    if (kinesisClient) {
      const streams = await kinesisService.listStreams()
      results.kinesis = true
      console.log('✅ Kinesis connected, streams:', streams.length)
    } else {
      results.errors.kinesis = 'Client not initialized'
    }
  } catch (error: any) {
    console.error('❌ Kinesis connection failed:', error)
    results.errors.kinesis = error.message || error.name
  }

  // Test Comprehend
  try {
    if (comprehendClient) {
      await comprehendService.analyzeSentiment('Test message for connection')
      results.comprehend = true
      console.log('✅ Comprehend connected')
    } else {
      results.errors.comprehend = 'Client not initialized'
    }
  } catch (error: any) {
    console.error('❌ Comprehend connection failed:', error)
    results.errors.comprehend = error.message || error.name
  }

  // Test S3
  try {
    const { s3Service } = await import('./s3Service')
    const status = await s3Service.testConnection()
    results.s3 = status.connected
    if (!status.connected && status.error) {
      results.errors.s3 = status.error
    }
    console.log('✅ S3 connected:', status.connected)
  } catch (error: any) {
    console.error('❌ S3 connection failed:', error)
    results.errors.s3 = error.message || error.name
  }

  return results
}
