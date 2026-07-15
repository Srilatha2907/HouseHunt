import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex flex-grow-1">
      {/* Sidebar */}
      <div className="bg-dark text-white p-4" style={{ width: '250px' }}>
        <h5 className="mb-4 text-center border-bottom pb-2">Admin Panel</h5>
        <Nav className="flex-column gap-2">
          <Nav.Link as={Link} to="/admin/dashboard" className="text-white bg-secondary bg-opacity-25 rounded px-3 py-2">
            <i className="bi bi-speedometer2 me-2"></i>Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/users" className="text-white bg-secondary bg-opacity-25 rounded px-3 py-2">
            <i className="bi bi-people me-2"></i>Users
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/properties" className="text-white bg-secondary bg-opacity-25 rounded px-3 py-2">
            <i className="bi bi-building me-2"></i>Properties
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/bookings" className="text-white bg-secondary bg-opacity-25 rounded px-3 py-2">
            <i className="bi bi-journal-text me-2"></i>Bookings
          </Nav.Link>
        </Nav>
      </div>
      {/* Main Content */}
      <div className="flex-grow-1 bg-light overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
