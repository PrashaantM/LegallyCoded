import React, { useState, useRef, useEffect, useContext } from 'react';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import ChatMessage from './ChatMessage';
import RelevantCases from './RelevantCases';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm LexiAI, your legal assistant. How can I help you today?", 
      sender: 'ai' 
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [relevantCases, setRelevantCases] = useState([]);
  
  const { currentUser } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentMessage.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      text: currentMessage,
      sender: 'user'
    };
    
    setMessages([...messages, userMessage]);
    setCurrentMessage('');
    setLoading(true);
    
    try {
      // Send query to API
      const response = await axios.post('/api/search/query', {
        query: currentMessage,
        user_id: currentUser?.user_id
      });
      
      // Add AI response to chat
      const aiMessage = {
        id: messages.length + 2,
        text: response.data.answer,
        sender: 'ai'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update relevant cases
      if (response.data.relevant_cases && response.data.relevant_cases.length > 0) {
        setRelevantCases(response.data.relevant_cases);
      }
    } catch (error) {
      console.error('Error querying AI:', error);
      
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm sorry, I encountered an error processing your request. Please try again.",
        sender: 'ai'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <Card className="chat-container" style={{ height: '60vh', overflowY: 'auto' }}>
          <Card.Body>
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {loading && (
              <div className="text-center my-2">
                <Spinner animation="border" variant="primary" size="sm" />
                <span className="ms-2">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </Card.Body>
        </Card>
        
        <Form onSubmit={handleSubmit} className="mt-3">
          <div className="d-flex">
            <Form.Control
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your legal question here..."
              disabled={loading}
            />
            <Button 
              variant="primary" 
              type="submit" 
              className="ms-2" 
              disabled={loading || !currentMessage.trim()}
            >
              <FaPaperPlane />
            </Button>
          </div>
        </Form>
      </div>
      
      {relevantCases.length > 0 && (
        <div className="ms-3" style={{ width: '30%' }}>
          <RelevantCases cases={relevantCases} />
        </div>
      )}
    </div>
  );
};

export default ChatInterface; 