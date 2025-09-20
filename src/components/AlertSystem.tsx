import React, { useState, useEffect } from 'react'
import { AlertTriangle, MapPin, Clock, Users, Phone, Mail, MessageSquare, Filter, Search, Plus, Eye, Edit, Trash2, Flame, Mountain, Waves, Zap } from 'lucide-react'
import { googleMapsService } from '../utils/googleMaps'
import GoogleMap from './GoogleMap'

interface Alert {
  id: string;
  type: 'Flood' | 'Landslide' | 'Wildfire' | 'Earthquake';
  location: string;
  coordinates: { lat: number; lng: number };
  severity: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Resolved' | 'Investigating';
  description: string;
  reportedBy: string;
  timeReported: string;
  affectedPeople: number;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

const AlertSystem = () => {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [mapMarkers, setMapMarkers] = useState<Array<{
    position: { lat: number; lng: number };
    title: string;
    icon?: string;
    infoWindow?: string;
  }>>([])

  // Sample alerts data with real Malaysian locations
  const sampleAlerts: Alert[] = [
    {
      id: '1',
      type: 'Flood',
      location: 'Kuala Lumpur City Center',
      coordinates: { lat: 3.1478, lng: 101.6953 },
      severity: 'High',
      status: 'Active',
      description: 'Severe flooding in KLCC area due to heavy rainfall. Multiple buildings affected.',
      reportedBy: 'Emergency Response Team KL',
      timeReported: '2024-01-15T10:30:00Z',
      affectedPeople: 150,
      contactInfo: {
        phone: '+60123456789',
        email: 'emergency@kl.gov.my'
      }
    },
    {
      id: '2',
      type: 'Landslide',
      location: 'Cameron Highlands, Pahang',
      coordinates: { lat: 4.4698, lng: 101.3779 },
      severity: 'Medium',
      status: 'Investigating',
      description: 'Slope instability detected on main road to Tanah Rata. Road partially blocked.',
      reportedBy: 'Public Works Department',
      timeReported: '2024-01-15T09:15:00Z',
      affectedPeople: 50,
      contactInfo: {
        phone: '+60198765432'
      }
    },
    {
      id: '3',
      type: 'Wildfire',
      location: 'Taman Negara, Pahang',
      coordinates: { lat: 4.2105, lng: 101.9758 },
      severity: 'High',
      status: 'Active',
      description: 'Forest fire spreading rapidly in national park. Evacuation in progress.',
      reportedBy: 'Forest Department Malaysia',
      timeReported: '2024-01-15T08:45:00Z',
      affectedPeople: 200,
      contactInfo: {
        phone: '+60187654321',
        email: 'forest@gov.my'
      }
    },
    {
      id: '4',
      type: 'Earthquake',
      location: 'Kota Kinabalu, Sabah',
      coordinates: { lat: 5.9804, lng: 116.0735 },
      severity: 'Low',
      status: 'Resolved',
      description: 'Minor earthquake magnitude 3.2 near Mount Kinabalu. No damage reported.',
      reportedBy: 'Malaysian Meteorological Department',
      timeReported: '2024-01-15T07:20:00Z',
      affectedPeople: 0
    },
    {
      id: '5',
      type: 'Flood',
      location: 'George Town, Penang',
      coordinates: { lat: 5.4164, lng: 100.3327 },
      severity: 'Medium',
      status: 'Active',
      description: 'Coastal flooding due to high tide and storm surge. Several streets affected.',
      reportedBy: 'Penang State Government',
      timeReported: '2024-01-15T11:00:00Z',
      affectedPeople: 80,
      contactInfo: {
        phone: '+60145678901',
        email: 'disaster@penang.gov.my'
      }
    }
  ]

  useEffect(() => {
    // Initialize with sample data
    setAlerts(sampleAlerts)
    setFilteredAlerts(sampleAlerts)
    
    // Initialize Google Maps
    googleMapsService.initialize()
    
    // Create map markers
    updateMapMarkers(sampleAlerts)
  }, [])

  useEffect(() => {
    // Filter alerts based on search and filters
    let filtered = alerts.filter(alert => {
      const matchesSearch = alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alert.type.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = filterType === 'all' || alert.type === filterType
      const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity
      
      return matchesSearch && matchesType && matchesSeverity
    })
    
    setFilteredAlerts(filtered)
    updateMapMarkers(filtered)
  }, [searchTerm, filterType, filterSeverity, alerts])

  const updateMapMarkers = (alertsToShow: Alert[]) => {
    const markers = alertsToShow.map(alert => ({
      position: alert.coordinates,
      title: `${alert.type} - ${alert.location}`,
      icon: getMarkerIcon(alert.type, alert.severity),
      infoWindow: `
        <div style="color: #000; font-family: Arial, sans-serif; max-width: 300px;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937;">${alert.type}</h3>
          <p style="margin: 0 0 4px 0; font-weight: bold;">${alert.location}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px;">${alert.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="background: ${getSeverityColor(alert.severity)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${alert.severity}</span>
            <span style="background: ${getStatusColor(alert.status)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${alert.status}</span>
          </div>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">Affected: ${alert.affectedPeople} people</p>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">Reported: ${new Date(alert.timeReported).toLocaleString()}</p>
        </div>
      `
    }))
    
    setMapMarkers(markers)
  }

  const getDisasterIcon = (type: string) => {
    switch (type) {
      case 'Flood': return Waves
      case 'Landslide': return Mountain
      case 'Wildfire': return Flame
      case 'Earthquake': return Zap
      default: return AlertTriangle
    }
  }

  const getMarkerIcon = (type: string, severity: string) => {
    const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/'
    switch (severity) {
      case 'High': return baseUrl + 'red-dot.png'
      case 'Medium': return baseUrl + 'yellow-dot.png'
      case 'Low': return baseUrl + 'green-dot.png'
      default: return baseUrl + 'blue-dot.png'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return '#ef4444'
      case 'Medium': return '#f59e0b'
      case 'Low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#ef4444'
      case 'Investigating': return '#f59e0b'
      case 'Resolved': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Investigating': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Resolved': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  return (
    <section className="py-20 relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <img 
                src="https://cdn.chatandbuild.com/users/688b11cfde83ff4065553da3/cloud-cuties-1-1758355206652-870178326-1758355206651-969070550.png" 
                alt="Rescuties Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-4xl font-bold text-white">Alert Management System</h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive disaster alert management with real-time Google Maps integration and emergency response coordination
          </p>
        </div>

        {/* Controls */}
        <div className="gradient-card rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="Flood">Flood</option>
                <option value="Landslide">Landslide</option>
                <option value="Wildfire">Wildfire</option>
                <option value="Earthquake">Earthquake</option>
              </select>
              
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Severities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary px-6 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Alert</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Alerts List */}
          <div className="lg:col-span-2 space-y-6">
            {filteredAlerts.length === 0 ? (
              <div className="gradient-card rounded-xl p-12 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Alerts Found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const DisasterIcon = getDisasterIcon(alert.type)
                
                return (
                  <div key={alert.id} className="gradient-card rounded-xl p-6 hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                          <DisasterIcon className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{alert.type}</h3>
                          <div className="flex items-center space-x-2 text-gray-400 mt-1">
                            <MapPin className="h-4 w-4 text-blue-400" />
                            <span>{alert.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityBadgeClass(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4">{alert.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="h-4 w-4 text-orange-400" />
                        <span className="text-sm">{alert.affectedPeople} people affected</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Clock className="h-4 w-4 text-green-400" />
                        <span className="text-sm">{formatTimeAgo(alert.timeReported)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                      <div className="text-sm text-gray-400">
                        Reported by: <span className="text-white">{alert.reportedBy}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {alert.contactInfo?.phone && (
                          <button className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                            <Phone className="h-4 w-4" />
                          </button>
                        )}
                        {alert.contactInfo?.email && (
                          <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                            <Mail className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedAlert(alert)}
                          className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Map and Stats */}
          <div className="space-y-6">
            {/* Live Map */}
            <div className="gradient-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Live Alert Map</h3>
              <div className="bg-gray-800 rounded-lg h-64 overflow-hidden">
                <GoogleMap
                  center={{ lat: 4.2105, lng: 108.9758 }}
                  zoom={6}
                  markers={mapMarkers}
                  className="w-full h-full"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-gray-400">High</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-400">Medium</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-400">Low</span>
                  </div>
                </div>
                <span className="text-gray-400">{filteredAlerts.length} alerts</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="gradient-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Alert Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Active</span>
                  <span className="text-red-400 font-semibold">
                    {filteredAlerts.filter(a => a.status === 'Active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Investigating</span>
                  <span className="text-yellow-400 font-semibold">
                    {filteredAlerts.filter(a => a.status === 'Investigating').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Resolved</span>
                  <span className="text-green-400 font-semibold">
                    {filteredAlerts.filter(a => a.status === 'Resolved').length}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                  <span className="text-gray-400">People Affected</span>
                  <span className="text-orange-400 font-semibold">
                    {filteredAlerts.reduce((sum, alert) => sum + alert.affectedPeople, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AlertSystem
