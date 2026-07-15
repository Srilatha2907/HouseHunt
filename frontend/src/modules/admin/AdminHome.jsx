import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const AdminHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ users: 0, properties: 0, bookings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, propsRes, bookingsRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/properties'),
          api.get('/admin/bookings')
        ]);
        
        setStats({
          users: usersRes.data.length,
          properties: propsRes.data.length,
          bookings: bookingsRes.data.length
        });
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <Container className="py-5">
      <h2 className="mb-4">Admin Dashboard - Welcome, {user?.name}!</h2>
      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0 text-center p-4 bg-primary text-white">
            <Card.Body>
              <i className="bi bi-people fs-1 mb-2 d-block"></i>
              <h4>Total Users</h4>
              <h2>{stats.users}</h2>
              <Link to="/admin/users" className="btn btn-light text-primary mt-2">Manage Users</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0 text-center p-4 bg-success text-white">
            <Card.Body>
              <i className="bi bi-building fs-1 mb-2 d-block"></i>
              <h4>Total Properties</h4>
              <h2>{stats.properties}</h2>
              <Link to="/admin/properties" className="btn btn-light text-success mt-2">Manage Properties</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0 text-center p-4 bg-info text-white">
            <Card.Body>
              <i className="bi bi-journal-text fs-1 mb-2 d-block"></i>
              <h4>Total Bookings</h4>
              <h2>{stats.bookings}</h2>
              <Link to="/admin/bookings" className="btn btn-light text-info mt-2">View Bookings</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm border-0 text-center p-4 bg-warning text-dark">
            <Card.Body>
              <i className="bi bi-person-badge fs-1 mb-2 d-block"></i>
              <h4>Pending Owners</h4>
              <h2>Approve</h2>
              <Link to="/admin/approve-owners" className="btn btn-light text-warning mt-2">Review</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminHome;
