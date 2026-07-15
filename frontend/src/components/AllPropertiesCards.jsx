import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AllPropertiesCards = ({ property }) => {
  const navigate = useNavigate();
  
  // Provide a placeholder if no image exists
  const imgUrl = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://via.placeholder.com/400x250?text=No+Image+Available';

  return (
    <Card className="h-100 card-hover shadow-sm border-0">
      <Card.Img variant="top" src={imgUrl} style={{ height: '200px', objectFit: 'cover' }} />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between mb-2">
          <Badge bg={property.available ? "success" : "danger"}>
            {property.available ? 'Available' : 'Rented'}
          </Badge>
          <Badge bg="primary">${property.rent}/month</Badge>
        </div>
        <Card.Title className="text-truncate">{property.title}</Card.Title>
        <Card.Text className="text-muted small mb-3">
          <i className="bi bi-geo-alt-fill me-1"></i> {property.location}
        </Card.Text>
        
        <div className="d-flex justify-content-between mb-3 text-muted small">
          <span><i className="bi bi-door-closed"></i> {property.bedrooms} Beds</span>
          <span><i className="bi bi-droplet"></i> {property.bathrooms} Baths</span>
        </div>

        <Button 
          variant="outline-primary" 
          className="mt-auto w-100"
          onClick={() => navigate(`/renter/properties/${property._id}`)}
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default AllPropertiesCards;
