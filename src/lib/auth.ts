import { 
  signUp, 
  confirmSignUp, 
  resendSignUpCode,
  signIn, 
  signOut, 
  getCurrentUser,
  fetchAuthSession,
  resetPassword,
  confirmResetPassword
} from 'aws-amplify/auth'

export interface AuthUser {
  username: string
  userId: string
  signInDetails?: any
}

export interface SignUpResult {
  isSignUpComplete: boolean
  userId?: string
  nextStep: {
    signUpStep: string
    additionalInfo?: any
  }
}

// Register (Sign Up) - Following Amazon Q's debugging recommendations
export async function register(username: string, password: string, email: string, fullName?: string, phoneNumber?: string): Promise<SignUpResult> {
  try {
    console.log('=== AMAZON Q DEBUGGING - STEP 6: DETAILED ERROR LOGGING ===')
    console.log('Registration attempt with:')
    console.log('- Username:', username)
    console.log('- Username length:', username.length)
    console.log('- Username contains @:', username.includes('@'))
    console.log('- Email:', email)
    console.log('- Email format valid:', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    console.log('- Full Name:', fullName)
    console.log('- Phone Number:', phoneNumber)
    console.log('- Phone starts with +:', phoneNumber?.startsWith('+'))
    console.log('- Password length:', password.length)
    
    // STEP 2: Validate phone number format (must include country code)
    if (phoneNumber && !phoneNumber.startsWith('+')) {
      throw new Error('Phone number must include country code (e.g., +60123456789)')
    }
    
    // STEP 2: Validate username format (cannot be email)
    if (username.includes('@')) {
      throw new Error('Username cannot be an email address. Please use a unique username.')
    }
    
    // STEP 2: Use exact attribute names as per Amazon Q recommendations
    const userAttributes: Record<string, string> = {
      email: email.trim(),
      phone_number: phoneNumber?.trim() || '+60123456789', // Exact name: phone_number (not phoneNumber)
      name: fullName?.trim() || `${username} User`, // Exact name: name (not fullName)
    }

    const signUpParams = {
      username: username.trim(),
      password: password,
      options: {
        userAttributes: userAttributes,
      },
    }
    
    console.log('=== SIGN UP PARAMETERS ===')
    console.log('SignUp params:', JSON.stringify(signUpParams, null, 2))
    console.log('Attribute names used:')
    console.log('- email ✓')
    console.log('- phone_number ✓ (not phoneNumber)')
    console.log('- name ✓ (not fullName)')
    
    const result = await signUp(signUpParams)
    
    console.log('=== SIGN UP SUCCESS ===')
    console.log('SignUp result:', JSON.stringify(result, null, 2))
    
    return {
      isSignUpComplete: result.isSignUpComplete,
      userId: result.userId,
      nextStep: result.nextStep
    }
  } catch (error: any) {
    console.error('=== AMAZON Q DEBUGGING - DETAILED ERROR ANALYSIS ===')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    console.error('Full error object:', error)
    
    // Amazon Q's specific error handling
    if (error.message?.includes('unauthorized attribute')) {
      console.error('❌ UNAUTHORIZED ATTRIBUTE ERROR DETECTED')
      console.error('This means your app client lacks write permissions for one or more attributes.')
      console.error('Check AWS Console: Cognito → User Pool → App clients → Your App Client → Attribute permissions')
      console.error('Required write permissions: email, phone_number, name')
      throw new Error('App client missing write permissions. Check Cognito Console → App clients → Attribute permissions')
    }
    
    if (error.name === 'InvalidParameterException') {
      if (error.message.includes('phone_number')) {
        console.error('❌ PHONE NUMBER FORMAT ERROR')
        console.error('Phone number must start with country code: +60123456789')
        throw new Error('Phone number must include country code (e.g., +60123456789)')
      } else if (error.message.includes('username')) {
        console.error('❌ USERNAME FORMAT ERROR')
        console.error('Username cannot contain @ symbol')
        throw new Error('Username format is invalid. Use only letters, numbers, and underscores.')
      } else if (error.message.includes('email')) {
        console.error('❌ EMAIL FORMAT ERROR')
        throw new Error('Email format is invalid.')
      } else if (error.message.includes('password')) {
        console.error('❌ PASSWORD FORMAT ERROR')
        throw new Error('Password does not meet requirements.')
      }
    }
    
    // Re-throw with original error for other cases
    throw error
  }
}

// STEP 3: Test with minimal attributes function
export async function registerMinimal(username: string, password: string, email: string): Promise<SignUpResult> {
  try {
    console.log('=== AMAZON Q STEP 3: TESTING WITH MINIMAL ATTRIBUTES ===')
    console.log('Testing with only required attributes:')
    console.log('- Username:', username)
    console.log('- Email:', email)
    
    const signUpParams = {
      username: username.trim(),
      password: password,
      options: {
        userAttributes: {
          email: email.trim(), // Only email attribute
        },
      },
    }
    
    console.log('Minimal signup params:', JSON.stringify(signUpParams, null, 2))
    
    const result = await signUp(signUpParams)
    
    console.log('✅ MINIMAL SIGNUP SUCCESS')
    console.log('Result:', JSON.stringify(result, null, 2))
    
    return {
      isSignUpComplete: result.isSignUpComplete,
      userId: result.userId,
      nextStep: result.nextStep
    }
  } catch (error: any) {
    console.error('❌ MINIMAL SIGNUP FAILED')
    console.error('Error:', error)
    throw error
  }
}

// Confirm Sign Up (for email verification)
export async function confirmSignUpCode(username: string, code: string): Promise<any> {
  try {
    console.log('=== CONFIRMATION DEBUG ===')
    console.log('Username:', username)
    console.log('Code:', code)
    
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: username.trim(),
      confirmationCode: code.trim(),
    })
    
    console.log('Confirmation success:', { isSignUpComplete, nextStep })
    return { isSignUpComplete, nextStep }
  } catch (error) {
    console.error('Error confirming sign up:', error)
    throw error
  }
}

