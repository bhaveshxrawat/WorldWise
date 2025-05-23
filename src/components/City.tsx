import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./City.module.css";
import { useCities } from "../context/CitiesContext";
import Spinner from "./Spinner";
import Button from "./Button";

const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCurrentCity, currentCity } = useCities();

  useEffect(() => {
    if (!id) return;
    getCurrentCity(id);
  }, [id, getCurrentCity]);

  if (!currentCity) return <Spinner />;

  const { cityName, emoji, date, notes } = currentCity;
  return (
    <div>
      <div className={styles.city}>
        <div className={styles.row}>
          <h6>City name</h6>
          <h3>
            <span>{emoji}</span> {cityName}
          </h3>
        </div>
        <div className={styles.row}>
          <h6>You went to {cityName} on</h6>
          <p>{formatDate(date)}</p>
        </div>
        {notes && (
          <div className={styles.row}>
            <h6>Your notes</h6>
            <p>{notes}</p>
          </div>
        )}
        <div className={styles.row}>
          <h6>Learn more</h6>
          <a
            href={`https://en.wikipedia.org/wiki/${cityName}`}
            target="_blank"
            rel="noreferrer"
          >
            Check out {cityName} on Wikipedia &rarr;
          </a>
        </div>
      </div>
      <Button
        type="back"
        onClick={(e) => {
          e.preventDefault();
          navigate("../cities");
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.88772 12.2126L13.7879 8.28787L12.7565 7.19995L7.80005 12.1876L12.7444 17.4L13.8 16.337L9.88772 12.2126Z"
            fill="white"
          ></path>
        </svg>{" "}
        Back
      </Button>
    </div>
  );
}

export default City;
