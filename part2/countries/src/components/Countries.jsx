const Countries = ({
  countries,
  searchTerm,
  handleSelectedCountry,
  selectedCountry,
}) => {
  if (searchTerm == "") return;
  if (selectedCountry) return;

  const filteredCountries = countries?.filter((country) =>
    country.name.toLowerCase().includes(searchTerm)
  );

  if (filteredCountries?.length > 10) {
    return <div>To many matches, specify another filter</div>;
  }
  if (filteredCountries?.length > 1 && filteredCountries?.length < 10) {
    return filteredCountries.map((country) => {
      return (
        <div key={country.name}>
          {country.name}
          <button onClick={() => handleSelectedCountry(country.id)}>
            show
          </button>
        </div>
      );
    });
  }
};
export default Countries;