// Resend confirmation code
export async function resendConfirmationCode(username: string): Promise<any> {
  try {
    const { destination, deliveryMedium } = await resendSignUpCode({
      username: username.trim(),
    })
    console.log('Confirmation code resent:', { destination, deliveryMedium })
    return { destination, deliveryMedium }
  } catch (error) {
    console.error('Error resending confirmation code:', error)
    throw error
  }
}

// Login (Sign In) - Can use either username or email depending on Cognito config
export async function login(username: string, password: string): Promise<AuthUser> {
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: username.trim(),
      password,
    })
    
    if (isSignedIn) {
      const user = await getCurrentUser()
      console.log('Login success:', user)
      return {
        username: user.username,
        userId: user.userId,
        signInDetails: user.signInDetails
      }
    } else {
      throw new Error('Sign in not completed')
    }
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

// Get current authenticated user
export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  try {
    const user = await getCurrentUser()
    return {
      username: user.username,
      userId: user.userId,
      signInDetails: user.signInDetails
    }
  } catch (error) {
    console.log('No authenticated user')
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await fetchAuthSession()
    return !!session.tokens?.accessToken
  } catch (error) {
    return false
  }
}

// Logout
export async function logout(): Promise<void> {
  try {
    await signOut()
    console.log('Logged out')
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

// Forgot Password
export async function forgotPassword(username: string): Promise<any> {
  try {
    const output = await resetPassword({ username: username.trim() })
    console.log('Forgot password initiated:', output)
    return output
  } catch (error) {
    console.error('Error initiating forgot password:', error)
    throw error
  }
}

// Confirm forgot password
export async function forgotPasswordSubmit(username: string, code: string, newPassword: string): Promise<any> {
  try {
    await confirmResetPassword({
      username: username.trim(),
      confirmationCode: code.trim(),
      newPassword,
    })
    console.log('Password reset success')
    return { success: true }
  } catch (error) {
    console.error('Error resetting password:', error)
    throw error
  }
}
