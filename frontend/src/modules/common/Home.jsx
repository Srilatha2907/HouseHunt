import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <h1>Find Your Perfect Home</h1>
          <p className="lead mb-4">Discover the best properties to rent in your favorite locations.</p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/register" variant="primary" size="lg">Get Started</Button>
            <Button as={Link} to="/login" variant="outline-light" size="lg">Login</Button>
          </div>
        </Container>
      </div>

      {/* Featured Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5">Why Choose HouseHunt?</h2>
        <Row className="g-4 text-center">
          <Col md={4}>
            <div className="p-4 shadow-sm bg-white rounded h-100">
              <i className="bi bi-house-door text-primary fs-1 mb-3"></i>
              <h4>Vast Selection</h4>
              <p className="text-muted">Thousands of properties updated daily to ensure you find the perfect match.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-4 shadow-sm bg-white rounded h-100">
              <i className="bi bi-shield-check text-primary fs-1 mb-3"></i>
              <h4>Secure Bookings</h4>
              <p className="text-muted">Your transactions and personal details are protected with enterprise-grade security.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-4 shadow-sm bg-white rounded h-100">
              <i className="bi bi-headset text-primary fs-1 mb-3"></i>
              <h4>24/7 Support</h4>
              <p className="text-muted">Our dedicated team is here around the clock to help you with any issues.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
