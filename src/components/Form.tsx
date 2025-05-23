// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { FormEvent, useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useCoordsURL } from "../hooks/useCoordsURL";
import { convertToEmoji } from "../utils/convertToEmoji";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../context/CitiesContext";

function Form() {
  const navigate = useNavigate();
  const { createCity } = useCities();
  const [lat, lng] = useCoordsURL();
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState("");
  const [cityfetching, setCityFetching] = useState(false);
  const [country, setCountry] = useState("");
  const [countryEmoji, setCountryEmoji] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!lat && !lng) return;
    async function fetchCity() {
      try {
        setError("");
        setCityFetching(true);
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );
        const data = await res.json();
        if (!data.countryCode) {
          throw new Error("Hmm... doesn't seem to be a city.");
        }
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setCountryEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setCityFetching(false);
      }
    }
    fetchCity();
  }, [lat, lng]);

  if (!lat && !lng) return <Message message="Please click on the map." />;
  if (cityfetching) return <Spinner />;
  if (error.length) return <Message message={error} />;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!cityName || !date || !lat || !lng) return;

    const newCity = {
      cityName,
      country,
      emoji: countryEmoji,
      date,
      notes,
      id: String(Date.now()),
      position: { lat: Number(lat), lng: Number(lng) },
    };
    createCity(newCity);
    navigate("../cities");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{countryEmoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(new Date(e.target.value))}
          value={String(date)}
        /> */}
        <DatePicker
          onChange={(date) => {
            if (date) setDate(date);
          }}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate("../cities");
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
