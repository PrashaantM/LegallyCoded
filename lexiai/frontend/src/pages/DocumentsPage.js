import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { currentUser, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`/api/documents/user/${currentUser.user_id}`);
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setError('Failed to load your documents');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [currentUser, isAuthenticated]);

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Your Legal Documents</h1>
            <Button as={Link} to="/documents/create" variant="primary">
              <FaPlus className="me-2" />
              Create New Document
            </Button>
          </div>
        </Col>
      </Row>
      
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      
      <Row>
        <Col>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading your documents...</p>
            </div>
          ) : !isAuthenticated ? (
            <Card className="text-center p-5">
              <Card.Body>
                <FaFileAlt size={50} className="text-muted mb-3" />
                <h3>Log in to view your documents</h3>
                <p className="text-muted">
                  You need to log in to view and manage your legal documents.
                </p>
                <Button as={Link} to="/login" variant="primary" className="mt-3">
                  Log In
                </Button>
              </Card.Body>
            </Card>
          ) : documents.length === 0 ? (
            <Card className="text-center p-5">
              <Card.Body>
                <FaFileAlt size={50} className="text-muted mb-3" />
                <h3>No documents yet</h3>
                <p className="text-muted">
                  You haven't created any legal documents yet. Get started by creating your first document.
                </p>
                <Button as={Link} to="/documents/create" variant="primary" className="mt-3">
                  Create Document
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Header>Your Documents</Card.Header>
              <ListGroup variant="flush">
                {documents.map(document => (
                  <ListGroup.Item key={document.id} action as={Link} to={`/documents/${document.id}`}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">{document.title}</h5>
                        <p className="text-muted mb-0 small">
                          Created: {new Date(document.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        {document.document_type}
                      </span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default DocumentsPage; 