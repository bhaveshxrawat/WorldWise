import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { cities } from "../data/cities";
import { getItemLS, setItemLS } from "../utils/localStorage";

type CitiesContextType = {
  cities: City[];
  currentCity: City | null;
  getCurrentCity: (id: string) => void;
  setCurrentCity: (data: City | null) => void;
  removeCity: (id: string) => void;
  createCity: (newCity: City) => void;
};

type State = {
  cities: City[];
  currentCity: City | null;
};

type Action =
  | { type: "city/set"; payload: City | null }
  | { type: "cities/created"; payload: City }
  | { type: "cities/deleted"; payload: string };

const CitiesContext = createContext<CitiesContextType | undefined>(undefined);

const initialState: State = {
  cities: getItemLS("worldwise_cities", cities),
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
  const [{ cities, currentCity }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setItemLS("worldwise_cities", cities);
  }, [cities]);
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
// eslint-disable-next-line react-refresh/only-export-components
export { CitiesContextProvider, useCities };
