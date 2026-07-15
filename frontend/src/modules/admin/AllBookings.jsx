import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Badge } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/admin/bookings');
        setBookings(res.data);
      } catch (error) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Global Booking Records</h2>
      
      <div className="table-responsive bg-white shadow-sm rounded p-3">
        <Table hover className="align-middle">
          <thead>
            <tr>
              <th>Date</th>
              <th>Property</th>
              <th>Tenant</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td>{booking.propertyId?.title || 'Unknown Property'}</td>
                <td>{booking.tenantId?.name || 'Unknown'}</td>
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
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default AllBookings;
