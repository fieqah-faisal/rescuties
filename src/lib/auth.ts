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

// Register (Sign Up) - FIXED: Username and email are now separate
export async function register(username: string, password: string, email: string): Promise<SignUpResult> {
  try {
    // CRITICAL: Username must NOT be email format, email goes in attributes
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: username, // Non-email username (e.g., "john123", "user456")
      password: password,
      options: {
        userAttributes: {
          email: email, // Email goes here in attributes
        },
      },
    })
    console.log('Sign-up success:', { isSignUpComplete, userId, nextStep })
    return { isSignUpComplete, userId, nextStep }
  } catch (error) {
    console.error('Error signing up:', error)
    throw error
  }
}

// Confirm Sign Up (for email verification)
export async function confirmSignUpCode(username: string, code: string): Promise<any> {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username, // Use the same username (not email) that was used during signup
      confirmationCode: code,
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
      username, // Use the same username (not email) that was used during signup
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
      username, // This can be username or email depending on your Cognito setup
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
    const output = await resetPassword({ username })
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
      username,
      confirmationCode: code,
      newPassword,
    })
    console.log('Password reset success')
    return { success: true }
  } catch (error) {
    console.error('Error resetting password:', error)
    throw error
  }
}
