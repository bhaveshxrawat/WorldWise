import { createContext, useCallback, useContext, useReducer } from "react";

type CitiesContextType = {
  cities: City[];
  currentCity: City | null;
  isLoading: boolean;
  getCurrentCity: (id: string) => void;
  setCurrentCity: (data: City | null) => void;
  removeCity: (id: string) => void;
  createCity: (newCity: City) => void;
};

type State = {
  cities: City[];
  isLoading: boolean;
  error: string;
  currentCity: City | null;
};

type Action =
  | { type: "city/set"; payload: City | null }
  | { type: "cities/created"; payload: City }
  | { type: "cities/deleted"; payload: string };

const CitiesContext = createContext<CitiesContextType | undefined>(undefined);

const initialState: State = {
  cities: [
    {
      cityName: "Lisbon",
      country: "Portugal",
      emoji: "🇵🇹",
      date: "2027-10-31T15:59:59.138Z",
      notes: "My favorite city so far!",
      position: {
        lat: 38.727881642324164,
        lng: -9.140900099907554,
      },
      id: "73930385",
    },
    {
      cityName: "Madrid",
      country: "Spain",
      emoji: "🇪🇸",
      date: "2027-07-15T08:22:53.976Z",
      notes: "",
      position: {
        lat: 40.46635901755316,
        lng: -3.7133789062500004,
      },
      id: "17806751",
    },
    {
      id: "1736883785583",
      cityName: "Tora",
      country: "Spain",
      emoji: "🇪🇸",
      date: "2025-01-14T19:43:02.442Z",
      notes: "",
      position: {
        lat: 41.902277040963696,
        lng: 1.4941406250000002,
      },
    },
  ],
  isLoading: false,
  error: "",
  currentCity: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "city/set":
      return {
        ...state,
        currentCity: action.payload,
      };
    case "cities/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
      };
    case "cities/deleted":
      return {
        ...state,
        cities: [...state.cities.filter((city) => city.id !== action.payload)],
      };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesContextProvider({ children }: { children: React.ReactNode }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // loads individual city

  const getCurrentCity = useCallback(
    function getCurrentCity(id: string) {
      if (Number(id) === Number(currentCity?.id)) return;
      const data = cities.find((city) => city.id === id) ?? null;
      dispatch({ type: "city/set", payload: data });
    },
    [currentCity?.id, cities]
  );

  // creates new city

  const createCity = useCallback(function createCity(newCity: City) {
    dispatch({ type: "cities/created", payload: newCity });
  }, []);

  // Remove the city

  function removeCity(id: string) {
    dispatch({ type: "cities/deleted", payload: id });
  }
  function setCurrentCity(data: City | null) {
    dispatch({ type: "city/set", payload: data });
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        setCurrentCity,
        getCurrentCity,
        createCity,
        removeCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cannot use `useCities` hook out of its provider's scope");
  return context;
}
export { CitiesContextProvider, useCities };
