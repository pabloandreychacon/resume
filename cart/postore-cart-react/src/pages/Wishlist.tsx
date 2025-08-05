import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

const Wishlist: React.FC = () => {
  const { state, removeFromWishlist, addToCart } = useGlobalContext();
  const wishlistItems = state.wishlist;

  const handleAddToCart = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h1 className="display-4 fw-bold mb-4">Your Wishlist</h1>
          <Alert variant="info">
            Your wishlist is empty. <Link to="/#products">Start shopping</Link>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="display-4 fw-bold mb-5">Your Wishlist</h1>

      <Row className="g-4">
        {wishlistItems.map((item) => (
          <Col key={item.product.id} lg={4} md={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Img
                variant="top"
                src={item.product.imageUrl}
                alt={item.product.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="h6 mb-2">{item.product.name}</Card.Title>
                <Card.Text className="text-muted small mb-3">
                  {item.product.description}
                </Card.Text>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="h5 mb-0">${item.product.price.toFixed(2)}</span>
                    <small className="text-muted">
                      Added: {item.addedAt.toLocaleDateString()}
                    </small>
                  </div>
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddToCart(item.product)}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFromWishlist(item.product.id)}
                    >
                      Remove from Wishlist
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-5">
        <Button as={Link} to="/#products" variant="outline-primary">
          Continue Shopping
        </Button>
      </div>
    </Container>
  );
};

export default Wishlist;