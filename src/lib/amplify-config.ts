import { Amplify } from 'aws-amplify'
import { logAmazonQDebugInfo } from './debug-cognito'

// Debug function to check Amplify configuration
export function checkAmplifyConfig() {
  console.log('=== AMPLIFY CONFIGURATION CHECK ===')
  console.log('Environment variables:')
  console.log('VITE_AWS_REGION:', import.meta.env.VITE_AWS_REGION)
  console.log('VITE_AWS_USER_POOL_ID:', import.meta.env.VITE_AWS_USER_POOL_ID)
  console.log('VITE_AWS_USER_POOL_WEB_CLIENT_ID:', import.meta.env.VITE_AWS_USER_POOL_WEB_CLIENT_ID)
  
  // Check if all required values are present
  const missingVars = []
  if (!import.meta.env.VITE_AWS_REGION) missingVars.push('VITE_AWS_REGION')
  if (!import.meta.env.VITE_AWS_USER_POOL_ID) missingVars.push('VITE_AWS_USER_POOL_ID')
  if (!import.meta.env.VITE_AWS_USER_POOL_WEB_CLIENT_ID) missingVars.push('VITE_AWS_USER_POOL_WEB_CLIENT_ID')
  
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars)
    console.error('Make sure you have a .env file with all required variables')
    return false
  }
  
  const config = {
    Auth: {
      Cognito: {
        region: import.meta.env.VITE_AWS_REGION,
        userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_WEB_CLIENT_ID,
      }
    }
  }
  
  console.log('Amplify config:', JSON.stringify(config, null, 2))
  
  try {
    Amplify.configure(config)
    console.log('✅ Amplify configured successfully')
    console.log('✅ User Pool ID:', config.Auth.Cognito.userPoolId)
    console.log('✅ Client ID:', config.Auth.Cognito.userPoolClientId)
    console.log('✅ Region:', config.Auth.Cognito.region)
    
    // Log Amazon Q debugging info
    logAmazonQDebugInfo()
    
    return true
  } catch (error) {
    console.error('❌ Error configuring Amplify:', error)
    return false
  }
}

// Configure Amplify with the provided credentials
const amplifyConfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || 'us-east-1_mQXE1rNhN',
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_WEB_CLIENT_ID || '48j09hosl96q625062096lasco',
    }
  }
}

console.log('🔧 Configuring Amplify with:', amplifyConfig)
Amplify.configure(amplifyConfig)

export default amplifyConfig
