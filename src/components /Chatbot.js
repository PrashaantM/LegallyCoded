import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/chat", { query });
      setResponse(res.data.response);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <div className="chatbot-container">
      <h2>LexiAI Chatbot</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a legal question..."
          required
        />
        <button type="submit">Ask</button>
      </form>
      {response && (
        <div className="response">
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;