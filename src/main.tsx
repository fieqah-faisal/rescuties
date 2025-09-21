import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import App from './App.tsx'
import './index.css'

// Configure Amplify (you'll need to add your actual config)
const amplifyConfig = {
  Auth: {
    Cognito: {
      region: 'us-east-1', // Replace with your region
      userPoolId: 'us-east-1_mQXE1rNhN', // Replace with your User Pool ID
      userPoolClientId: '48j09hosl96q625062096lasco', // Replace with your App Client ID
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        requireLowercase: false,
        requireUppercase: false,
        requireNumbers: false,
        requireSpecialCharacters: false,
      },
    },
  },
}

// Only configure Amplify if config is provided
// This prevents errors during development
if (amplifyConfig.Auth.Cognito.userPoolId !== 'us-east-1_XXXXXXXXX') {
  Amplify.configure(amplifyConfig)
} else {
  console.warn('⚠️ Amplify configuration not set. Please update src/main.tsx with your Cognito details.')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
