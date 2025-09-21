# Rescuties - Disaster Response Platform

## Amazon Cognito Authentication Setup (AWS Amplify v6)

This application uses Amazon Cognito for user authentication with AWS Amplify v6. Follow these steps to configure authentication:

### 1. AWS Cognito Setup

1. **Create a User Pool** in AWS Cognito Console
2. **Configure User Pool Settings**:
   - Username attributes: Email
   - Password policy: Minimum 8 characters
   - MFA: Optional (recommended)
   - Email verification: Required

3. **Create App Client**:
   - Generate app client ID
   - Disable client secret (for web apps)
   - Enable SRP authentication flow

### 2. Environment Configuration

1. Copy `.env.example` to `.env`
2. Update the following variables:
   ```
   VITE_AWS_REGION=your-aws-region
   VITE_AWS_USER_POOL_ID=your-user-pool-id
   VITE_AWS_USER_POOL_WEB_CLIENT_ID=your-app-client-id
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

### 3. Update Amplify Configuration

Update `src/main.tsx` with your actual Cognito configuration:

```typescript
const amplifyConfig = {
  Auth: {
    Cognito: {
      region: 'your-aws-region',
      userPoolId: 'your-user-pool-id',
      userPoolClientId: 'your-app-client-id',
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
```

### 4. AWS Amplify v6 Changes

This project uses the new AWS Amplify v6 authentication API:

- ✅ **New Import Structure**: `import { signUp, signIn, signOut } from 'aws-amplify/auth'`
- ✅ **Updated Configuration**: New Cognito configuration format
- ✅ **Modern API Methods**: Updated function signatures and return types
- ✅ **Enhanced Error Handling**: Improved error types and messages
- ✅ **TypeScript Support**: Full TypeScript compatibility

### 5. Features Implemented

- ✅ **User Registration** with email verification
- ✅ **User Login** with error handling
- ✅ **User Logout** with session cleanup
- ✅ **Protected Routes** requiring authentication
- ✅ **Email Verification** with resend functionality
- ✅ **Form Validation** and loading states
- ✅ **Error Handling** for Cognito-specific errors
- ✅ **Responsive Design** matching app theme

### 6. Authentication Flow

1. **Sign Up**: User creates account → Email verification required
2. **Email Verification**: User enters code → Account activated
3. **Sign In**: User logs in → Redirected to dashboard
4. **Protected Access**: All main features require authentication
5. **Sign Out**: User logs out → Redirected to login

### 7. Development

```bash
npm install
npm run dev
```

### 8. Deployment to AWS Amplify

This app is ready for AWS Amplify deployment with:
- Environment variables configuration
- Cognito authentication integration
- Protected route handling
- Session management

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Authentication**: AWS Cognito, AWS Amplify v6
- **Maps**: Google Maps API
- **Deployment**: AWS Amplify

## Migration Notes

This project has been updated from AWS Amplify v5 to v6:

- **Old**: `import { Auth } from 'aws-amplify'`
- **New**: `import { signUp, signIn, signOut } from 'aws-amplify/auth'`

All authentication functions have been updated to use the new v6 API structure.
