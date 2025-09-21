import { useState, useEffect } from 'react'

export interface DisasterData {
  id: string
  disaster_type: 'flood' | 'landslide' | 'earthquake' | 'storm'
  location: string
  coordinates: {
    lat: number
    lng: number
  }
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  description: string
  source: string
  affected_areas?: string[]
  casualties?: number
  status: 'active' | 'resolved' | 'monitoring'
}

export const useDisasterData = () => {
  const [data, setData] = useState<DisasterData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock data for now to prevent crashes
      const mockData: DisasterData[] = [
        {
          id: '1',
          disaster_type: 'flood',
          location: 'Kuala Lumpur',
          coordinates: { lat: 3.139, lng: 101.6869 },
          severity: 'high',
          timestamp: new Date().toISOString(),
          description: 'Heavy rainfall causing flash floods in city center',
          source: 'Emergency Services',
          status: 'active'
        },
        {
          id: '2',
          disaster_type: 'landslide',
          location: 'Cameron Highlands',
          coordinates: { lat: 4.4696, lng: 101.3778 },
          severity: 'medium',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          description: 'Landslide risk due to heavy rainfall',
          source: 'Weather Station',
          status: 'monitoring'
        }
      ]
      
      setData(mockData)
    } catch (err) {
      console.error('Error fetching disaster data:', err)
      setError('Failed to fetch disaster data')
      setData([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return { data, loading, error, refetch: fetchData }
}
