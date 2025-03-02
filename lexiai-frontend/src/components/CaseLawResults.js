import React, { useState } from "react";
import axios from "axios";
import ResponseBox from "./ResponseBox";

const CaseLawResults = ({ results }) => {
  const [response, setResponse] = useState("");

  const fetchCaseLawDetails = async () => {
    try {
      const res = await axios.get("/api/caselaw", { params: { results } });
      setResponse(res.data.response);  // Update the response with case law details
    } catch (error) {
      setResponse("Error fetching case law details.");
    }
  };

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

      {/* Button to trigger fetching additional case law details */}
      <button onClick={fetchCaseLawDetails}>Get Case Law Details</button>

      {/* Use the ResponseBox component to display the response */}
      {response && <ResponseBox response={response} />}
    </div>
  );
};

export default CaseLawResults;
