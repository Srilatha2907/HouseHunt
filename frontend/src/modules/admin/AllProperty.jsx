import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Button, Badge } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AllProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const res = await api.get('/admin/properties');
      setProperties(res.data);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property globally?')) {
      try {
        await api.delete(`/admin/properties/${id}`);
        toast.success('Property deleted');
        fetchProperties();
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
      <h2 className="mb-4">Global Property Monitor</h2>
      
      <div className="table-responsive bg-white shadow-sm rounded p-3">
        <Table hover className="align-middle">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Owner</th>
              <th>Rent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(property => (
              <tr key={property._id}>
                <td>{property.title}</td>
                <td>{property.location}</td>
                <td>{property.ownerId?.name || 'Unknown'}</td>
                <td>${property.rent}</td>
                <td>
                  <Badge bg={property.available ? "success" : "danger"}>
                    {property.available ? 'Available' : 'Rented'}
                  </Badge>
                </td>
                <td>
                  <Button 
                    size="sm" 
                    variant="outline-danger" 
                    onClick={() => handleDelete(property._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default AllProperty;
