import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const DocumentGenerator = () => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [parameters, setParameters] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [typesLoading, setTypesLoading] = useState(true);
  const [parametersLoading, setParametersLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedDocument, setGeneratedDocument] = useState(null);
  
  const { currentUser } = useContext(AuthContext);

  // Fetch document types on component mount
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const response = await axios.get('/api/documents/types');
        setDocumentTypes(response.data);
      } catch (error) {
        console.error('Error fetching document types:', error);
        setError('Failed to load document types');
      } finally {
        setTypesLoading(false);
      }
    };
    
    fetchDocumentTypes();
  }, []);

  // Fetch parameters when document type is selected
  useEffect(() => {
    if (!selectedType) return;
    
    const fetchParameters = async () => {
      setParametersLoading(true);
      try {
        const response = await axios.get(`/api/documents/parameters/${selectedType}`);
        setParameters(response.data);
        
        // Initialize form values
        const initialValues = {};
        response.data.forEach(param => {
          initialValues[param.id] = '';
        });
        setFormValues(initialValues);
      } catch (error) {
        console.error('Error fetching parameters:', error);
        setError('Failed to load document parameters');
      } finally {
        setParametersLoading(false);
      }
    };
    
    fetchParameters();
  }, [selectedType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');
    setGeneratedDocument(null);
    setLoading(true);
    
    try {
      const response = await axios.post('/api/documents/generate', {
        document_type: selectedType,
        parameters: formValues,
        user_id: currentUser?.user_id
      });
      
      setSuccess('Document generated successfully!');
      setGeneratedDocument(response.data);
    } catch (error) {
      console.error('Error generating document:', error);
      setError(error.response?.data?.error || 'Failed to generate document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Legal Document Generator</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {!generatedDocument ? (
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Document Type</Form.Label>
                {typesLoading ? (
                  <div className="d-flex align-items-center">
                    <Spinner animation="border" size="sm" />
                    <span className="ms-2">Loading document types...</span>
                  </div>
                ) : (
                  <Form.Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    required
                  >
                    <option value="">Select a document type</option>
                    {documentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
              
              {parametersLoading ? (
                <div className="d-flex align-items-center">
                  <Spinner animation="border" size="sm" />
                  <span className="ms-2">Loading parameters...</span>
                </div>
              ) : (
                <>
                  {parameters.map(param => (
                    <Form.Group key={param.id} className="mb-3">
                      <Form.Label>{param.name}</Form.Label>
                      <Form.Control
                        type="text"
                        name={param.id}
                        value={formValues[param.id] || ''}
                        onChange={handleInputChange}
                        required={param.required}
                      />
                    </Form.Group>
                  ))}
                  
                  {parameters.length > 0 && (
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" />
                          <span className="ms-2">Generating...</span>
                        </>
                      ) : (
                        'Generate Document'
                      )}
                    </Button>
                  )}
                </>
              )}
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>{generatedDocument.title}</div>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => setGeneratedDocument(null)}
            >
              Create Another Document
            </Button>
          </Card.Header>
          <Card.Body>
            <pre className="document-content" style={{ whiteSpace: 'pre-wrap' }}>
              {generatedDocument.content}
            </pre>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default DocumentGenerator; 