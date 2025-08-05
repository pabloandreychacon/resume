import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

const Footer: React.FC = () => {
  const { state } = useGlobalContext();

  return (
    <footer className={`${state.darkMode ? 'bg-dark' : 'bg-light'} ${state.darkMode ? 'text-light' : 'text-dark'} py-5 mt-5`}>
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5>{state.BusinessName}</h5>
            <p className="text-muted">
              Discover premium products at unbeatable prices. Shop the latest trends with our curated collection of high-quality items.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light">
                <i className="bi bi-facebook fs-4"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-twitter fs-4"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-instagram fs-4"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-linkedin fs-4"></i>
              </a>
            </div>
          </Col>

          <Col md={2} className="mb-4">
            <h6>Quick Links</h6>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" className="text-muted p-0 mb-2">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="text-muted p-0 mb-2">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="text-muted p-0 mb-2">
                Contact
              </Nav.Link>
              <Nav.Link as={Link} to="/support" className="text-muted p-0 mb-2">
                Support
              </Nav.Link>
            </Nav>
          </Col>

          <Col md={2} className="mb-4">
            <h6>Customer Service</h6>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/faq" className="text-muted p-0 mb-2">
                FAQ
              </Nav.Link>
              <Nav.Link as={Link} to="/support" className="text-muted p-0 mb-2">
                Help Center
              </Nav.Link>
              <Nav.Link href="#" className="text-muted p-0 mb-2">
                Returns
              </Nav.Link>
              <Nav.Link href="#" className="text-muted p-0 mb-2">
                Shipping Info
              </Nav.Link>
            </Nav>
          </Col>

          <Col md={4} className="mb-4">
            <h6>Contact Information</h6>
            <div className="text-muted">
              <p className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                {state.Address}
              </p>
              <p className="mb-2">
                <i className="bi bi-telephone me-2"></i>
                <a href={`tel:${state.Phone.replace(/\D/g, '')}`} className="text-muted text-decoration-none">
                  {state.Phone}
                </a>
              </p>
              <p className="mb-2">
                <i className="bi bi-envelope me-2"></i>
                <a href={`mailto:${state.Email}`} className="text-muted text-decoration-none">
                  {state.Email}
                </a>
              </p>
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-muted mb-0">
              © 2024 {state.BusinessName}. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <Nav className="justify-content-md-end">
              <Nav.Link href="#" className="text-muted p-0 me-3">
                Privacy Policy
              </Nav.Link>
              <Nav.Link href="#" className="text-muted p-0 me-3">
                Terms of Service
              </Nav.Link>
              <Nav.Link href="#" className="text-muted p-0">
                Cookie Policy
              </Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 