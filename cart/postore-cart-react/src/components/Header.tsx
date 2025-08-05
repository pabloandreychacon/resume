import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge, Offcanvas } from 'react-bootstrap';
import { useGlobalContext } from '../context/GlobalContext';
import CartOffcanvas from './CartOffcanvas';
import WishlistOffcanvas from './WishlistOffcanvas';

const Header: React.FC = () => {
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { state, getCartItemCount, toggleDarkMode } = useGlobalContext();
  const location = useLocation();

  const cartItemCount = getCartItemCount();
  const wishlistCount = state.wishlist.length;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <>
      <Navbar
        bg="light"
        expand="lg"
        className="shadow-sm"
        variant={state.darkMode ? 'dark' : 'light'}
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            {state.BusinessName}
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/"
                className={isActive('/') ? 'active' : ''}
                onClick={handleNavClick}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about"
                className={isActive('/about') ? 'active' : ''}
                onClick={handleNavClick}
              >
                About
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact"
                className={isActive('/contact') ? 'active' : ''}
                onClick={handleNavClick}
              >
                Contact
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/support"
                className={isActive('/support') ? 'active' : ''}
                onClick={handleNavClick}
              >
                Support
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/faq"
                className={isActive('/faq') ? 'active' : ''}
                onClick={handleNavClick}
              >
                FAQ
              </Nav.Link>
            </Nav>

            <Nav className="ms-auto">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={toggleDarkMode}
                className="me-2"
              >
                <i className={`bi bi-${state.darkMode ? 'sun' : 'moon'}`}></i>
              </Button>

              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowWishlist(true)}
                className="me-2 position-relative"
              >
                <i className="bi bi-heart"></i>
                {wishlistCount > 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.6rem' }}
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Button>

              <Button
                variant="outline-success"
                size="sm"
                onClick={() => setShowCart(true)}
                className="position-relative"
              >
                <i className="bi bi-cart3"></i>
                {cartItemCount > 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.6rem' }}
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Cart Offcanvas */}
      <CartOffcanvas
        show={showCart}
        onHide={() => setShowCart(false)}
      />

      {/* Wishlist Offcanvas */}
      <WishlistOffcanvas
        show={showWishlist}
        onHide={() => setShowWishlist(false)}
      />
    </>
  );
};

export default Header; 