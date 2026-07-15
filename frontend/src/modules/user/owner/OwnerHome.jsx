import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../services/api';
import { Link } from 'react-router-dom';

const OwnerHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ properties: 0, bookings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [propsRes, /* assuming you might need bookings for owner later */] = await Promise.all([
          api.get('/owner/properties')
        ]);
        setStats({
          properties: propsRes.data.length,
          bookings: 0 // Mock for now unless we fetch all bookings for their properties
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <Container className="py-5">
      <h2 className="mb-4">Owner Dashboard - Welcome, {user?.name}!</h2>
      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0 text-center p-4 bg-primary text-white">
            <Card.Body>
              <i className="bi bi-building fs-1 mb-2 d-block"></i>
              <h4>Total Properties</h4>
              <h2>{stats.properties}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0 text-center p-4 bg-success text-white">
            <Card.Body>
              <i className="bi bi-plus-circle fs-1 mb-2 d-block"></i>
              <h4>Add Property</h4>
              <p>List a new property for rent.</p>
              <Link to="/owner/add-property" className="btn btn-light text-success mt-2">Add Now</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0 text-center p-4 bg-info text-white">
            <Card.Body>
              <i className="bi bi-journal-check fs-1 mb-2 d-block"></i>
              <h4>Manage Bookings</h4>
              <p>Approve or reject requests.</p>
              <Link to="/owner/bookings" className="btn btn-light text-info mt-2">View Requests</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OwnerHome;
