import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import components
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SearchPage from './pages/SearchPage';
import DocumentsPage from './pages/DocumentsPage';
import CreateDocumentPage from './pages/CreateDocumentPage';
import CaseLawPage from './pages/CaseLawPage';
import CaseDetailsPage from './pages/CaseDetailsPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/documents/create" element={<CreateDocumentPage />} />
            <Route path="/cases" element={<CaseLawPage />} />
            <Route path="/cases/:id" element={<CaseDetailsPage />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App; 