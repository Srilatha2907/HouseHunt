import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Spinner } from 'react-bootstrap';
import api from '../../../services/api';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/tenant/bookings');
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
      <h2 className="mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <i className="bi bi-journal-x fs-1"></i>
          <h4 className="mt-3">You have no bookings yet.</h4>
        </div>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded p-3">
          <Table hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Property</th>
                <th>Location</th>
                <th>Rent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td>{booking.propertyId?.title || 'Unknown Property'}</td>
                  <td>{booking.propertyId?.location || 'Unknown'}</td>
                  <td>${booking.propertyId?.rent || 0}</td>
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
      )}
    </Container>
  );
};

export default MyBookings;
