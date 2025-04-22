import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const CaseLawPage = () => {
  const [query, setQuery] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('/api/cases/search', {
        params: {
          query,
          jurisdiction: jurisdiction || undefined,
          date_start: dateStart || undefined,
          date_end: dateEnd || undefined
        }
      });
      
      setResults(response.data);
      setSearched(true);
    } catch (error) {
      console.error('Error searching cases:', error);
      setError('Failed to search case law');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Case Law Research</h1>
          <p className="lead">
            Search and explore case law to find relevant legal precedents for your research.
          </p>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group controlId="searchQuery">
                      <Form.Label>Search Query</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter keywords, case name, or legal concept"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Group controlId="jurisdiction">
                      <Form.Label>Jurisdiction</Form.Label>
                      <Form.Control
                        as="select"
                        value={jurisdiction}
                        onChange={(e) => setJurisdiction(e.target.value)}
                      >
                        <option value="">All Jurisdictions</option>
                        <option value="us">United States</option>
                        <option value="cal">California</option>
                        <option value="ny">New York</option>
                        <option value="tex">Texas</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4} className="mb-3">
                    <Form.Group controlId="dateStart">
                      <Form.Label>From Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={dateStart}
                        onChange={(e) => setDateStart(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4} className="mb-3">
                    <Form.Group controlId="dateEnd">
                      <Form.Label>To Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={dateEnd}
                        onChange={(e) => setDateEnd(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        <span className="ms-2">Searching...</span>
                      </>
                    ) : (
                      <>
                        <FaSearch className="me-2" />
                        Search Cases
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      
      {searched && (
        <Row>
          <Col>
            <Card>
              <Card.Header>
                Search Results {results.length > 0 && `(${results.length} cases found)`}
              </Card.Header>
              
              {results.length === 0 ? (
                <Card.Body className="text-center py-5">
                  <h4>No cases found</h4>
                  <p className="text-muted">
                    Try modifying your search terms or filters to find relevant cases.
                  </p>
                </Card.Body>
              ) : (
                <ListGroup variant="flush">
                  {results.map((caseItem, index) => (
                    <ListGroup.Item key={index} action as={Link} to={`/cases/${caseItem.id}`}>
                      <div className="fw-bold">{caseItem.case_name}</div>
                      <div className="small text-muted">{caseItem.citation}</div>
                      <div className="mt-1">{caseItem.summary}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CaseLawPage; 