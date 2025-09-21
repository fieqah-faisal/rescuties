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

// AWS Configuration
const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1'
const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID || ''
const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''

const awsConfig = {
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
}

// Initialize AWS clients
export const kinesisClient = new KinesisClient(awsConfig)
export const bedrockClient = new BedrockRuntimeClient(awsConfig)
export const lambdaClient = new LambdaClient(awsConfig)
export const comprehendClient = new ComprehendClient(awsConfig)

// Kinesis Service
export class KinesisService {
  private streamName: string

  constructor(streamName: string = 'disaster-alerts-stream') {
    this.streamName = streamName
  }

  async putRecord(data: any, partitionKey: string = 'default') {
    try {
      const command = new PutRecordCommand({
        StreamName: this.streamName,
        Data: new TextEncoder().encode(JSON.stringify(data)),
        PartitionKey: partitionKey
      })

      const response = await kinesisClient.send(command)
      console.log('✅ Kinesis record sent:', response.SequenceNumber)
      return response
    } catch (error) {
      console.error('❌ Kinesis error:', error)
      throw error
    }
  }

  async checkStreamStatus() {
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
    } catch (error) {
      console.error('❌ Kinesis stream check error:', error)
      return { status: 'ERROR', shards: 0, streamName: this.streamName }
    }
  }

  async listStreams() {
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

// Bedrock Service for AI Analysis
export class BedrockService {
  async analyzeDisasterText(text: string, modelId: string = 'anthropic.claude-3-sonnet-20240229-v1:0') {
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
    } catch (error) {
      console.error('❌ Bedrock error:', error)
      throw error
    }
  }

  async generateDisasterResponse(disasterType: string, severity: string, location: string) {
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

// Lambda Service
export class LambdaService {
  async invokeFunction(functionName: string, payload: any) {
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
    } catch (error) {
      console.error('❌ Lambda invocation error:', error)
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

// Comprehend Service for Text Analysis
export class ComprehendService {
  async analyzeSentiment(text: string) {
    try {
      const command = new DetectSentimentCommand({
        Text: text,
        LanguageCode: 'en'
      })

      const response = await comprehendClient.send(command)
      console.log('✅ Comprehend sentiment analysis complete')
      return response
    } catch (error) {
      console.error('❌ Comprehend sentiment error:', error)
      throw error
    }
  }

  async extractEntities(text: string) {
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

// Service instances
export const kinesisService = new KinesisService()
export const bedrockService = new BedrockService()
export const lambdaService = new LambdaService()
export const comprehendService = new ComprehendService()

// Connection test function
export async function testAWSConnections() {
  console.log('🔍 Testing AWS service connections...')
  
  const results = {
    kinesis: false,
    bedrock: false,
    lambda: false,
    comprehend: false,
    s3: false
  }

  try {
    // Test Kinesis
    const streams = await kinesisService.listStreams()
    results.kinesis = true
    console.log('✅ Kinesis connected, streams:', streams.length)
  } catch (error) {
    console.error('❌ Kinesis connection failed:', error)
  }

  try {
    // Test Comprehend
    await comprehendService.analyzeSentiment('Test message for connection')
    results.comprehend = true
    console.log('✅ Comprehend connected')
  } catch (error) {
    console.error('❌ Comprehend connection failed:', error)
  }

  try {
    // Test S3 (using existing service)
    const { s3Service } = await import('./s3Service')
    const status = await s3Service.testConnection()
    results.s3 = status.connected
    console.log('✅ S3 connected:', status.connected)
  } catch (error) {
    console.error('❌ S3 connection failed:', error)
  }

  return results
}
