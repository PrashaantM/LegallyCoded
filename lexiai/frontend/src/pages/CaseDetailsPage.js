import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const CaseDetailsPage = () => {
  const { id } = useParams();
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const response = await axios.get(`/api/cases/${id}`);
        setCaseDetails(response.data);
      } catch (error) {
        console.error('Error fetching case details:', error);
        setError('Failed to load case details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCaseDetails();
  }, [id]);

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Link to="/cases" className="btn btn-outline-primary">
            <FaArrowLeft className="me-2" />
            Back to Search
          </Link>
        </Col>
      </Row>
      
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading case details...</p>
        </div>
      ) : caseDetails ? (
        <>
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header>
                  <h2 className="mb-0">{caseDetails.case_name}</h2>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3} className="mb-3">
                      <div className="fw-bold">Citation</div>
                      <div>{caseDetails.citation}</div>
                    </Col>
                    <Col md={9} className="mb-3">
                      <div className="fw-bold">Summary</div>
                      <div>{caseDetails.summary}</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col>
              <Card>
                <Card.Header>Full Text</Card.Header>
                <Card.Body>
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {caseDetails.full_text || "Full text not available for this case."}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Row>
          <Col>
            <Alert variant="warning">
              Case not found. It may have been removed or is not available.
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CaseDetailsPage; 