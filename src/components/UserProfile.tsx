import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Shield, Settings, Camera, Save } from 'lucide-react'

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'Ahmad Rahman',
    email: 'ahmad.rahman@rescuties.my',
    phone: '+60 12-345 6789',
    location: 'Kuala Lumpur, Malaysia',
    role: 'Emergency Response Coordinator',
    department: 'Disaster Management Unit',
    joinDate: 'January 2023'
  })

  const handleSave = () => {
    // Placeholder for save functionality
    console.log('Profile saved:', profileData)
    setIsEditing(false)
    // Future implementation: API call to update profile
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <section className="pt-20 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">User Profile</h1>
          <p className="text-xl text-gray-300">Manage your account settings and personal information</p>
        </div>

        <div className="gradient-card rounded-2xl p-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                <User className="h-16 w-16 text-white" />
              </div>
              <button className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors">
                <Camera className="h-5 w-5 text-white" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">{profileData.name}</h2>
              <p className="text-blue-400 text-lg mb-2">{profileData.role}</p>
              <p className="text-gray-400 mb-4">{profileData.department}</p>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Member since {profileData.joinDate}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn-primary px-6 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button 
                    onClick={handleSave}
                    className="btn-primary px-6 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:border-blue-400 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30">
                      <User className="h-5 w-5 text-blue-400" />
                      <span className="text-white">{profileData.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:border-blue-400 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30">
                      <Mail className="h-5 w-5 text-blue-400" />
                      <span className="text-white">{profileData.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:border-blue-400 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30">
                      <Phone className="h-5 w-5 text-blue-400" />
                      <span className="text-white">{profileData.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:border-blue-400 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      <span className="text-white">{profileData.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Professional Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Role</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:border-blue-400 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30">
                      <Shield className="h-5 w-5 text-blue-400" />
                      <span className="text-white">{profileData.role}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:border-blue-400 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30">
                      <Settings className="h-5 w-5 text-blue-400" />
                      <span className="text-white">{profileData.department}</span>
                    </div>
                  )}
                </div>

                {/* Activity Stats */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Activity Overview</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">47</div>
                      <div className="text-gray-400 text-sm">Alerts Handled</div>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">23</div>
                      <div className="text-gray-400 text-sm">Routes Optimized</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserProfile
