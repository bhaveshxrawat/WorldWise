import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

type CitiesContextType = {
  cities: City[];
  currentCity: City | null;
  isLoading: boolean;
  getCurrentCity: (id: string) => Promise<void>;
  setCurrentCity: (data: City | null) => void;
  removeCity: (id: string) => Promise<void>;
  createCity: (newCity: City) => Promise<void>;
};

type State = {
  cities: City[];
  isLoading: boolean;
  error: string;
  currentCity: City | null;
};

type Action =
  | { type: "loading" }
  | { type: "cities/loaded"; payload: City[] }
  | { type: "city/set"; payload: City | null }
  | { type: "cities/created"; payload: City }
  | { type: "cities/deleted"; payload: string }
  | { type: "rejected"; payload: string };

const CitiesContext = createContext<CitiesContextType | undefined>(undefined);
const BASE_URL = "http://localhost:8000";

const initialState: State = {
  cities: [],
  isLoading: false,
  error: "",
  currentCity: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/set":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities.filter((city) => city.id !== action.payload)],
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesContextProvider({ children }: { children: React.ReactNode }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error fetching data",
        });
      }
    }
    fetchCities();
  }, []);
  const getCurrentCity = useCallback(
    async function getCurrentCity(id: string) {
      if (Number(id) === Number(currentCity?.id)) return;
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/set", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error fetching data",
        });
      }
    },
    [currentCity?.id]
  );
  async function createCity(newCity: City) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "cities/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city.",
      });
    }
  }
  async function removeCity(id: string) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "cities/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city",
      });
    }
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
