import { Amplify } from 'aws-amplify'

// Debug function to check Amplify configuration
export function checkAmplifyConfig() {
  console.log('=== AMPLIFY CONFIGURATION CHECK ===')
  console.log('Environment variables:')
  console.log('VITE_AWS_REGION:', import.meta.env.VITE_AWS_REGION)
  console.log('VITE_AWS_USER_POOL_ID:', import.meta.env.VITE_AWS_USER_POOL_ID)
  console.log('VITE_AWS_USER_POOL_WEB_CLIENT_ID:', import.meta.env.VITE_AWS_USER_POOL_WEB_CLIENT_ID)
  
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
  
  // Check if all required values are present
  const missingVars = []
  if (!import.meta.env.VITE_AWS_REGION) missingVars.push('VITE_AWS_REGION')
  if (!import.meta.env.VITE_AWS_USER_POOL_ID) missingVars.push('VITE_AWS_USER_POOL_ID')
  if (!import.meta.env.VITE_AWS_USER_POOL_WEB_CLIENT_ID) missingVars.push('VITE_AWS_USER_POOL_WEB_CLIENT_ID')
  
  if (missingVars.length > 0) {
    console.error('Missing environment variables:', missingVars)
    return false
  }
  
  try {
    Amplify.configure(config)
    console.log('✅ Amplify configured successfully')
    return true
  } catch (error) {
    console.error('❌ Error configuring Amplify:', error)
    return false
  }
}

// Configure Amplify
const amplifyConfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_WEB_CLIENT_ID,
    }
  }
}

Amplify.configure(amplifyConfig)

export default amplifyConfig
