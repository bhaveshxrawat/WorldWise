import { useState } from "react";

type CoordProps = {
  lat: number;
  long: number;
};

export function useGeolocation(defaultPosition = null) {
  const [coords, setCoords] = useState<CoordProps | null>(defaultPosition);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);
  function getPositionCoords() {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support Geolocation");
    }
    setFetching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({
          lat: latitude,
          long: longitude,
        });
        setFetching(false);
      },
      (err) => {
        setError("An error occured" + err.message);
        setFetching(false);
      }
    );
  }
  return { coords, error, fetching, getPositionCoords };
}
