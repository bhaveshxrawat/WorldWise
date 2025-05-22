import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCities } from "../context/CitiesContext";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";
import type { LatLngTuple } from "leaflet";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useCoordsURL } from "../hooks/useCoordsURL";

function Map() {
  const { cities } = useCities();
  const [mapLat, mapLng] = useCoordsURL();
  const { getPositionCoords, coords, fetching } = useGeolocation();
  const [mapPosition, setMapPosition] = useState<LatLngTuple>([51, 30]);
  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([Number(mapLat), Number(mapLng)]);
  }, [mapLat, mapLng]);
  useEffect(() => {
    if (coords) {
      setMapPosition([coords.lat, coords.long]);
      locationUsedOnce.current = true;
    }
  }, [coords]);
  const locationUsedOnce = useRef(false);
  return (
    <div className={styles.mapContainer}>
      {!locationUsedOnce.current && (
        <Button type="position" onClick={getPositionCoords}>
          {fetching ? "Getting your location..." : "Use My Location"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={5}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={{ lat: city.position.lat, lng: city.position.lng }}
            icon={
              new Icon({
                iconUrl: markerIconPng,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })
            }
          >
            <Popup>
              <span>{city.emoji}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <HandleClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }: { position: LatLngTuple }) {
  const currMap = useMap();
  currMap.setView(position);
  return null;
}

function HandleClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      navigate(`form?lat=${lat}&lng=${lng}`);
    },
  });
  return null;
}

export default Map;
