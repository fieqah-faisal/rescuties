// Amazon SNS Client Configuration
// This file handles SNS integration for notification services

import { SNSClient as AWSSNSClient, PublishCommand, SubscribeCommand, UnsubscribeCommand, ListTopicsCommand, GetTopicAttributesCommand } from '@aws-sdk/client-sns'

export interface SNSConfig {
  region: string
  topicArn?: string
}

export interface NotificationMessage {
  subject: string
  message: string
  attributes?: Record<string, any>
  targetArn?: string
  phoneNumber?: string
  email?: string
}

export interface SNSSubscription {
  protocol: 'sms' | 'email' | 'http' | 'https' | 'application'
  endpoint: string
  topicArn: string
}

export interface SNSResponse {
  messageId?: string
  subscriptionArn?: string
  success: boolean
  error?: string
}

export class SNSClient {
  private config: SNSConfig
  private client: AWSSNSClient | null = null
  private isConfigured: boolean = false
  private lastError: string | null = null

  constructor(config: SNSConfig) {
    this.config = config
    this.initializeClient()
  }

  private initializeClient() {
    console.log('📡 Initializing SNS Client with config:', this.config)
    
    // Check if AWS credentials are available
    const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID
    const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
    
    if (accessKeyId && secretAccessKey) {
      try {
        this.client = new AWSSNSClient({
          region: this.config.region,
          credentials: {
            accessKeyId,
            secretAccessKey,
            sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN // Optional for temporary credentials
          }
        })
        this.isConfigured = true
        console.log('✅ SNS Client initialized with AWS credentials')
        console.log('🔑 Access Key ID:', accessKeyId.substring(0, 8) + '...')
        console.log('🌍 Region:', this.config.region)
        console.log('📍 Topic ARN:', this.config.topicArn)
      } catch (error) {
        console.error('❌ Failed to initialize SNS Client:', error)
        this.isConfigured = false
        this.lastError = `Initialization failed: ${error}`
      }
    } else {
      console.warn('⚠️ AWS credentials not found in environment variables')
      console.log('📝 Missing credentials:')
      console.log('- VITE_AWS_ACCESS_KEY_ID:', accessKeyId ? 'Present' : 'Missing')
      console.log('- VITE_AWS_SECRET_ACCESS_KEY:', secretAccessKey ? 'Present' : 'Missing')
      this.isConfigured = false
      this.lastError = 'AWS credentials not found in environment variables'
    }
  }

