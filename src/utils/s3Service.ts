import { S3Client, GetObjectCommand, ListObjectsV2Command, HeadBucketCommand } from '@aws-sdk/client-s3'

export interface TwitterDisasterData {
  id: string
  text: string
  created_at: string
  location?: {
    lat: number
    lng: number
    place_name: string
  }
  disaster_type: string
  severity: 'low' | 'medium' | 'high'
  confidence_score: number
  keywords: string[]
  user: {
    username: string
    followers_count: number
  }
}

export interface S3ConnectionStatus {
  connected: boolean
  bucketExists: boolean
  hasReadPermission: boolean
  error?: string
  bucketName: string
  region: string
  corsIssue?: boolean
  credentialsValid?: boolean
}

class S3Service {
  private s3Client: S3Client | null = null
  private bucketName: string
  private region: string
  private accessKeyId: string
  private secretAccessKey: string

  constructor() {
    this.region = import.meta.env.VITE_AWS_REGION || 'us-east-1'
    this.accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID || ''
    this.secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''
    this.bucketName = import.meta.env.VITE_S3_BUCKET_NAME || 'cloud-cuties-tweet-bucket'
    
    console.log('🔧 S3Service Configuration:')
    console.log('  Environment:', import.meta.env.MODE)
    console.log('  Region:', this.region)
    console.log('  Access Key:', this.accessKeyId ? `${this.accessKeyId.substring(0, 8)}...` : 'NOT SET')
    console.log('  Secret Key:', this.secretAccessKey ? 'SET' : 'NOT SET')
    console.log('  Bucket Name:', this.bucketName)
    
    this.initializeClient()
  }

