import {
    GoogleMap,
    Marker,
    Autocomplete,
    useJsApiLoader,
} from "@react-google-maps/api";
import { useRef, useState, useMemo } from "react";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const defaultCenter = {
    lat: 22.3039,
    lng: 70.8022,
};

const apiKey = 'AIzaSyAxXgbUDcRWvutzlGQCn60XFLx3Or4Zupo';

function LocationPicker({ onSelect, defaultAddress, defaultLatLng, isEdit }) {
    const libraries = useMemo(() => ["places"], []);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: libraries,
    });

    const [position, setPosition] = useState(isEdit ? defaultLatLng : defaultCenter);
    const [address, setAddress] = useState(isEdit ? defaultAddress : "");
    const autocompleteRef = useRef(null);
    const mapRef = useRef(null);

    // 🔍 Search select
    const onPlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        console.log('place', place)

        if (!place.geometry) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setPosition({ lat, lng });
        setAddress(place.formatted_address);

        mapRef.current.panTo({ lat, lng });

        onSelect({ lat, lng, address: place.formatted_address });
    };

    // 📍 Click on map
    const handleMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setPosition({ lat, lng });

        getAddress(lat, lng);
    };

    // 🔄 Reverse geocoding
    const getAddress = (lat, lng) => {
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                setAddress(results[0].formatted_address);

                onSelect({
                    lat,
                    lng,
                    address: results[0].formatted_address,
                });
            }
        });
    };

    if (!isLoaded) {
        return <div className="p-5">Loading Map...</div>;
    }

    return (
        <div className="p-5">
            {/* 🔍 Search Box */}
            <Autocomplete
                onLoad={(ref) => (autocompleteRef.current = ref)}
                onPlaceChanged={onPlaceChanged}
            >
                <input
                    type="text"
                    id="googletext"
                    placeholder="Search address"
                    className="border border-slate-200 rounded-lg w-full px-4 py-2 focus:ring-primary outline-none cursor-pointer "
                // style={{ width: "100%", height: "40px", marginBottom: "10px" }}
                />
            </Autocomplete>

            {/* 🗺️ Map */}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={position}
                zoom={isEdit ? 18 : 10}
                onLoad={(map) => (mapRef.current = map)}
                onClick={handleMapClick}
                options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    zoomControl: true,
                }}
            >
                <Marker
                    position={position}
                    draggable={true}
                    onDragEnd={(e) => {
                        const lat = e.latLng.lat();
                        const lng = e.latLng.lng();

                        setPosition({ lat, lng });
                        getAddress(lat, lng);
                    }}
                />
            </GoogleMap>

            {/* 📌 Output */}
            <div style={{ marginTop: "10px" }}>
                <p className="text-sm text-slate-500"><b>Address:</b> {address}</p>
                <p className="text-sm text-slate-500"><b>Lat:</b> {position.lat}</p>
                <p className="text-sm text-slate-500"><b>Lng:</b> {position.lng}</p>
            </div>
        </div>
    );
}

export default LocationPicker;
