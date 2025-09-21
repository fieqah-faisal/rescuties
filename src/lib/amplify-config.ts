// AWS Configuration for Rescuties Platform
// This file handles AWS service configuration without Amplify

export interface AWSConfig {
  region: string
  userPoolId?: string
  userPoolClientId?: string
}

// Debug function to check AWS configuration
export function checkAWSConfig() {
  console.log('=== AWS CONFIGURATION CHECK ===')
  console.log('Environment variables:')
  console.log('VITE_AWS_REGION:', import.meta.env.VITE_AWS_REGION)
  console.log('VITE_AWS_USER_POOL_ID:', import.meta.env.VITE_AWS_USER_POOL_ID)
  console.log('VITE_AWS_USER_POOL_WEB_CLIENT_ID:', import.meta.env.VITE_AWS_USER_POOL_WEB_CLIENT_ID)
  console.log('VITE_SNS_TOPIC_ARN:', import.meta.env.VITE_SNS_TOPIC_ARN)
  
  // Check if all required values are present
  const missingVars = []
  if (!import.meta.env.VITE_AWS_REGION) missingVars.push('VITE_AWS_REGION')
  if (!import.meta.env.VITE_SNS_TOPIC_ARN) missingVars.push('VITE_SNS_TOPIC_ARN')
  
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars)
    console.error('Make sure you have a .env file with all required variables')
    return false
  }
  
  const config: AWSConfig = {
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
    userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_WEB_CLIENT_ID,
  }
  
  console.log('AWS config:', JSON.stringify(config, null, 2))
  console.log('✅ AWS configuration loaded successfully')
  console.log('✅ Region:', config.region)
  console.log('✅ SNS Topic ARN:', import.meta.env.VITE_SNS_TOPIC_ARN)
  
  return true
}

// Export alias for backward compatibility
export const checkAmplifyConfig = checkAWSConfig

// AWS configuration object
const awsConfig: AWSConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || 'us-east-1_mQXE1rNhN',
  userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_WEB_CLIENT_ID || '48j09hosl96q625062096lasco',
}

console.log('🔧 AWS Configuration loaded:', awsConfig)

export default awsConfig
