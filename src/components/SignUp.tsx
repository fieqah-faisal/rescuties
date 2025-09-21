import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, User } from 'lucide-react'
import { register, confirmSignUpCode, resendConfirmationCode } from '../lib/auth'

const SignUp = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    console.log('=== FORM VALIDATION ===')
    console.log('Form data:', formData)
    
    if (!formData.username.trim()) {
      setError('Username is required')
      return false
    }
    
    // Check if username contains @ symbol (email format)
    if (formData.username.includes('@')) {
      setError('Username cannot be an email address. Please use a unique username.')
      return false
    }
    
    // Username should be at least 3 characters and only contain valid characters
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long')
      return false
    }
    
    // Check for valid username characters (letters, numbers, underscores only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(formData.username)) {
      setError('Username can only contain letters, numbers, and underscores')
      return false
    }
    
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }
    
    // Check password complexity
    const hasUpperCase = /[A-Z]/.test(formData.password)
    const hasLowerCase = /[a-z]/.test(formData.password)
    const hasNumbers = /\d/.test(formData.password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      setError('Password must contain uppercase, lowercase, numbers, and special characters')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    
    console.log('Form validation passed')
    return true
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    console.log('=== SIGNUP ATTEMPT ===')
    console.log('Starting signup process...')
    
    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      console.log('Calling register function...')
      const result = await register(formData.username, formData.password, formData.email)
      console.log('Register result:', result)
      
      if (result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setSuccess('Account created successfully! Please check your email for verification code.')
        setShowConfirmation(true)
      } else {
        console.log('Unexpected signup step:', result.nextStep)
        setError('Unexpected response from server. Please try again.')
      }
    } catch (error: any) {
      console.error('=== SIGNUP ERROR IN COMPONENT ===')
      console.error('Error object:', error)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      
      // Handle specific Cognito errors with better messages
      if (error.name === 'UsernameExistsException') {
        setError('An account with this username already exists. Please choose a different username.')
      } else if (error.name === 'InvalidPasswordException') {
        setError('Password does not meet requirements. Please use at least 8 characters with uppercase, lowercase, numbers, and special characters.')
      } else if (error.name === 'InvalidParameterException') {
        setError(`Invalid input: ${error.message}`)
      } else if (error.name === 'AliasExistsException') {
        setError('An account with this email already exists. Please use a different email or try signing in.')
      } else if (error.message) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred during registration. Please check the console for details.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConfirming(true)
    setError('')
    setSuccess('')

    try {
      const result = await confirmSignUpCode(formData.username, confirmationCode)
      if (result.isSignUpComplete) {
        setSuccess('Email verified successfully! You can now sign in.')
        
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (error: any) {
      console.error('Confirmation error:', error)
      
      if (error.name === 'CodeMismatchException') {
        setError('Invalid verification code. Please try again.')
      } else if (error.name === 'ExpiredCodeException') {
        setError('Verification code has expired. Please request a new one.')
      } else if (error.name === 'NotAuthorizedException') {
        setError('User cannot be confirmed. Please contact support.')
      } else {
        setError(error.message || 'An error occurred during verification. Please try again.')
      }
    } finally {
      setIsConfirming(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setError('')
    setSuccess('')

    try {
      await resendConfirmationCode(formData.username)
      setSuccess('Verification code sent! Please check your email.')
    } catch (error: any) {
      console.error('Resend error:', error)
      setError(error.message || 'Failed to resend verification code. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen gradient-bg-1 relative overflow-hidden flex items-center justify-center">
        {/* Floating blue orbs for background decoration */}
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        
        <div className="relative z-10 w-full max-w-md px-4">
          <div className="gradient-card rounded-2xl p-8 animate-fadeInUp">
            {/* Logo and Brand */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img 
                    src="https://cdn.chatandbuild.com/users/688b11cfde83ff4065553da3/cloud-cuties-1-1758355206652-870178326-1758355206651-969070550.png" 
                    alt="Rescuties Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h1 className="text-3xl brand-font bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                Verify Email
              </h1>
              <p className="text-gray-400 text-sm">
                Enter the verification code sent to {formData.email}
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-2 text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>{success}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Confirmation Form */}
            <form onSubmit={handleConfirmSignUp} className="space-y-6">
              <div>
                <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  id="confirmationCode"
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-center text-lg tracking-widest"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                  disabled={isConfirming}
                />
              </div>

              <button
                type="submit"
                disabled={isConfirming}
                className="w-full btn-primary text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConfirming ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify Email'
                )}
              </button>
            </form>

            {/* Resend Code */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm mb-3">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendCode}
                disabled={isResending}
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium text-sm disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>

            {/* Back to Sign Up */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowConfirmation(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
              >
                ← Back to Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg-1 relative overflow-hidden flex items-center justify-center">
      {/* Floating blue orbs for background decoration */}
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="gradient-card rounded-2xl p-8 animate-fadeInUp">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden">
                <img 
                  src="https://cdn.chatandbuild.com/users/688b11cfde83ff4065553da3/cloud-cuties-1-1758355206652-870178326-1758355206651-969070550.png" 
                  alt="Rescuties Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="text-3xl brand-font bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
              Join Rescuties
            </h1>
            <p className="text-gray-400 text-sm">
              Create your disaster response account
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center space-x-2 text-green-400 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>{success}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center space-x-2 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="text-blue-400 text-xs">
              <p><strong>Debug Info:</strong></p>
              <p>Username: {formData.username || 'empty'}</p>
              <p>Email: {formData.email || 'empty'}</p>
              <p>Password length: {formData.password.length}</p>
              <p>Check browser console for detailed logs</p>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="rescuer123"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Letters, numbers, and underscores only. No @ symbol.
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="your.email@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Used for account verification and notifications
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="SecurePass123!"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Must include: uppercase, lowercase, numbers, and special characters
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* AWS Integration Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            Secured by Amazon Cognito • AWS Amplify Ready
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
