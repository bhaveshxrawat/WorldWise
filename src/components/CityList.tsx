import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../context/CitiesContext";

function CityList() {
  const { cities, currentCity } = useCities();
  if (cities.length === 0) return <Message message="Add a city" />;
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} selectedCity={currentCity} />
      ))}
    </ul>
  );
}

export default CityList;
