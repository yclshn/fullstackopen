import React, { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Countries from "./components/Countries";
import CountryDetail from "./components/CountryDetail";

import { getAllCountries } from "./services/countryService";
import { getCountryWeather } from "./services/weatherService";

const App = () => {
  const [countries, setCountries] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllCountries()
      .then((response) => {
        const countryInfos = response.map((country) => {
          return {
            id: country.cca3,
            name: country.name.common,
            capital: country.capital,
            area: country.area,
            languages: country.languages,
            flag: country.flags.png,
            flagAlt: country.flags.alt,
            lat: country.latlng[0],
            lng: country.latlng[1],
          };
        });

        setCountries(countryInfos);
      })
      .catch((err) => err.message);
  }, []);

  const handleFilter = (e) => {
    setSelectedCountry(null);
    setSearchTerm(e.target.value);
  };

  const handleSelectedCountry = (id) => {
    setSelectedCountry(countries.filter((country) => country.id === id)[0]);
  };

  const filteredCountries = countries?.filter((country) =>
    country.name.toLowerCase().includes(searchTerm)
  );

  const selectedChecking =
    filteredCountries?.length === 1
      ? filteredCountries[0]
      : countries?.filter((country) => country.id === selectedCountry?.id)[0];

  return (
    <div>
      <Filter searchTerm={searchTerm} handleFilter={handleFilter} />

      <Countries
        countries={countries}
        searchTerm={searchTerm}
        handleSelectedCountry={handleSelectedCountry}
        selectedCountry={selectedCountry}
      />

      <CountryDetail selectedChecking={selectedChecking} />
    </div>
  );
};

export default App;
