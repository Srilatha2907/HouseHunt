import React, { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { AuthContext } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';

const RenterHome = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container className="py-5">
      <h2 className="mb-4">Welcome back, {user?.name}!</h2>
      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm border-0 text-center p-4">
            <Card.Body>
              <i className="bi bi-search text-primary" style={{ fontSize: '3rem' }}></i>
              <h4 className="mt-3">Find a Home</h4>
              <p className="text-muted">Browse through our wide selection of properties.</p>
              <Link to="/renter/properties" className="btn btn-primary mt-2">Browse Properties</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm border-0 text-center p-4">
            <Card.Body>
              <i className="bi bi-calendar-check text-success" style={{ fontSize: '3rem' }}></i>
              <h4 className="mt-3">My Bookings</h4>
              <p className="text-muted">View and manage your current property bookings.</p>
              <Link to="/renter/bookings" className="btn btn-outline-success mt-2">View Bookings</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RenterHome;
