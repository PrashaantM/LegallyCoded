import React, { useState } from "react";
import axios from "axios";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/api/case-law?query=${searchTerm}`);
      setResults(res.data);
    } catch (error) {
      console.error("Error fetching case law:", error);
    }
  };

  return (
    <div className="search-bar">
      <h2>Case Law Search</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for case law..."
          required
        />
        <button type="submit">Search</button>
      </form>
      {results.length > 0 && (
        <div className="results">
          <h3>Results:</h3>
          <ul>
            {results.map((caseLaw, index) => (
              <li key={index}>
                <strong>{caseLaw.title}</strong>: {caseLaw.summary}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;