import React from "react";
import Chatbot from "../components/Chatbot";
import SearchBar from "../components/SearchBar";
import DocumentForm from "../components/DocumentForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>LexiAI - AI-Powered Legal Assistant</h1>
      <Chatbot />
      <SearchBar />
      <DocumentForm />
    </div>
  );
}

export default App;
