import React, { useState, useContext } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // We'll still use AuthContext for login
  const { register: contextRegister } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }
    
    // Set loading state
    setLoading(true);
    
    // Use traditional XMLHttpRequest instead of fetch or axios
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/auth/register', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
      setLoading(false);
      
      console.log('XHR status:', xhr.status);
      console.log('XHR response:', xhr.responseText);
      
      if (xhr.status >= 200 && xhr.status < 300) {
        // Success
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        // Error
        try {
          const response = JSON.parse(xhr.responseText);
          setError(response.error || `Registration failed with status: ${xhr.status}`);
        } catch (e) {
          setError(`Registration failed with status: ${xhr.status}`);
        }
      }
    };
    
    xhr.onerror = function() {
      console.error('XHR error event triggered');
      setLoading(false);
      setError('Network error - could not connect to server');
    };
    
    // Log what we're sending
    const data = JSON.stringify({
      username,
      email,
      password
    });
    
    console.log('Sending registration data:', { username, email, passwordLength: password.length });
    
    try {
      xhr.send(data);
    } catch (e) {
      console.error('Error sending XHR:', e);
      setLoading(false);
      setError(`Error sending request: ${e.message}`);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Registration successful! Redirecting to login...</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </Form.Group>
            <Form.Group id="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </Form.Group>
            <Form.Group id="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </Form.Group>
            <Form.Group id="password-confirm" className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register; 