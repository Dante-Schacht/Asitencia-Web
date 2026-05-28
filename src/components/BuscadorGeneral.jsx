import React, { useState } from 'react';

const BuscadorGeneral = ({ data, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Buscar estudiantes, cursos, notas o asistencias..."
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
};

export default BuscadorGeneral;
