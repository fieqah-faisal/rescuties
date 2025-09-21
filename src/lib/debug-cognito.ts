// Debug utilities for AWS Cognito and other AWS services
// This file provides debugging information for AWS service integration

export function logAmazonQDebugInfo() {
  console.log('=== AMAZON Q DEBUG INFO ===')
  console.log('AWS SDK Integration Status:')
  console.log('- SNS Client: Available')
  console.log('- Region:', import.meta.env.VITE_AWS_REGION || 'us-east-1')
  console.log('- SNS Topic ARN:', import.meta.env.VITE_SNS_TOPIC_ARN)
  
  // Check AWS credentials availability
  const hasCredentials = !!(import.meta.env.VITE_AWS_ACCESS_KEY_ID && import.meta.env.VITE_AWS_SECRET_ACCESS_KEY)
  console.log('- AWS Credentials:', hasCredentials ? 'Available' : 'Not configured')
  
  if (!hasCredentials) {
    console.log('📝 To enable full AWS functionality, add these to your .env file:')
    console.log('VITE_AWS_ACCESS_KEY_ID=your-access-key-here')
    console.log('VITE_AWS_SECRET_ACCESS_KEY=your-secret-key-here')
  }
  
  console.log('=== END DEBUG INFO ===')
}

export function debugAWSServices() {
  console.log('🔍 AWS Services Debug Check')
  
  // SNS Configuration
  console.log('SNS Configuration:')
  console.log('- Topic ARN:', import.meta.env.VITE_SNS_TOPIC_ARN)
  console.log('- Region:', import.meta.env.VITE_AWS_REGION)
  
  // Lex Configuration
  console.log('Lex Configuration:')
  console.log('- Bot ID:', import.meta.env.VITE_LEX_BOT_ID)
  console.log('- Bot Alias ID:', import.meta.env.VITE_LEX_BOT_ALIAS_ID)
  console.log('- Locale ID:', import.meta.env.VITE_LEX_LOCALE_ID)
  
  // General AWS Configuration
  console.log('General AWS:')
  console.log('- Region:', import.meta.env.VITE_AWS_REGION)
  console.log('- Access Key ID:', import.meta.env.VITE_AWS_ACCESS_KEY_ID ? 'Set' : 'Not set')
  console.log('- Secret Access Key:', import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set')
}
