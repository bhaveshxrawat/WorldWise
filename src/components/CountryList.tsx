import Message from "./Message";
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import { useCities } from "../context/CitiesContext";

function CountryList() {
  const { cities } = useCities();
  if (cities.length === 0) return <Message message="Add a city" />;
  const countries = cities.reduce<Country[]>((acc, curr) => {
    if (!acc.map((item) => item.country).includes(curr.country)) {
      return [
        ...acc,
        { country: curr.country, emoji: curr.emoji, id: curr.id },
      ];
    } else return acc;
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}

export default CountryList;
