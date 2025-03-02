import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import SearchBar from "./components/SearchBar";
import DocumentForm from "./components/DocumentForm";
import CaseLawResults from "./components/CaseLawResults";
import NavigationBar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <h1>LexiAI - AI-Powered Legal Assistant</h1>
        <Routes>
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/search" element={<SearchBar />} />
          <Route path="/document" element={<DocumentForm />} />
          <Route path="/caselaw" element={<CaseLawResults />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;