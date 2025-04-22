import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RelevantCases = ({ cases }) => {
  return (
    <Card>
      <Card.Header>Relevant Case Law</Card.Header>
      <ListGroup variant="flush">
        {cases.map((caseItem, index) => (
          <ListGroup.Item key={index} action as={Link} to={`/cases/${caseItem.id}`}>
            <div className="fw-bold">{caseItem.case_name}</div>
            <div className="small text-muted">{caseItem.citation}</div>
            <div className="small">{caseItem.summary}</div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default RelevantCases; 