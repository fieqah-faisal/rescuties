import { useState, useEffect } from 'react'
import { s3Service, TwitterDisasterData } from '../utils/s3Service'

export const useDisasterData = (refreshInterval: number = 30000) => {
  const [data, setData] = useState<TwitterDisasterData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const disasterData = await s3Service.getLatestDisasterData()
      setData(disasterData)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch disaster data')
      console.error('Error fetching disaster data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Set up polling for new data
    const interval = setInterval(fetchData, refreshInterval)
    
    return () => clearInterval(interval)
  }, [refreshInterval])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchData
  }
}

export const useHighSeverityAlerts = () => {
  const [alerts, setAlerts] = useState<TwitterDisasterData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHighSeverityAlerts = async () => {
      try {
        const highSeverityData = await s3Service.getHighSeverityAlerts()
        setAlerts(highSeverityData)
      } catch (error) {
        console.error('Error fetching high severity alerts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHighSeverityAlerts()
    
    // Refresh every 15 seconds for high priority alerts
    const interval = setInterval(fetchHighSeverityAlerts, 15000)
    
    return () => clearInterval(interval)
  }, [])

  return { alerts, loading }
}
