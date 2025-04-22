import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ChatInterface from '../components/chatbot/ChatInterface';

const SearchPage = () => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Legal Q&A</h1>
          <p className="lead">
            Ask legal questions and get answers powered by AI. Our system can help you understand legal concepts, interpret case law, and provide guidance on legal matters.
          </p>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <ChatInterface />
        </Col>
      </Row>
    </Container>
  );
};

export default SearchPage;
