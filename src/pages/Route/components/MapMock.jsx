import React, { useState, useEffect, useMemo } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import {
  GoogleMap, Marker, DirectionsService,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";


const containerStyle = {
  width: "100%",
  height: "100%",
};

// const center = {
//   lat: 22.3039,
//   lng: 70.8022,
// };
const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const MapMock = (props) => {
  const { className = '', isMini = false, locations = [], callback, agentLocation } = props;
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: key,
    libraries: libraries,
  });
  const [map, setMap] = useState(null);

  const [zoom, setZoom] = useState(20);
  const [directions, setDirections] = useState(null);

  const [totalDistance, setTotalDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);

  useEffect(() => {
    if (callback) {
      callback({
        totalDistance,
        estimatedTime
      })
    }
  }, [totalDistance, estimatedTime, callback]);

  useEffect(() => {
    // Reset directions when locations change to force recalculation
    setDirections(null);
    setTotalDistance(0);
    setEstimatedTime(0);
  }, [locations]);


  const defaultCenter = useMemo(() => ({
    lat: 22.3039,
    lng: 70.8022,
  }), []);

  const pendingLocations = useMemo(() => {
    return locations.filter(loc => loc.status !== 'delivered');
  }, [locations]);

  const center = useMemo(() => {
    if (pendingLocations && pendingLocations.length > 0) {
      const loc = pendingLocations[0];
      return {
        lat: parseFloat(loc.lat || loc.latitude || 22.3039),
        lng: parseFloat(loc.lng || loc.longitude || 70.8022)
      };
    }
    if (agentLocation) {
      return { lat: parseFloat(agentLocation.lat), lng: parseFloat(agentLocation.lng) };
    }
    return defaultCenter;
  }, [pendingLocations, agentLocation, defaultCenter]);

  const origin = useMemo(() => {
    if (agentLocation) {
      return { lat: parseFloat(agentLocation.lat), lng: parseFloat(agentLocation.lng) };
    }
    return pendingLocations[0];
  }, [agentLocation, pendingLocations]);

  const destination = useMemo(() => pendingLocations[pendingLocations.length - 1], [pendingLocations]);

  const waypoints = useMemo(() => {
    if (!pendingLocations || pendingLocations.length <= (agentLocation ? 1 : 2)) return [];

    // If we have an agent location, the first pending stop is a waypoint.
    // If we don't, the first pending stop is the origin.
    const startIdx = agentLocation ? 0 : 1;
    const endIdx = pendingLocations.length - 1;

    return pendingLocations.slice(startIdx, endIdx)
      .filter(loc => loc && (loc.lat || loc.latitude) && (loc.lng || loc.longitude))
      .map((loc) => ({
        location: {
          lat: parseFloat(loc.lat || loc.latitude),
          lng: parseFloat(loc.lng || loc.longitude)
        },
        stopover: true,
      }));
  }, [pendingLocations, agentLocation]);


  const mapImg = isMini
    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBufhGs7HOm3yEGkbZQ7ESJsC8r9KA7rA_bcJc-GuLGNxHx0Is8hGeRbdYp3qmo7213fH6BvGp1MCduzxVyZfyBj93S6JmOc2j1oJ34L6p9sNvYPueUxZkD0JBd4OT3G1jVDLBxBp4fppntLCly3c0q02WFJ1EmlJPC2udlqPgqp3BxRxN-q87nrLFLP6MNA8oo4eYmJ1XtnvaQvKRBaly4NkmRP_Qh-7ss5ZBBSWujR6zvPu6E1vuG2FOjnIGAMLtL-KznL5Gw5i0'
    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx8vUXTilA0gt774NuBSdUYlDSvKROnI64qS53z0ZnaJKl4oz7qaZC_CYUmPSEwzyJogtdRCEi7XlSMh1hLq5RT_T8BGyAQ201K15OlvMvDkeUbd3UKpRgoiP5pAFe02RlYlQKN5VqiiIL9r1534ISncC4hwTctL7NgH8JfS9mIuzWirjYHAgJpQ1csqteicrwoH9jhC53_EUyneKKXWrg0ERW2o1cGvMaR3BrqZk1ur5w09YoCsqkBC-URg-VQT5556di4msP8GQ';

  const onZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom();
      map.setZoom(currentZoom + 1);
    }
  }
  const onZoomOut = () => {
    if (map) {

      const currentZoom = map.getZoom();
      map.setZoom(currentZoom - 1);
    }
  }



  if (!isLoaded) {
    return (
      <section className={`relative bg-slate-200 overflow-hidden ${className}`}>
        <div className="flex items-center justify-center h-full">Loading...</div>
      </section>
    );
  }

  return (
    <section className={`relative bg-slate-200 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 z-0 bg-cover bg-center rounded-xl"
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}
          mapContainerClassName='rounded-xl overflow-hidden'
          options={{
            clickableIcons: false,
            zoomControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: false,
            gestureHandling: 'greedy',
            disableDefaultUI: true,
          }}
          onLoad={(map) => setMap(map)}
        >
          {locations.map((loc, index) => {
            const isDelivered = loc.status === 'delivered';
            return (
              <Marker
                key={`${loc.id}-${index}`}
                position={{ lat: Number(loc.lat), lng: Number(loc.lng) }}
                title={loc.name}
                icon={loc.id === 'agent-location' ? ({
                  url: '/delivery-agent.svg',
                  scaledSize: new window.google.maps.Size(40, 40),
                  anchor: new window.google.maps.Point(20, 20),
                }) : ({
                  path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                  scale: 10,
                  fillColor: isDelivered ? "#10b981" : "#ef4444", // Green for delivered, red for pending
                  fillOpacity: 1,
                  strokeColor: "#FFFFFF",
                  strokeOpacity: 1,
                  strokeWeight: 2
                })}
                label={{
                  text: isDelivered ? '✓' : `${index + 1}`,
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
            );
          })}

          {props.agentLocation && (
            <Marker
              position={{ lat: Number(props.agentLocation.lat), lng: Number(props.agentLocation.lng) }}
              title={`Agent: ${props.agentLocation.agentName}`}
              zIndex={100}
              icon={{
                url: '/delivery-agent-1.svg',
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(20, 20),
              }}
            />
          )}
          {directions === null && (locations.length > 1 || (agentLocation && locations.length > 0)) && origin && destination && (
            <DirectionsService
              options={{
                origin: {
                  lat: parseFloat(origin.lat || origin.latitude),
                  lng: parseFloat(origin.lng || origin.longitude)
                },
                destination: {
                  lat: parseFloat(destination.lat || destination.latitude),
                  lng: parseFloat(destination.lng || destination.longitude)
                },
                waypoints: waypoints,
                travelMode: window.google?.maps?.TravelMode?.DRIVING || "DRIVING",
              }}
              callback={(result) => {
                if (result !== null) {
                  if (result.status === "OK") {
                    const dist = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0) / 1000; //km
                    const time = result.routes[0].legs.reduce((acc, leg) => acc + leg.duration.value, 0) / 60; //minutes

                    // Update state only if values have changed significantly to avoid jitter
                    setTotalDistance(dist);
                    setEstimatedTime(time);
                    setDirections(result);
                    console.log('MapMock: Route updated successfully', { distance: dist, time });
                  } else {
                    console.error('MapMock: Directions request failed with status:', result.status);
                  }
                }
              }}
            />
          )}


          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
                suppressMarkers: true,
              }}
            />
          )}
        </GoogleMap>
      </div>

      <div className={`absolute ${isMini ? 'right-2 bottom-2 gap-1' : 'right-6 bottom-6 gap-2'} flex flex-col z-10`}>
        <button onClick={onZoomIn} className={`${isMini ? 'w-8 h-8 rounded' : 'w-12 h-12 rounded-xl'} bg-white shadow-lg flex items-center justify-center text-slate-700 hover:text-primary transition-all cursor-pointer`}>
          <span className="material-symbols-outlined text-sm">add</span>
        </button>
        <button onClick={onZoomOut} className={`${isMini ? 'w-8 h-8 rounded' : 'w-12 h-12 rounded-xl'} bg-white shadow-lg flex items-center justify-center text-slate-700 hover:text-primary transition-all cursor-pointer`}>
          <span className="material-symbols-outlined text-sm">remove</span>
        </button>
      </div>

      {!isMini && (
        <div className="absolute left-6 bottom-6 bg-white p-3 rounded-xl shadow-lg z-10 border border-slate-200 flex gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-primary rounded-full"></span>
            <span>Route Sequence</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default MapMock;
