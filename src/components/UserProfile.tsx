import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Edit3, Save, X, Bell, Shield, Globe } from 'lucide-react'

interface UserData {
  name: string
  email: string
  phone: string
  location: string
  emergencyContact: string
  notifications: boolean
  language: string
}

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    emergencyContact: '',
    notifications: true,
    language: 'English'
  })

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('rescuties-user-profile')
    if (savedData) {
      setUserData(JSON.parse(savedData))
    }
  }, [])

  // Save user data to localStorage
  const saveUserData = () => {
    localStorage.setItem('rescuties-user-profile', JSON.stringify(userData))
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof UserData, value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const cancelEdit = () => {
    // Reload data from localStorage to cancel changes
    const savedData = localStorage.getItem('rescuties-user-profile')
    if (savedData) {
      setUserData(JSON.parse(savedData))
    }
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl brand-font bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            User Profile
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Manage your personal information and preferences for disaster alerts and emergency response.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="gradient-card rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <User className="h-6 w-6 text-blue-400" />
                  <span>Personal Information</span>
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={saveUserData}
                      className="btn-primary px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="btn-secondary px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-800/30 border border-gray-600/30 rounded-lg text-white">
                      {userData.name || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter your email address"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-800/30 border border-gray-600/30 rounded-lg text-white">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      {userData.email || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-800/30 border border-gray-600/30 rounded-lg text-white">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      {userData.phone || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={userData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter your location"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-800/30 border border-gray-600/30 rounded-lg text-white">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      {userData.location || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Emergency Contact
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={userData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter emergency contact"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-800/30 border border-gray-600/30 rounded-lg text-white">
                      <Shield className="h-5 w-5 text-gray-400 mr-3" />
                      {userData.emergencyContact || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="space-y-6">
            {/* Preferences */}
            <div className="gradient-card rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-400" />
                <span>Preferences</span>
              </h3>

              <div className="space-y-4">
                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Push Notifications</p>
                    <p className="text-gray-400 text-sm">Receive disaster alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userData.notifications}
                      onChange={(e) => handleInputChange('notifications', e.target.checked)}
                      className="sr-only peer"
                      disabled={!isEditing}
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Language
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        value={userData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      >
                        <option value="English">English</option>
                        <option value="Bahasa Malaysia">Bahasa Malaysia</option>
                        <option value="中文">中文</option>
                        <option value="தமிழ்">தமிழ்</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-800/30 border border-gray-600/30 rounded-lg text-white">
                      <Globe className="h-5 w-5 text-gray-400 mr-3" />
                      {userData.language}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="gradient-card rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Profile Completion</span>
                  <span className="text-blue-400 font-medium">
                    {Math.round(
                      (Object.values(userData).filter(value => 
                        typeof value === 'string' ? value.trim() !== '' : value !== null
                      ).length / Object.keys(userData).length) * 100
                    )}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Data Storage</span>
                  <span className="text-green-400 font-medium">Local Only</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Privacy Level</span>
                  <span className="text-blue-400 font-medium">High</span>
                </div>
              </div>
            </div>

            {/* Data Notice */}
            <div className="gradient-card rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium mb-2">Privacy Notice</h4>
                  <p className="text-gray-400 text-sm">
                    Your profile data is stored locally on your device only. No personal information is transmitted to external servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
