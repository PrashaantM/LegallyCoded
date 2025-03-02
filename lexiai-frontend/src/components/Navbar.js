import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">LexiAI</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#chatbot">Chatbot</Nav.Link>
        <Nav.Link href="#search">Case Law Search</Nav.Link>
        <Nav.Link href="#document">Document Generation</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default NavBar;