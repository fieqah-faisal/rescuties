import React, { useState, useEffect } from 'react'
import { Map, Navigation, Clock, Fuel, AlertTriangle, Route, MapPin, Zap, Search, X, Navigation2 } from 'lucide-react'
import { googleMapsService, PlaceResult, RouteResult } from '../utils/googleMaps'
import GoogleMap from './GoogleMap'

const RouteOptimizer = () => {
  const [selectedRoute, setSelectedRoute] = useState(0)
  const [startingPoint, setStartingPoint] = useState('')
  const [destination, setDestination] = useState('')
  const [startingSuggestions, setStartingSuggestions] = useState<PlaceResult[]>([])
  const [destinationSuggestions, setDestinationSuggestions] = useState<PlaceResult[]>([])
  const [showStartingSuggestions, setShowStartingSuggestions] = useState(false)
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)
  const [routes, setRoutes] = useState<RouteResult[]>([])
  const [loading, setLoading] = useState(false)
  const [mapRoutes, setMapRoutes] = useState<google.maps.DirectionsResult[]>([])
  const [mapMarkers, setMapMarkers] = useState<Array<{
    position: { lat: number; lng: number };
    title: string;
    icon?: string;
    infoWindow?: string;
  }>>([])

  useEffect(() => {
    googleMapsService.initialize();
  }, []);

  const handleStartingPointChange = async (value: string) => {
    setStartingPoint(value)
    if (value.length > 2) {
      try {
        const places = await googleMapsService.searchPlaces(value + ' Malaysia');
        setStartingSuggestions(places);
        setShowStartingSuggestions(true);
      } catch (error) {
        console.error('Error searching places:', error);
        setShowStartingSuggestions(false);
      }
    } else {
      setShowStartingSuggestions(false);
    }
  }

  const handleDestinationChange = async (value: string) => {
    setDestination(value)
    if (value.length > 2) {
      try {
        const places = await googleMapsService.searchPlaces(value + ' Malaysia');
        setDestinationSuggestions(places);
        setShowDestinationSuggestions(true);
      } catch (error) {
        console.error('Error searching places:', error);
        setShowDestinationSuggestions(false);
      }
    } else {
      setShowDestinationSuggestions(false);
    }
  }

  const selectStartingSuggestion = (suggestion: PlaceResult) => {
    setStartingPoint(suggestion.name || suggestion.formatted_address);
    setShowStartingSuggestions(false);
  }

  const selectDestinationSuggestion = (suggestion: PlaceResult) => {
    setDestination(suggestion.name || suggestion.formatted_address);
    setShowDestinationSuggestions(false);
  }

  const handleCalculateRoutes = async () => {
    if (!startingPoint || !destination) {
      alert('Please enter both starting point and destination');
      return;
    }

    setLoading(true);
    try {
      // Get directions from Google Maps
      const directionsService = new google.maps.DirectionsService();
      
      const request: google.maps.DirectionsRequest = {
        origin: startingPoint,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        avoidHighways: false,
        avoidTolls: false
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setMapRoutes([result]);
          
          // Convert to our route format
          const routeResults: RouteResult[] = result.routes.map((route, index) => {
            const leg = route.legs[0];
            return {
              distance: leg.distance?.text || 'Unknown',
              duration: leg.duration?.text || 'Unknown',
              steps: leg.steps || [],
              overview_path: route.overview_path
            };
          });

          setRoutes(routeResults);

          // Set map markers
          const startCoord = result.routes[0].legs[0].start_location;
          const endCoord = result.routes[0].legs[0].end_location;
          
          setMapMarkers([
            {
              position: { lat: startCoord.lat(), lng: startCoord.lng() },
              title: 'Starting Point',
              icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              infoWindow: `<div><strong>Start:</strong><br/>${startingPoint}</div>`
            },
            {
              position: { lat: endCoord.lat(), lng: endCoord.lng() },
              title: 'Destination',
              icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              infoWindow: `<div><strong>Destination:</strong><br/>${destination}</div>`
            }
          ]);
        } else {
          alert('Could not calculate routes. Please check your locations.');
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Error calculating routes:', error);
      alert('Error calculating routes. Please try again.');
      setLoading(false);
    }
  }

  const getRouteStatus = (index: number) => {
    if (index === 0) return { status: 'Recommended', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (index === 1) return { status: 'Alternative', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    return { status: 'Available', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
  }

  const startNavigation = (routeIndex: number) => {
    if (routes[routeIndex]) {
      const googleMapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(startingPoint)}/${encodeURIComponent(destination)}`;
      window.open(googleMapsUrl, '_blank');
    }
  }

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-lg overflow-hidden p-2">
              <img 
                src="https://cdn.chatandbuild.com/users/688b11cfde83ff4065553da3/cloud-cuties-1-1758358732068-611910688-1758358732068-439692214.png" 
                alt="Cloud Cuties Logo" 
                className="w-full h-full object-contain"
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
            <h2 className="text-4xl font-bold text-white">Smart Route Optimizer</h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            AI-powered route planning with real-time Google Maps integration for fastest and safest rescue operations
          </p>
        </div>

        {/* Route Planning Interface */}
        <div className="gradient-card rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Route Planning</h3>
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-gray-400 text-sm mb-2">Starting Point</label>
                  <div className="relative">
                    <div className="flex items-center space-x-2 p-3 bg-gray-800 rounded-lg border border-gray-700 focus-within:border-blue-500 transition-colors">
                      <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={startingPoint}
                        onChange={(e) => handleStartingPointChange(e.target.value)}
                        onFocus={() => startingPoint.length > 2 && setShowStartingSuggestions(true)}
                        className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                        placeholder="Enter starting location..."
                      />
                      {startingPoint && (
                        <button
                          onClick={() => {
                            setStartingPoint('')
                            setShowStartingSuggestions(false)
                          }}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    {showStartingSuggestions && startingSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                        {startingSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => selectStartingSuggestion(suggestion)}
                            className="w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-colors flex items-start space-x-2"
                          >
                            <Search className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium">{suggestion.name}</div>
                              <div className="text-sm text-gray-400">{suggestion.formatted_address}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-gray-400 text-sm mb-2">Destination</label>
                  <div className="relative">
                    <div className="flex items-center space-x-2 p-3 bg-gray-800 rounded-lg border border-gray-700 focus-within:border-blue-500 transition-colors">
                      <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => handleDestinationChange(e.target.value)}
                        onFocus={() => destination.length > 2 && setShowDestinationSuggestions(true)}
                        className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                        placeholder="Enter destination..."
                      />
                      {destination && (
                        <button
                          onClick={() => {
                            setDestination('')
                            setShowDestinationSuggestions(false)
                          }}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                        {destinationSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => selectDestinationSuggestion(suggestion)}
                            className="w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-colors flex items-start space-x-2"
                          >
                            <Search className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium">{suggestion.name}</div>
                              <div className="text-sm text-gray-400">{suggestion.formatted_address}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleCalculateRoutes}
                  disabled={loading || !startingPoint || !destination}
                  className="btn-primary w-full py-3 rounded-lg flex items-center justify-center space-x-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Route className="h-5 w-5" />
                  <span>{loading ? 'Calculating...' : 'Calculate Optimal Routes'}</span>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Live Conditions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Google Maps Integration</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Real-time Traffic</span>
                  <span className="text-blue-400">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Route Alternatives</span>
                  <span className="text-yellow-400">Multiple</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Emergency Priority</span>
                  <span className="text-green-400">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Route Options */}
        {routes.length > 0 && (
          <div className="space-y-6 mb-8">
            {routes.map((route, index) => {
              const { status, color } = getRouteStatus(index);
              
              return (
                <div 
                  key={index} 
                  className={`gradient-card rounded-xl p-6 cursor-pointer transition-all ${
                    selectedRoute === index ? 'ring-2 ring-blue-500 scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                  onClick={() => setSelectedRoute(index)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                        <Navigation className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Route {index + 1}</h3>
                        <p className="text-gray-400">{startingPoint} → {destination}</p>
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${color}`}>
                      {status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Map className="h-4 w-4 text-blue-400" />
                        <span className="text-gray-400 text-sm">Distance</span>
                      </div>
                      <div className="text-xl font-bold text-white">{route.distance}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-green-400" />
                        <span className="text-gray-400 text-sm">Duration</span>
                      </div>
                      <div className="text-xl font-bold text-white">{route.duration}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Navigation2 className="h-4 w-4 text-purple-400" />
                        <span className="text-gray-400 text-sm">Steps</span>
                      </div>
                      <div className="text-xl font-bold text-white">{route.steps.length}</div>
                    </div>
                  </div>

                  {selectedRoute === index && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <div className="flex space-x-4">
                        <button 
                          onClick={() => startNavigation(index)}
                          className="btn-primary px-6 py-2 rounded-lg flex items-center space-x-2"
                        >
                          <Zap className="h-4 w-4" />
                          <span>Start Navigation</span>
                        </button>
                        <button className="btn-secondary px-6 py-2 rounded-lg">
                          Share Route
                        </button>
                        <button className="btn-secondary px-6 py-2 rounded-lg">
                          Save Route
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Google Maps Visualization */}
        <div className="gradient-card rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Live Route Visualization</h3>
          <div className="bg-gray-800 rounded-lg h-96 overflow-hidden">
            <GoogleMap
              center={{ lat: 3.1390, lng: 101.6869 }}
              zoom={10}
              markers={mapMarkers}
              routes={mapRoutes}
              className="w-full h-full"
            />
          </div>
          {routes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-lg">
              <div className="text-center">
                <Map className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Enter locations and calculate routes to see live visualization</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default RouteOptimizer
