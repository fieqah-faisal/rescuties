// Amazon Q's Step 1: Check App Client Configuration
// This file contains the CLI commands and debugging utilities recommended by Amazon Q

export const COGNITO_DEBUG_INFO = {
  userPoolId: 'us-east-1_mQXE1rNhN',
  clientId: '48j09hosl96q625062096lasco',
  region: 'us-east-1'
}

// Amazon Q Step 1: CLI Command to check app client configuration
export const CLI_COMMANDS = {
  describeUserPoolClient: `aws cognito-idp describe-user-pool-client \\
  --user-pool-id ${COGNITO_DEBUG_INFO.userPoolId} \\
  --client-id ${COGNITO_DEBUG_INFO.clientId} \\
  --region ${COGNITO_DEBUG_INFO.region}`,

  // Amazon Q Step 5: Update app client permissions via CLI
  updateAppClientPermissions: `aws cognito-idp update-user-pool-client \\
  --user-pool-id ${COGNITO_DEBUG_INFO.userPoolId} \\
  --client-id ${COGNITO_DEBUG_INFO.clientId} \\
  --write-attributes "address" "birthdate" "email" "family_name" "gender" "given_name" "locale" "middle_name" "name" "nickname" "phone_number" "picture" "preferred_username" "profile" "updated_at" "website" "zoneinfo" \\
  --region ${COGNITO_DEBUG_INFO.region}`
}

// Amazon Q's Quick Checklist
export const AMAZON_Q_CHECKLIST = {
  phoneNumberFormat: {
    wrong: 'phone_number: "1234567890"',
    correct: 'phone_number: "+11234567890"',
    description: 'Phone number must start with + and include country code'
  },
  attributeNames: {
    wrong: ['phoneNumber', 'fullName', 'firstName', 'lastName'],
    correct: ['phone_number', 'name', 'given_name', 'family_name'],
    description: 'Use exact Cognito attribute names'
  },
  usernameFormat: {
    wrong: 'user@example.com',
    correct: 'user123',
    description: 'Username cannot be email format'
  },
  requiredWritePermissions: [
    'email',
    'phone_number', 
    'name',
    'given_name',
    'family_name'
  ]
}

// Debug function to log all Amazon Q recommendations
export function logAmazonQDebugInfo() {
  console.log('=== AMAZON Q DEBUGGING GUIDE ===')
  console.log('User Pool ID:', COGNITO_DEBUG_INFO.userPoolId)
  console.log('Client ID:', COGNITO_DEBUG_INFO.clientId)
  console.log('Region:', COGNITO_DEBUG_INFO.region)
  console.log('')
  console.log('Step 1: Check app client configuration:')
  console.log(CLI_COMMANDS.describeUserPoolClient)
  console.log('')
  console.log('Step 5: Update app client permissions:')
  console.log(CLI_COMMANDS.updateAppClientPermissions)
  console.log('')
  console.log('Quick Checklist:')
  console.log('✅ Phone format:', AMAZON_Q_CHECKLIST.phoneNumberFormat.correct)
  console.log('✅ Attribute names:', AMAZON_Q_CHECKLIST.attributeNames.correct)
  console.log('✅ Username format:', AMAZON_Q_CHECKLIST.usernameFormat.correct)
  console.log('✅ Required permissions:', AMAZON_Q_CHECKLIST.requiredWritePermissions)
}

// Call this function to see all debug info
if (typeof window !== 'undefined') {
  (window as any).logAmazonQDebugInfo = logAmazonQDebugInfo
}
