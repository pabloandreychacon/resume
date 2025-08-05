import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

const Cart: React.FC = () => {
  const { state, removeFromCart, updateCartQuantity, getCartTotal, clearCart } = useGlobalContext();
  const cartItems = state.cart;
  const cartTotal = getCartTotal();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h1 className="display-4 fw-bold mb-4">Your Cart</h1>
          <Alert variant="info">
            Your cart is empty. <Link to="/#products">Start shopping</Link>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="display-4 fw-bold mb-5">Your Cart</h1>

      <Row>
        <Col lg={8}>
          {cartItems.map((item) => (
            <Card key={item.product.id} className="mb-3 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  className="me-3"
                />
                <div className="flex-grow-1">
                  <h5 className="mb-2">{item.product.name}</h5>
                  <p className="text-muted mb-2">{item.product.description}</p>
                  <div className="d-flex align-items-center">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <Badge bg="secondary" className="mx-3">
                      {item.quantity}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <span className="ms-3 h5 mb-0">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </Card.Body>
            </Card>
          ))}

          <div className="d-flex justify-content-between mt-4">
            <Button variant="outline-secondary" onClick={clearCart}>
              Clear Cart
            </Button>
            <Button as={Link} to="/#products" variant="outline-primary">
              Continue Shopping
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow">
            <Card.Body className="p-4">
              <h4 className="mb-4">Order Summary</h4>

              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span>Free</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <strong>Total:</strong>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>

              <div className="d-grid gap-2">
                <Button as={Link} to="/checkout" variant="success" size="lg">
                  Proceed to Checkout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;