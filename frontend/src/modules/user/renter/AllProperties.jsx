import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Form, Button, Card, Badge } from 'react-bootstrap';
import AllPropertiesCards from '../../../components/AllPropertiesCards';
import api from '../../../services/api';
import { toast } from 'react-toastify';

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [location, setLocation] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const availableAmenities = ['WiFi', 'Parking', 'Pool', 'Gym', 'AC', 'Security'];

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (minRent) params.append('minRent', minRent);
      if (maxRent) params.append('maxRent', maxRent);
      if (propertyType && propertyType !== 'All') params.append('propertyType', propertyType);
      if (selectedAmenities.length > 0) params.append('amenities', selectedAmenities.join(','));

      const res = await api.get(`/tenant/properties?${params.toString()}`);
      setProperties(res.data);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line
  }, []);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleClearFilters = () => {
    setLocation('');
    setMinRent('');
    setMaxRent('');
    setPropertyType('All');
    setSelectedAmenities([]);
    // We don't fetch here, user must click apply or we can fetch immediately. Let's fetch immediately.
    setTimeout(() => {
      // The state updates might not be batched yet, so a simple reload of everything without params works
      api.get('/tenant/properties').then(res => {
        setProperties(res.data);
      });
    }, 0);
  };

  const handleAmenityToggle = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      <Container>
        <Row>
          {/* Advanced Filters Sidebar */}
          <Col md={3} className="mb-4">
            <Card className="shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
              <Card.Header className="bg-primary text-white border-0 py-3">
                <h5 className="mb-0"><i className="bi bi-funnel-fill me-2"></i>Filters</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleApplyFilters}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Location</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g. New York, Downtown" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Rent Range ($)</Form.Label>
                    <Row className="g-2">
                      <Col>
                        <Form.Control 
                          type="number" 
                          placeholder="Min" 
                          value={minRent}
                          onChange={(e) => setMinRent(e.target.value)}
                        />
                      </Col>
                      <Col>
                        <Form.Control 
                          type="number" 
                          placeholder="Max" 
                          value={maxRent}
                          onChange={(e) => setMaxRent(e.target.value)}
                        />
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Property Type</Form.Label>
                    <Form.Select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                      <option value="All">All Types</option>
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="Condo">Condo</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Amenities</Form.Label>
                    <div>
                      {availableAmenities.map(amenity => (
                        <Form.Check 
                          key={amenity}
                          type="checkbox"
                          label={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="mb-1"
                        />
                      ))}
                    </div>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">
                      Apply Filters
                    </Button>
                    <Button variant="outline-secondary" onClick={handleClearFilters}>
                      Clear All
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Property Listings */}
          <Col md={9}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Available Properties</h2>
              <Badge bg="info" className="fs-6 py-2 px-3 rounded-pill shadow-sm">
                {properties.length} Results
              </Badge>
            </div>

            {loading ? (
              <div className="text-center py-5 mt-5">
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                <p className="mt-3 text-muted">Searching for properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <Card className="text-center py-5 border-0 shadow-sm mt-4">
                <Card.Body>
                  <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                  <h4>No properties found!</h4>
                  <p className="text-muted">Try adjusting your search filters to find what you're looking for.</p>
                  <Button variant="primary" onClick={handleClearFilters}>Clear Filters</Button>
                </Card.Body>
              </Card>
            ) : (
              <Row className="g-4">
                {properties.map(property => (
                  <Col lg={4} md={6} key={property._id}>
                    <AllPropertiesCards property={property} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default AllProperties;