  async publishMessage(notification: NotificationMessage): Promise<SNSResponse> {
    try {
      console.log('📤 Publishing SNS message:', notification)

      if (!this.client || !this.isConfigured) {
        const error = this.lastError || 'SNS Client not configured'
        console.warn('⚠️ SNS Client not configured - Error:', error)
        return {
          success: false,
          error: `SNS connection failed - ${error}`
        }
      }

      if (!this.config.topicArn) {
        return {
          success: false,
          error: 'SNS Topic ARN not configured'
        }
      }

      const command = new PublishCommand({
        TopicArn: this.config.topicArn,
        Subject: notification.subject,
        Message: notification.message,
        MessageAttributes: notification.attributes ? {
          ...Object.entries(notification.attributes).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: {
              DataType: 'String',
              StringValue: String(value)
            }
          }), {})
        } : undefined,
        PhoneNumber: notification.phoneNumber,
        TargetArn: notification.targetArn
      })

      const response = await this.client.send(command)
      
      console.log('✅ SNS message published successfully:', response.MessageId)
      
      return {
        messageId: response.MessageId,
        success: true
      }
    } catch (error: any) {
      console.error('❌ SNS publish error:', error)
      
      let errorMessage = 'Unknown error occurred'
      
      if (error.name === 'InvalidUserPoolConfigException') {
        errorMessage = 'Invalid AWS credentials or user pool configuration'
      } else if (error.name === 'NotAuthorizedException') {
        errorMessage = 'AWS credentials not authorized for SNS operations'
      } else if (error.name === 'AccessDeniedException') {
        errorMessage = 'Access denied - check IAM permissions for SNS:Publish'
      } else if (error.name === 'InvalidParameterException') {
        errorMessage = 'Invalid parameters - check Topic ARN and message format'
      } else if (error.name === 'TopicDoesNotExistException') {
        errorMessage = 'SNS Topic does not exist or is not accessible'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return {
        success: false,
        error: `SNS publish failed: ${errorMessage}`
      }
    }
  }

  async subscribe(subscription: SNSSubscription): Promise<SNSResponse> {
    try {
      console.log('📝 Creating SNS subscription:', subscription)

      if (!this.client || !this.isConfigured) {
        const error = this.lastError || 'SNS Client not configured'
        return {
          success: false,
          error: `SNS connection failed - ${error}`
        }
      }

      const command = new SubscribeCommand({
        TopicArn: subscription.topicArn,
        Protocol: subscription.protocol,
        Endpoint: subscription.endpoint
      })

      const response = await this.client.send(command)
      
      console.log('✅ SNS subscription created:', response.SubscriptionArn)
      
      return {
        subscriptionArn: response.SubscriptionArn,
        success: true
      }
    } catch (error: any) {
      console.error('❌ SNS subscribe error:', error)
      
      let errorMessage = 'Unknown error occurred'
      
      if (error.name === 'AccessDeniedException') {
        errorMessage = 'Access denied - check IAM permissions for SNS:Subscribe'
      } else if (error.name === 'InvalidParameterException') {
        errorMessage = 'Invalid subscription parameters'
      } else if (error.name === 'TopicDoesNotExistException') {
        errorMessage = 'SNS Topic does not exist'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return {
        success: false,
        error: `SNS subscription failed: ${errorMessage}`
      }
    }
  }

  async unsubscribe(subscriptionArn: string): Promise<SNSResponse> {
    try {
      console.log('🗑️ Unsubscribing from SNS:', subscriptionArn)

      if (!this.client || !this.isConfigured) {
        const error = this.lastError || 'SNS Client not configured'
        return {
          success: false,
          error: `SNS connection failed - ${error}`
        }
      }

      const command = new UnsubscribeCommand({
        SubscriptionArn: subscriptionArn
      })

      await this.client.send(command)
      
      console.log('✅ SNS unsubscription successful')
      
      return { success: true }
    } catch (error: any) {
      console.error('❌ SNS unsubscribe error:', error)
      return {
        success: false,
        error: `SNS unsubscribe failed: ${error.message || error}`
      }
    }
  }

  async validateConnection(): Promise<boolean> {
    try {
      console.log('🔍 Validating SNS connection...')
      
      if (!this.client || !this.isConfigured) {
        console.warn('⚠️ SNS Client not configured')
        return false
      }

      // First try to list topics to validate basic SNS access
      console.log('📋 Testing SNS:ListTopics permission...')
      const listCommand = new ListTopicsCommand({})
      const listResponse = await this.client.send(listCommand)
      console.log(`✅ SNS:ListTopics successful - Found ${listResponse.Topics?.length || 0} topics`)

      // If we have a topic ARN, try to get its attributes
      if (this.config.topicArn) {
        console.log('🔍 Testing SNS:GetTopicAttributes permission...')
        const getAttrsCommand = new GetTopicAttributesCommand({
          TopicArn: this.config.topicArn
        })
        const attrsResponse = await this.client.send(getAttrsCommand)
        console.log('✅ SNS:GetTopicAttributes successful')
        console.log('📊 Topic attributes:', Object.keys(attrsResponse.Attributes || {}))
      }
      
      console.log('✅ SNS connection validated successfully')
      this.lastError = null
      return true
    } catch (error: any) {
      console.error('❌ SNS connection validation failed:', error)
      
      let errorMessage = 'Connection validation failed'
      
      if (error.name === 'AccessDeniedException') {
        errorMessage = 'Access denied - check IAM permissions (SNS:ListTopics, SNS:GetTopicAttributes)'
      } else if (error.name === 'InvalidUserPoolConfigException') {
        errorMessage = 'Invalid AWS credentials'
      } else if (error.name === 'NotAuthorizedException') {
        errorMessage = 'AWS credentials not authorized'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      this.lastError = errorMessage
      return false
    }
  }

  getConnectionStatus(): 'connected' | 'disconnected' | 'error' {
    if (!this.isConfigured) return 'disconnected'
    if (this.lastError) return 'error'
    return 'connected'
  }

  getLastError(): string | null {
    return this.lastError
  }

  isReady(): boolean {
    return this.isConfigured && this.client !== null && !this.lastError
  }
}

// Factory function to create SNS client
export function createSNSClient(): SNSClient {
  const config: SNSConfig = {
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    topicArn: import.meta.env.VITE_SNS_TOPIC_ARN
  }

  return new SNSClient(config)
}

// Export singleton instance
export const snsClient = createSNSClient()
