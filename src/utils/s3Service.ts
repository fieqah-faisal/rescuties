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
    const region = import.meta.env.VITE_AWS_REGION || 'us-east-1'
    const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID || ''
    const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''
    
    console.log('🔧 S3Service Configuration:')
    console.log('  Region:', region)
    console.log('  Access Key:', accessKeyId ? `${accessKeyId.substring(0, 8)}...` : 'NOT SET')
    console.log('  Secret Key:', secretAccessKey ? 'SET' : 'NOT SET')
    
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      },
      // Enhanced configuration for browser requests
      requestHandler: {
        requestTimeout: 15000,
        httpsAgent: undefined
      },
      // Force path-style URLs for better compatibility
      forcePathStyle: true,
      // Add custom endpoint if needed (uncomment if using custom S3 endpoint)
      // endpoint: 'https://s3.amazonaws.com'
    })
    
    this.bucketName = import.meta.env.VITE_S3_BUCKET_NAME || 'cloud-cuties-tweet-bucket'
    console.log('  Bucket Name:', this.bucketName)
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
      status.error = 'AWS credentials missing from .env file. Please add VITE_AWS_ACCESS_KEY_ID and VITE_AWS_SECRET_ACCESS_KEY'
      console.error('❌ Missing AWS credentials in .env file')
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
      
      // Enhanced error analysis
      if (error.message?.includes('Failed to fetch') || error.name === 'TypeError' || error.message?.includes('CORS')) {
        status.corsIssue = true
        status.error = 'CORS issue: S3 bucket needs CORS configuration for browser access. Please configure CORS policy on your S3 bucket.'
        console.error('🚫 CORS Error: The S3 bucket needs CORS policy configured')
        console.error('💡 Solution: Add CORS policy to allow browser requests from your domain')
      } else if (error.name === 'NoSuchBucket') {
        status.error = `Bucket '${this.bucketName}' does not exist. Please verify the bucket name.`
      } else if (error.name === 'AccessDenied' || error.name === 'Forbidden') {
        status.error = 'Access denied - check IAM permissions for S3. The user needs s3:GetObject and s3:ListBucket permissions.'
      } else if (error.name === 'InvalidAccessKeyId') {
        status.error = 'Invalid AWS Access Key ID. Please check your credentials.'
      } else if (error.name === 'SignatureDoesNotMatch') {
        status.error = 'Invalid AWS Secret Access Key. Please check your credentials.'
      } else if (error.name === 'CredentialsError') {
        status.error = 'AWS credentials not configured properly. Please check your .env file.'
      } else if (error.code === 'NetworkingError' || error.message?.includes('network')) {
        status.error = 'Network error - check internet connection and AWS service availability.'
      } else {
        status.error = `Connection failed: ${error.message || error.name || 'Unknown error'}`
      }
      
      return status
    }
  }

  async getLatestDisasterData(): Promise<TwitterDisasterData[]> {
    try {
      console.log('🔍 Fetching latest disaster data from S3...')
      
      // List objects to get the latest files
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        MaxKeys: 20, // Get more files to ensure we have recent data
        // Sort by last modified (most recent first)
        // Note: S3 doesn't sort by default, we'll sort in code
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
