import { useEffect, useState } from "react";
import { getCountryWeather } from "../services/weatherService";

const CountryDetail = ({ selectedChecking }) => {
  if (selectedChecking === null || selectedChecking === undefined) {
    return;
  }

  const [weatherInfo, setWeatherInfo] = useState(null);
  const selectedLanguages = Object.values(selectedChecking?.languages);

  useEffect(() => {
    getCountryWeather(selectedChecking.lat, selectedChecking.lng)
      .then((response) => {
        console.log(response);
        setWeatherInfo(response);
      })
      .catch((err) => err.message);
  }, []);

  if (weatherInfo === null) return;

  return (
    <div>
      <h1>{selectedChecking.name}</h1>
      <p>capital {selectedChecking.capital}</p>
      <p>area {selectedChecking.area}</p>
      <h3>languages </h3>
      <ul>
        {selectedLanguages.map((language) => {
          return <li key={language}>{language}</li>;
        })}
      </ul>
      <img
        src={selectedChecking.flag}
        alt={selectedChecking.flagAlt}
        width={200}
      />
      <h2>Weather in {selectedChecking.capital}</h2>
      <p>temperature {(weatherInfo?.main.temp - 273.15).toFixed(2)} Celcius</p>
      <img
        src={`https://openweathermap.org/img/w/${weatherInfo?.weather[0].icon}.png`}
      />
      <p>wind {weatherInfo?.wind.speed} m/s</p>
    </div>
  );
};

export default CountryDetail;
