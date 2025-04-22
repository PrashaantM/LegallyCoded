import React from 'react';
import { Card } from 'react-bootstrap';

const ChatMessage = ({ message }) => {
  const isAI = message.sender === 'ai';

  return (
    <div className={`d-flex ${isAI ? '' : 'justify-content-end'} mb-3`}>
      <Card 
        style={{ 
          maxWidth: '75%',
          backgroundColor: isAI ? '#f0f2f5' : '#0d6efd',
          color: isAI ? '#000' : '#fff',
        }}
      >
        <Card.Body className="py-2 px-3">
          <div style={{ whiteSpace: 'pre-wrap' }}>{message.text}</div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChatMessage; 