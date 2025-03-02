import React from "react";

const CaseLawResults = ({ results }) => {
  return (
    <div className="case-law-results">
      <h2>Case Law Results</h2>
      {results.length > 0 ? (
        <ul>
          {results.map((caseLaw, index) => (
            <li key={index}>
              <strong>{caseLaw.title}</strong>: {caseLaw.summary}
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default CaseLawResults;