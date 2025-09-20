import React, { useEffect, useRef, useState } from 'react'

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    icon?: string;
    infoWindow?: string;
  }>;
  routes?: google.maps.DirectionsResult[];
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center = { lat: 3.1390, lng: 101.6869 }, // Kuala Lumpur default
  zoom = 10,
  markers = [],
  routes = [],
  onMapClick,
  className = "w-full h-full"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markersArray, setMarkersArray] = useState<google.maps.Marker[]>([]);
  const [directionsRenderers, setDirectionsRenderers] = useState<google.maps.DirectionsRenderer[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      if (typeof google !== 'undefined' && google.maps) {
        const mapInstance = new google.maps.Map(mapRef.current!, {
          center,
          zoom,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry.fill',
              stylers: [{ color: '#1a1a2e' }]
            },
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#ffffff' }]
            },
            {
              featureType: 'all',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#000000' }, { lightness: 13 }]
            },
            {
              featureType: 'administrative',
              elementType: 'geometry.fill',
              stylers: [{ color: '#000000' }]
            },
            {
              featureType: 'administrative',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#144b53' }, { lightness: 14 }, { weight: 1.4 }]
            },
            {
              featureType: 'landscape',
              elementType: 'all',
              stylers: [{ color: '#08304b' }]
            },
            {
              featureType: 'poi',
              elementType: 'geometry',
              stylers: [{ color: '#0c4152' }, { lightness: 5 }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.fill',
              stylers: [{ color: '#000000' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#0b434f' }, { lightness: 25 }]
            },
            {
              featureType: 'road.arterial',
              elementType: 'geometry.fill',
              stylers: [{ color: '#000000' }]
            },
            {
              featureType: 'road.arterial',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#0b3d51' }, { lightness: 16 }]
            },
            {
              featureType: 'road.local',
              elementType: 'geometry',
              stylers: [{ color: '#000000' }]
            },
            {
              featureType: 'transit',
              elementType: 'all',
              stylers: [{ color: '#146474' }]
            },
            {
              featureType: 'water',
              elementType: 'all',
              stylers: [{ color: '#021019' }]
            }
          ]
        });

        if (onMapClick) {
          mapInstance.addListener('click', onMapClick);
        }

        setMap(mapInstance);
      } else {
        setTimeout(initMap, 100);
      }
    };

    initMap();
  }, [center, zoom, onMapClick]);

  // Update markers
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersArray.forEach(marker => marker.setMap(null));
    setMarkersArray([]);

    // Add new markers
    const newMarkers = markers.map(markerData => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map: map,
        title: markerData.title,
        icon: markerData.icon
      });

      if (markerData.infoWindow) {
        const infoWindow = new google.maps.InfoWindow({
          content: markerData.infoWindow
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      }

      return marker;
    });

    setMarkersArray(newMarkers);
  }, [map, markers]);

  // Update routes
  useEffect(() => {
    if (!map) return;

    // Clear existing routes
    directionsRenderers.forEach(renderer => renderer.setMap(null));
    setDirectionsRenderers([]);

    // Add new routes
    const newRenderers = routes.map((route, index) => {
      const renderer = new google.maps.DirectionsRenderer({
        directions: route,
        routeIndex: 0,
        polylineOptions: {
          strokeColor: index === 0 ? '#3b82f6' : '#6b7280',
          strokeWeight: index === 0 ? 6 : 4,
          strokeOpacity: index === 0 ? 0.8 : 0.6
        },
        suppressMarkers: false
      });

      renderer.setMap(map);
      return renderer;
    });

    setDirectionsRenderers(newRenderers);
  }, [map, routes]);

  return <div ref={mapRef} className={className} />;
};

export default GoogleMap;
