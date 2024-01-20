import axios from "axios";

const api_key = import.meta.env.VITE_SOME_KEY;

const getCountryWeather = (lat, lng) => {
  const request = axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api_key}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log(err.message));
  return request;
};

export { getCountryWeather };
