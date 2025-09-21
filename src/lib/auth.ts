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

// Register (Sign Up) - Enhanced with detailed logging
export async function register(username: string, password: string, email: string): Promise<SignUpResult> {
  try {
    console.log('=== REGISTRATION DEBUG ===')
    console.log('Username:', username)
    console.log('Email:', email)
    console.log('Password length:', password.length)
    console.log('Username contains @:', username.includes('@'))
    
    // Validate inputs before sending to Cognito
    if (!username || username.trim().length === 0) {
      throw new Error('Username is required')
    }
    
    if (username.includes('@')) {
      throw new Error('Username cannot contain @ symbol')
    }
    
    if (!email || !email.includes('@')) {
      throw new Error('Valid email is required')
    }
    
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }

    const signUpParams = {
      username: username.trim(),
      password: password,
      options: {
        userAttributes: {
          email: email.trim(),
        },
      },
    }
    
    console.log('SignUp params:', JSON.stringify(signUpParams, null, 2))
    
    const result = await signUp(signUpParams)
    
    console.log('SignUp result:', JSON.stringify(result, null, 2))
    
    return {
      isSignUpComplete: result.isSignUpComplete,
      userId: result.userId,
      nextStep: result.nextStep
    }
  } catch (error: any) {
    console.error('=== REGISTRATION ERROR ===')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Full error:', error)
    
    // Re-throw with more specific error messages
    if (error.name === 'InvalidParameterException') {
      if (error.message.includes('username')) {
        throw new Error('Username format is invalid. Use only letters, numbers, and underscores.')
      } else if (error.message.includes('email')) {
        throw new Error('Email format is invalid.')
      } else if (error.message.includes('password')) {
        throw new Error('Password does not meet requirements.')
      }
    }
    
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
