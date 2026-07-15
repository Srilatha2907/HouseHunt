import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Button, Badge } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ApproveOwners = () => {
  const [pendingOwners, setPendingOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingOwners = async () => {
    try {
      const res = await api.get('/admin/owners/pending');
      setPendingOwners(res.data);
    } catch (error) {
      toast.error('Failed to load pending owners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOwners();
  }, []);

  const handleUpdateStatus = async (id, isApprovedOwner) => {
    if (window.confirm(`Are you sure you want to ${isApprovedOwner ? 'approve' : 'reject'} this owner?`)) {
      try {
        await api.put(`/admin/owners/${id}/status`, { isApprovedOwner });
        toast.success(`Owner successfully ${isApprovedOwner ? 'approved' : 'rejected'}`);
        fetchPendingOwners();
      } catch (error) {
        toast.error(`Failed to update owner status`);
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
      <h2 className="mb-4">Pending Owner Approvals</h2>

      {pendingOwners.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <i className="bi bi-check-circle fs-1 text-success"></i>
          <h4 className="mt-3">All caught up! No pending applications.</h4>
        </div>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded p-3">
          <Table hover className="align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Applied Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingOwners.map(owner => (
                <tr key={owner._id}>
                  <td>{owner.name}</td>
                  <td>{owner.email}</td>
                  <td>{owner.phone}</td>
                  <td>{new Date(owner.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="success" size="sm" className="me-2" onClick={() => handleUpdateStatus(owner._id, true)}>
                        <i className="bi bi-check-circle me-1"></i>Approve
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleUpdateStatus(owner._id, false)}>
                        <i className="bi bi-x-circle me-1"></i>Reject
                      </Button>
                    </div>
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

export default ApproveOwners;
