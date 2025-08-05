import React from 'react';
import { Offcanvas, Button, ListGroup, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

interface WishlistOffcanvasProps {
  show: boolean;
  onHide: () => void;
}

const WishlistOffcanvas: React.FC<WishlistOffcanvasProps> = ({ show, onHide }) => {
  const { state, removeFromWishlist, addToCart } = useGlobalContext();
  const wishlistItems = state.wishlist;

  const handleAddToCart = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Wishlist</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {wishlistItems.length === 0 ? (
          <Alert variant="info">
            Your wishlist is empty. <Link to="/#products">Start shopping</Link>
          </Alert>
        ) : (
          <>
            <ListGroup className="mb-3">
              {wishlistItems.map((item) => (
                <ListGroup.Item key={item.product.id} className="d-flex align-items-center">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    className="me-3"
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.product.name}</h6>
                    <p className="mb-1 text-muted">${item.product.price.toFixed(2)}</p>
                    <small className="text-muted">
                      Added: {item.addedAt.toLocaleDateString()}
                    </small>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <Button
                      size="sm"
                      variant="outline-success"
                      onClick={() => handleAddToCart(item.product)}
                    >
                      <i className="bi bi-cart-plus"></i>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => removeFromWishlist(item.product.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>

            <div className="d-grid">
              <Button as={Link} to="/wishlist" variant="primary" onClick={onHide}>
                View Wishlist
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default WishlistOffcanvas;