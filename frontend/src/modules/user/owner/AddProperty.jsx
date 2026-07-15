import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [rent, setRent] = useState('');
  const [images, setImages] = useState('');
  const [available, setAvailable] = useState(true);
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);

  const availableAmenities = ['WiFi', 'Parking', 'Pool', 'Gym', 'AC', 'Security'];

  const handleAmenityChange = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/owner/properties', {
        title,
        description,
        location,
        rent: Number(rent),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        propertyType,
        amenities,
        images: [images],
        available
      });
      toast.success('Property added successfully');
      navigate('/owner/properties');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h3 className="mb-4 text-center">Add New Property</h3>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Property Type</Form.Label>
                      <Form.Select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} required>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Villa">Villa</option>
                        <option value="Condo">Condo</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rent per month ($)</Form.Label>
                      <Form.Control type="number" value={rent} onChange={(e) => setRent(e.target.value)} required min="1" />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bedrooms</Form.Label>
                      <Form.Control type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} required min="0" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bathrooms</Form.Label>
                      <Form.Control type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} required min="0" />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Amenities</Form.Label>
                  <div>
                    {availableAmenities.map((amenity) => (
                      <Form.Check
                        inline
                        key={amenity}
                        label={amenity}
                        type="checkbox"
                        checked={amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                      />
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Image URL (Optional)</Form.Label>
                  <Form.Control type="text" value={images} onChange={(e) => setImages(e.target.value)} placeholder="https://example.com/image.jpg" />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check 
                    type="switch"
                    id="custom-switch"
                    label="Available immediately?"
                    name="available"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  List Property
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProperty;
