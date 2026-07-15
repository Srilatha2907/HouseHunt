import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer mt-auto">
      <Container className="text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} HouseHunt. All rights reserved.</p>
        <small className="text-muted">Find your perfect home with us.</small>
      </Container>
    </footer>
  );
};

export default Footer;
