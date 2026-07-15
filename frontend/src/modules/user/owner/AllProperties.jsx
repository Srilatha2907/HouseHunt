import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Button, Modal, Form } from 'react-bootstrap';
import AllPropertiesCards from '../../../components/AllPropertiesCards';
import api from '../../../services/api';
import { toast } from 'react-toastify';

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const res = await api.get('/owner/properties');
      setProperties(res.data);
    } catch (error) {
      toast.error('Failed to load your properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`/owner/properties/${id}`);
        toast.success('Property deleted');
        fetchProperties(); // Refresh list
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Properties</h2>
        <Button href="/owner/add-property" variant="success">Add New</Button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <i className="bi bi-building-x fs-1"></i>
          <h4 className="mt-3">You haven't listed any properties yet.</h4>
        </div>
      ) : (
        <Row className="g-4">
          {properties.map(property => (
            <Col md={4} key={property._id}>
              <div className="position-relative">
                <AllPropertiesCards property={property} />
                <Button 
                  variant="danger" 
                  size="sm" 
                  className="position-absolute top-0 end-0 m-2 rounded-circle"
                  onClick={() => handleDelete(property._id)}
                  title="Delete Property"
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AllProperties;
