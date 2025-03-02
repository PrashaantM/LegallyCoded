import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/">LexiAI</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/chatbot">Chatbot</Nav.Link>
        <Nav.Link as={Link} to="/search">Case Law Search</Nav.Link>
        <Nav.Link as={Link} to="/document">Document Generation</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default NavigationBar;