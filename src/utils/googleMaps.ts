// Google Maps utility functions
export interface PlaceResult {
  place_id: string;
  formatted_address: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface RouteResult {
  distance: string;
  duration: string;
  steps: google.maps.DirectionsStep[];
  overview_path: google.maps.LatLng[];
}

export class GoogleMapsService {
  private static instance: GoogleMapsService;
  private placesService: google.maps.places.PlacesService | null = null;
  private directionsService: google.maps.DirectionsService | null = null;
  private geocoder: google.maps.Geocoder | null = null;

  private constructor() {}

  static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.maps) {
        const mapDiv = document.createElement('div');
        const map = new google.maps.Map(mapDiv, {
          center: { lat: 3.1390, lng: 101.6869 }, // Kuala Lumpur
          zoom: 10
        });
        
        this.placesService = new google.maps.places.PlacesService(map);
        this.directionsService = new google.maps.DirectionsService();
        this.geocoder = new google.maps.Geocoder();
        resolve();
      } else {
        const checkGoogle = () => {
          if (typeof google !== 'undefined' && google.maps) {
            const mapDiv = document.createElement('div');
            const map = new google.maps.Map(mapDiv, {
              center: { lat: 3.1390, lng: 101.6869 },
              zoom: 10
            });
            
            this.placesService = new google.maps.places.PlacesService(map);
            this.directionsService = new google.maps.DirectionsService();
            this.geocoder = new google.maps.Geocoder();
            resolve();
          } else {
            setTimeout(checkGoogle, 100);
          }
        };
        checkGoogle();
      }
    });
  }

  async searchPlaces(query: string, location?: { lat: number; lng: number }): Promise<PlaceResult[]> {
    if (!this.placesService) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      if (!this.placesService) {
        reject(new Error('Places service not initialized'));
        return;
      }

      const request: google.maps.places.TextSearchRequest = {
        query: query,
        location: location ? new google.maps.LatLng(location.lat, location.lng) : new google.maps.LatLng(3.1390, 101.6869),
        radius: 50000, // 50km radius
      };

      this.placesService.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const places: PlaceResult[] = results.slice(0, 5).map(place => ({
            place_id: place.place_id || '',
            formatted_address: place.formatted_address || '',
            name: place.name || '',
            geometry: {
              location: {
                lat: place.geometry?.location?.lat() || 0,
                lng: place.geometry?.location?.lng() || 0
              }
            }
          }));
          resolve(places);
        } else {
          resolve([]);
        }
      });
    });
  }

  async getDirections(origin: string, destination: string, waypoints?: string[]): Promise<RouteResult[]> {
    if (!this.directionsService) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      if (!this.directionsService) {
        reject(new Error('Directions service not initialized'));
        return;
      }

      const waypointsFormatted = waypoints?.map(waypoint => ({
        location: waypoint,
        stopover: true
      })) || [];

      const request: google.maps.DirectionsRequest = {
        origin: origin,
        destination: destination,
        waypoints: waypointsFormatted,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        avoidHighways: false,
        avoidTolls: false
      };

      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const routes: RouteResult[] = result.routes.map(route => ({
            distance: route.legs.reduce((total, leg) => total + (leg.distance?.value || 0), 0) / 1000 + ' km',
            duration: route.legs.reduce((total, leg) => total + (leg.duration?.value || 0), 0) / 60 + ' min',
            steps: route.legs.flatMap(leg => leg.steps || []),
            overview_path: route.overview_path
          }));
          resolve(routes);
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      });
    });
  }

  async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    if (!this.geocoder) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      if (!this.geocoder) {
        reject(new Error('Geocoder service not initialized'));
        return;
      }

      this.geocoder.geocode({ address: address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    if (!this.geocoder) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      if (!this.geocoder) {
        reject(new Error('Geocoder service not initialized'));
        return;
      }

      this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve(null);
        }
      });
    });
  }
}

export const googleMapsService = GoogleMapsService.getInstance();
