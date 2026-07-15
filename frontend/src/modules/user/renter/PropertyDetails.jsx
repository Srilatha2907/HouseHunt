import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { toast } from 'react-toastify';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/tenant/properties/${id}`);
        setProperty(res.data);
      } catch (error) {
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleBook = async () => {
    setBooking(true);
    try {
      await api.post('/tenant/bookings', { propertyId: property._id });
      toast.success('Property booked successfully!');
      navigate('/renter/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book property');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!property) return <Container className="py-5">Property not found.</Container>;

  const imgUrl = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://via.placeholder.com/800x400?text=No+Image';

  return (
    <Container className="py-5">
      <Card className="border-0 shadow-sm">
        <Card.Img variant="top" src={imgUrl} style={{ height: '400px', objectFit: 'cover' }} />
        <Card.Body className="p-4">
          <Row>
            <Col md={8}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2>{property.title}</h2>
                <Badge bg="primary" className="fs-5">${property.rent}/month</Badge>
              </div>
              <p className="text-muted fs-5"><i className="bi bi-geo-alt-fill text-danger"></i> {property.location}</p>
              
              <h5 className="mt-4">Description</h5>
              <p>{property.description}</p>

              <Row className="mt-4 text-center g-3">
                <Col><div className="p-3 bg-light rounded"><i className="bi bi-door-closed fs-3 d-block text-primary"></i>{property.bedrooms} Bedrooms</div></Col>
                <Col><div className="p-3 bg-light rounded"><i className="bi bi-droplet fs-3 d-block text-info"></i>{property.bathrooms} Bathrooms</div></Col>
              </Row>
            </Col>
            <Col md={4}>
              <Card className="border bg-light">
                <Card.Body>
                  <h4>Owner Contact</h4>
                  {property.ownerId ? (
                    <>
                      <p className="mb-1"><i className="bi bi-person-fill me-2"></i>{property.ownerId.name}</p>
                      <p className="mb-1"><i className="bi bi-envelope-fill me-2"></i>{property.ownerId.email}</p>
                      <p className="mb-3"><i className="bi bi-telephone-fill me-2"></i>{property.ownerId.phoneNumber}</p>
                    </>
                  ) : (
                    <p>Details hidden.</p>
                  )}
                  
                  <hr />
                  <div className="d-grid gap-2">
                    <Button 
                      variant="success" 
                      size="lg" 
                      onClick={handleBook}
                      disabled={booking || !property.available}
                    >
                      {booking ? <Spinner size="sm" /> : (property.available ? 'Book Now' : 'Not Available')}
                    </Button>
                    <Button 
                      variant="outline-primary"
                      onClick={() => navigate('/chat', { state: { ownerId: property.ownerId } })}
                    >
                      <i className="bi bi-chat-dots-fill me-2"></i> Chat with Owner
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PropertyDetails;
