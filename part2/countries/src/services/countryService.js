import axios from "axios";

const getAllCountries = () => {
  const request = axios
    .get("https://studies.cs.helsinki.fi/restcountries/api/all")
    .then((response) => response.data);
  return request;
};

export { getAllCountries };
