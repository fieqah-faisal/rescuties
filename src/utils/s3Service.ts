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
  private s3Client: S3Client
  private bucketName: string

  constructor() {
    this.s3Client = new S3Client({
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''
      },
      // Add CORS configuration for browser requests
      requestHandler: {
        requestTimeout: 10000,
        httpsAgent: undefined
      }
    })
    this.bucketName = import.meta.env.VITE_S3_BUCKET_NAME || 'cloud-cuties-tweet-bucket'
  }

  async testConnection(): Promise<S3ConnectionStatus> {
    const status: S3ConnectionStatus = {
      connected: false,
      bucketExists: false,
      hasReadPermission: false,
      bucketName: this.bucketName,
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      corsIssue: false,
      credentialsValid: false
    }

    // First, validate credentials are present
    if (!import.meta.env.VITE_AWS_ACCESS_KEY_ID || !import.meta.env.VITE_AWS_SECRET_ACCESS_KEY) {
      status.error = 'AWS credentials missing from .env file'
      return status
    }

    try {
      console.log(`🔍 Testing S3 connection to bucket: ${this.bucketName}`)
      console.log(`📍 Region: ${status.region}`)
      console.log(`🔑 Access Key: ${import.meta.env.VITE_AWS_ACCESS_KEY_ID?.substring(0, 8)}...`)
      
      // Test 1: Check if bucket exists and we have access
      const headCommand = new HeadBucketCommand({
        Bucket: this.bucketName
      })
      
      const headResponse = await this.s3Client.send(headCommand)
      status.bucketExists = true
      status.credentialsValid = true
      console.log('✅ Bucket exists and accessible')
      console.log('✅ AWS credentials are valid')

      // Test 2: Check if we can list objects (read permission)
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        MaxKeys: 1
      })

      const listResponse = await this.s3Client.send(listCommand)
      status.hasReadPermission = true
      status.connected = true
      
      console.log('✅ Read permissions confirmed')
      console.log(`📊 Bucket contains ${listResponse.KeyCount || 0} objects`)
      
      if (listResponse.Contents && listResponse.Contents.length > 0) {
        console.log('📁 Sample objects found:')
        listResponse.Contents.slice(0, 3).forEach(obj => {
          console.log(`  - ${obj.Key} (${obj.Size} bytes, modified: ${obj.LastModified})`)
        })
      } else {
        console.log('📭 Bucket is empty (this is expected if backend hasn\'t started yet)')
      }

      return status

    } catch (error: any) {
      console.error('❌ S3 Connection Error:', error)
      
      // Detailed error analysis
      if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
        status.corsIssue = true
        status.error = 'CORS issue: S3 bucket needs CORS configuration for browser access'
        console.error('🚫 CORS Error: The S3 bucket needs CORS policy configured')
        console.error('💡 Solution: Add CORS policy to allow browser requests')
      } else if (error.name === 'NoSuchBucket') {
        status.error = `Bucket '${this.bucketName}' does not exist`
      } else if (error.name === 'AccessDenied' || error.name === 'Forbidden') {
        status.error = 'Access denied - check IAM permissions for S3'
      } else if (error.name === 'InvalidAccessKeyId') {
        status.error = 'Invalid AWS Access Key ID'
      } else if (error.name === 'SignatureDoesNotMatch') {
        status.error = 'Invalid AWS Secret Access Key'
      } else if (error.name === 'CredentialsError') {
        status.error = 'AWS credentials not configured properly'
      } else if (error.code === 'NetworkingError' || error.message?.includes('network')) {
        status.error = 'Network error - check internet connection'
      } else {
        status.error = `Connection failed: ${error.message || error.name || 'Unknown error'}`
      }
      
      return status
    }
  }

  async getLatestDisasterData(): Promise<TwitterDisasterData[]> {
    try {
      // List objects to get the latest files
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        MaxKeys: 10
      })

      const listResponse = await this.s3Client.send(listCommand)
      
      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        console.log('No disaster data found in S3')
        return []
      }

      // Sort by last modified to get latest files
      const sortedFiles = listResponse.Contents
        .filter(obj => obj.Key && obj.Key.endsWith('.json'))
        .sort((a, b) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0))
        .slice(0, 5) // Get latest 5 files

      const allData: TwitterDisasterData[] = []

      // Fetch data from each file
      for (const file of sortedFiles) {
        if (file.Key) {
          const data = await this.getObjectData(file.Key)
          if (data) {
            allData.push(...data)
          }
        }
      }

      return allData.slice(0, 20) // Return latest 20 alerts
    } catch (error) {
      console.error('Error fetching disaster data from S3:', error)
      return []
    }
  }

  private async getObjectData(key: string): Promise<TwitterDisasterData[] | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      })

      const response = await this.s3Client.send(command)
      
      if (response.Body) {
        const bodyText = await response.Body.transformToString()
        const jsonData = JSON.parse(bodyText)
        
        // Handle different JSON structures
        if (Array.isArray(jsonData)) {
          return jsonData
        } else if (jsonData.alerts || jsonData.data) {
          return jsonData.alerts || jsonData.data
        } else {
          return [jsonData]
        }
      }
      
      return null
    } catch (error) {
      console.error(`Error reading S3 object ${key}:`, error)
      return null
    }
  }

  async getDisasterDataByType(disasterType: string): Promise<TwitterDisasterData[]> {
    const allData = await this.getLatestDisasterData()
    return allData.filter(item => 
      item.disaster_type.toLowerCase() === disasterType.toLowerCase()
    )
  }

  async getHighSeverityAlerts(): Promise<TwitterDisasterData[]> {
    const allData = await this.getLatestDisasterData()
    return allData.filter(item => item.severity === 'high')
  }
}

export const s3Service = new S3Service()
