const Filter = ({ searchTerm, handleFilter }) => {
  return (
    <div>
      <label>find countries</label>
      <input value={searchTerm} onChange={handleFilter} />
    </div>
  );
};

export default Filter;
