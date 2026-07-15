import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to={user ? `/${user.userType === 'Tenant' ? 'renter' : user.userType.toLowerCase()}/dashboard` : "/"}>
          HouseHunt
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user && <Nav.Link as={Link} to="/">Home</Nav.Link>}
            {user?.userType === 'Tenant' && (
              <>
                <Nav.Link as={Link} to="/renter/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/renter/properties">Properties</Nav.Link>
                <Nav.Link as={Link} to="/renter/bookings">My Bookings</Nav.Link>
                <Nav.Link as={Link} to="/chat">Messages</Nav.Link>
              </>
            )}
            {user?.userType === 'Owner' && (
              <>
                <Nav.Link as={Link} to="/owner/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/owner/add-property">Add Property</Nav.Link>
                <Nav.Link as={Link} to="/owner/properties">My Properties</Nav.Link>
                <Nav.Link as={Link} to="/owner/bookings">Bookings</Nav.Link>
                <Nav.Link as={Link} to="/chat">Messages</Nav.Link>
              </>
            )}
            {user?.userType === 'admin' && (
              <>
                <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/admin/approve-owners">Approve</Nav.Link>
                <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
                <Nav.Link as={Link} to="/admin/properties">Properties</Nav.Link>
                <Nav.Link as={Link} to="/admin/bookings">Bookings</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <BootstrapNavbar.Text className="me-3">
                  Signed in as: <strong>{user.name}</strong> ({user.userType})
                </BootstrapNavbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