  private initializeClient() {
    if (!this.accessKeyId || !this.secretAccessKey) {
      console.error('❌ S3 credentials missing from environment variables')
      return
    }

    try {
      this.s3Client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey
        },
        // Enhanced configuration for production
        maxAttempts: 3,
        retryMode: 'adaptive',
        requestHandler: {
          requestTimeout: 30000,
          connectionTimeout: 10000
        },
        // Force path-style URLs for better compatibility
        forcePathStyle: false, // Use virtual-hosted-style URLs for better compatibility
        // Ensure HTTPS
        endpoint: `https://s3.${this.region}.amazonaws.com`
      })
      
      console.log('✅ S3 client initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize S3 client:', error)
      this.s3Client = null
    }
  }

  async testConnection(): Promise<S3ConnectionStatus> {
    const status: S3ConnectionStatus = {
      connected: false,
      bucketExists: false,
      hasReadPermission: false,
      bucketName: this.bucketName,
      region: this.region,
      corsIssue: false,
      credentialsValid: false
    }

    // Check if client was initialized
    if (!this.s3Client) {
      status.error = 'S3 client not initialized - check AWS credentials in environment variables'
      console.error('❌ S3 client not initialized')
      return status
    }

    // Validate credentials are present
    if (!this.accessKeyId || !this.secretAccessKey) {
      status.error = 'AWS credentials missing from environment variables. Check VITE_AWS_ACCESS_KEY_ID and VITE_AWS_SECRET_ACCESS_KEY in Amplify console'
      console.error('❌ Missing AWS credentials in environment variables')
      return status
    }

    try {
      console.log(`🔍 Testing S3 connection to bucket: ${this.bucketName}`)
      console.log(`📍 Region: ${this.region}`)
      console.log(`🔑 Access Key: ${this.accessKeyId.substring(0, 8)}...`)
      console.log(`🌐 Environment: ${import.meta.env.MODE}`)
      
      // Test 1: Check if bucket exists and we have access
      const headCommand = new HeadBucketCommand({
        Bucket: this.bucketName
      })
      
      await this.s3Client.send(headCommand)
      status.bucketExists = true
      status.credentialsValid = true
      console.log('✅ Bucket exists and accessible')
      console.log('✅ AWS credentials are valid')

      // Test 2: Check if we can list objects (read permission)
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        MaxKeys: 5 // Get first 5 objects to test
      })

      const listResponse = await this.s3Client.send(listCommand)
      status.hasReadPermission = true
      status.connected = true
      
      console.log('✅ Read permissions confirmed')
      console.log(`📊 Bucket contains ${listResponse.KeyCount || 0} objects`)
      
      if (listResponse.Contents && listResponse.Contents.length > 0) {
        console.log('📁 Recent objects found:')
        listResponse.Contents.forEach(obj => {
          console.log(`  - ${obj.Key} (${obj.Size} bytes, modified: ${obj.LastModified?.toLocaleString()})`)
        })
      } else {
        console.log('📭 Bucket is empty - backend may not have started sending data yet')
      }

      return status

    } catch (error: any) {
      console.error('❌ S3 Connection Error:', error)
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        statusCode: error.$metadata?.httpStatusCode
      })
      
      // Enhanced error analysis for production deployment
      if (error.message?.includes('Failed to fetch') || error.name === 'TypeError' || error.message?.includes('CORS')) {
        status.corsIssue = true
        status.error = 'CORS issue: S3 bucket needs CORS configuration for browser access from Amplify domain. Update CORS policy to include your Amplify domain.'
        console.error('🚫 CORS Error: The S3 bucket needs CORS policy configured for Amplify domain')
      } else if (error.name === 'NoSuchBucket') {
        status.error = `Bucket '${this.bucketName}' does not exist in region '${this.region}'. Verify bucket name and region.`
      } else if (error.name === 'AccessDenied' || error.name === 'Forbidden' || error.$metadata?.httpStatusCode === 403) {
        status.error = 'Access denied - IAM user needs s3:GetObject, s3:ListBucket, and s3:HeadBucket permissions for this bucket.'
      } else if (error.name === 'InvalidAccessKeyId' || error.$metadata?.httpStatusCode === 403) {
        status.error = 'Invalid AWS Access Key ID. Check VITE_AWS_ACCESS_KEY_ID in Amplify environment variables.'
      } else if (error.name === 'SignatureDoesNotMatch') {
        status.error = 'Invalid AWS Secret Access Key. Check VITE_AWS_SECRET_ACCESS_KEY in Amplify environment variables.'
      } else if (error.name === 'CredentialsError') {
        status.error = 'AWS credentials not configured properly in Amplify environment variables.'
      } else if (error.code === 'NetworkingError' || error.message?.includes('network') || error.message?.includes('timeout')) {
        status.error = 'Network error - check internet connection and AWS service availability. May be a timeout issue in Amplify.'
      } else if (error.name === 'UnknownEndpoint') {
        status.error = `Invalid region '${this.region}' or endpoint configuration.`
      } else {
        status.error = `Connection failed: ${error.message || error.name || 'Unknown error'} (Status: ${error.$metadata?.httpStatusCode || 'unknown'})`
      }
      
      return status
    }
  }

  async getLatestDisasterData(): Promise<TwitterDisasterData[]> {
    if (!this.s3Client) {
      console.error('❌ S3 client not initialized')
      return []
    }

    try {
      console.log('🔍 Fetching latest disaster data from S3...')
      
      // List objects to get the latest files
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        MaxKeys: 20, // Get more files to ensure we have recent data
      })

      const listResponse = await this.s3Client.send(listCommand)
      
      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        console.log('📭 No disaster data found in S3 bucket')
        return []
      }

      console.log(`📦 Found ${listResponse.Contents.length} objects in S3`)

      // Filter and sort by last modified to get latest files
      const jsonFiles = listResponse.Contents
        .filter(obj => obj.Key && obj.Key.endsWith('.json'))
        .sort((a, b) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0))
        .slice(0, 10) // Get latest 10 files

      console.log(`📄 Processing ${jsonFiles.length} JSON files`)

      const allData: TwitterDisasterData[] = []

      // Fetch data from each file
      for (const file of jsonFiles) {
        if (file.Key) {
          console.log(`📖 Reading file: ${file.Key}`)
          const data = await this.getObjectData(file.Key)
          if (data && data.length > 0) {
            console.log(`  ✅ Found ${data.length} records in ${file.Key}`)
            allData.push(...data)
          }
        }
      }

      console.log(`🎯 Total disaster records retrieved: ${allData.length}`)
      
      // Sort by created_at to get most recent alerts first
      const sortedData = allData.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      return sortedData.slice(0, 50) // Return latest 50 alerts
    } catch (error) {
      console.error('❌ Error fetching disaster data from S3:', error)
      return []
    }
  }

  private async getObjectData(key: string): Promise<TwitterDisasterData[] | null> {
    if (!this.s3Client) {
      return null
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      })

      const response = await this.s3Client.send(command)
      
      if (response.Body) {
        const bodyText = await response.Body.transformToString()
        console.log(`📝 File ${key} content preview:`, bodyText.substring(0, 200) + '...')
        
        const jsonData = JSON.parse(bodyText)
        
        // Handle different JSON structures that your backend might produce
        if (Array.isArray(jsonData)) {
          return jsonData
        } else if (jsonData.alerts) {
          return jsonData.alerts
        } else if (jsonData.data) {
          return jsonData.data
        } else if (jsonData.tweets) {
          return jsonData.tweets
        } else if (jsonData.disasters) {
          return jsonData.disasters
        } else {
          // Single object, wrap in array
          return [jsonData]
        }
      }
      
      return null
    } catch (error) {
      console.error(`❌ Error reading S3 object ${key}:`, error)
      return null
    }
  }

  async getDisasterDataByType(disasterType: string): Promise<TwitterDisasterData[]> {
    const allData = await this.getLatestDisasterData()
    return allData.filter(item => 
      item.disaster_type?.toLowerCase() === disasterType.toLowerCase()
    )
  }

  async getHighSeverityAlerts(): Promise<TwitterDisasterData[]> {
    const allData = await this.getLatestDisasterData()
    return allData.filter(item => item.severity === 'high')
  }
}

export const s3Service = new S3Service()
