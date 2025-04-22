import React, { useContext } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DocumentGenerator from '../components/documents/DocumentGenerator';
import { AuthContext } from '../context/AuthContext';

const CreateDocumentPage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Create Legal Document</h1>
          <p className="lead">
            Generate professional legal documents by providing the necessary information.
            Our AI will create a customized document based on your inputs.
          </p>
        </Col>
      </Row>
      
      <Row>
        <Col>
          {!isAuthenticated ? (
            <Card>
              <Card.Body>
                <Alert variant="warning">
                  <Alert.Heading>Login Required</Alert.Heading>
                  <p>
                    You need to be logged in to create and save documents. Please log in to continue.
                  </p>
                  <Link to="/login" className="btn btn-primary">
                    Log In
                  </Link>
                </Alert>
              </Card.Body>
            </Card>
          ) : (
            <DocumentGenerator />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CreateDocumentPage; 