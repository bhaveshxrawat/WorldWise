import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../context/CitiesContext";

type Props = {
  city: City;
  selectedCity: City | null;
};

const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city, selectedCity }: Props) {
  const { removeCity, currentCity, setCurrentCity } = useCities();
  const { cityName, emoji, date, id, position } = city;
  function handleDelete(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) {
    e.preventDefault();
    e.stopPropagation();
    removeCity(id);
  }

  function handlePointerDown(id: string) {
    if (id === currentCity?.id) return;
    setCurrentCity(null);
  }

  return (
    <Link
      className={`${styles.cityItem} ${
        selectedCity?.id === id ? styles["cityItem--active"] : ""
      }`}
      to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      onPointerDown={() => handlePointerDown(id)}
    >
      <span className={styles.emoji}>{emoji}</span>
      <h3 className={styles.name}>{cityName}</h3>
      <time className={styles.date}>{formatDate(date)}</time>
      <button className={styles.deleteBtn} onClick={(e) => handleDelete(e, id)}>
        &times;
      </button>
    </Link>
  );
}

export default CityItem;
