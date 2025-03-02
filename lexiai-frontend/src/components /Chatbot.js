import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleQuerySubmit = async () => {
    try {
      const res = await axios.get("/api/query", { params: { query } });
      setResponse(res.data.response);
    } catch (error) {
      setResponse("Error processing your request.");
    }
  };

  return (
    <div className="chatbot-container">
      <h2>Ask a Legal Question</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your legal question"
      />
      <button onClick={handleQuerySubmit}>Submit</button>
      {response && <div className="response">{response}</div>}
    </div>
  );
};

export default Chatbot;
