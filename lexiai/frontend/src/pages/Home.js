import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaGavel, FaFileAlt } from 'react-icons/fa';

const Home = () => {
  return (
    <Container>
      <Row className="my-5 text-center">
        <Col>
          <h1 className="display-4">Welcome to LexiAI</h1>
          <p className="lead">
            Your intelligent legal assistant for case law research, legal Q&A, and document generation.
          </p>
        </Col>
      </Row>
      
      <Row className="my-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-3">
                <FaSearch size={50} className="text-primary" />
              </div>
              <Card.Title className="text-center">Legal Q&A</Card.Title>
              <Card.Text>
                Get answers to your legal questions using natural language. Our AI assistant provides detailed explanations based on legal knowledge.
              </Card.Text>
              <div className="mt-auto">
                <Button as={Link} to="/search" variant="primary" className="w-100">
                  Ask a Question
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-3">
                <FaGavel size={50} className="text-primary" />
              </div>
              <Card.Title className="text-center">Case Law Research</Card.Title>
              <Card.Text>
                Search and explore relevant case law for your legal research. Get summaries and detailed information on important legal precedents.
              </Card.Text>
              <div className="mt-auto">
                <Button as={Link} to="/cases" variant="primary" className="w-100">
                  Search Cases
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-3">
                <FaFileAlt size={50} className="text-primary" />
              </div>
              <Card.Title className="text-center">Document Generator</Card.Title>
              <Card.Text>
                Generate professional legal documents by filling out simple forms. Create NDAs, contracts, and other legal documents in minutes.
              </Card.Text>
              <div className="mt-auto">
                <Button as={Link} to="/documents/create" variant="primary" className="w-100">
                  Create Document
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home; 