import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Spinner, Button, Form } from 'react-bootstrap';
import api from '../../../services/api';
import { toast } from 'react-toastify';

const AllBookings = () => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      // First, fetch properties
      const propsRes = await api.get('/owner/properties');
      setProperties(propsRes.data);

      // Then fetch bookings for each property
      let allBookings = [];
      for (const prop of propsRes.data) {
        const bookRes = await api.get(`/owner/properties/${prop._id}/bookings`);
        
        // Attach property title for display purposes
        const propBookings = bookRes.data.map(b => ({ ...b, propertyTitle: prop.title }));
        allBookings = [...allBookings, ...propBookings];
      }
      
      setBookings(allBookings);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (bookingId, propertyId, status) => {
    try {
      await api.put(`/owner/bookings/${bookingId}/status`, { status });
      toast.success(`Booking successfully ${status}`);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking status');
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
      <h2 className="mb-4">Manage Bookings</h2>
      {bookings.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <i className="bi bi-inbox fs-1"></i>
          <h4 className="mt-3">No booking requests yet.</h4>
        </div>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded p-3">
          <Table hover className="align-middle">
            <thead>
              <tr>
                <th>Date</th>
                <th>Property</th>
                <th>Tenant Name</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td>{booking.propertyTitle}</td>
                  <td>{booking.tenantId?.name || 'Unknown'}</td>
                  <td>{booking.tenantId?.phoneNumber || 'Unknown'}</td>
                  <td>
                    <Badge 
                      bg={
                        booking.status === 'approved' ? 'success' : 
                        booking.status === 'rejected' ? 'danger' : 'warning'
                      }
                    >
                      {booking.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    {booking.status === 'pending' && (
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="success" onClick={() => updateBookingStatus(booking._id, booking.propertyId, 'approved')}>Approve</Button>
                        <Button size="sm" variant="danger" onClick={() => updateBookingStatus(booking._id, booking.propertyId, 'rejected')}>Reject</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default AllBookings;
