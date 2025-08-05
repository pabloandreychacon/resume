import React from 'react';
import { Offcanvas, Button, ListGroup, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

interface CartOffcanvasProps {
  show: boolean;
  onHide: () => void;
}

const CartOffcanvas: React.FC<CartOffcanvasProps> = ({ show, onHide }) => {
  const { state, removeFromCart, updateCartQuantity, getCartTotal } = useGlobalContext();
  const cartItems = state.cart;
  const cartTotal = getCartTotal();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cartItems.length === 0 ? (
          <Alert variant="info">
            Your cart is empty. <Link to="/#products">Start shopping</Link>
          </Alert>
        ) : (
          <>
            <ListGroup className="mb-3">
              {cartItems.map((item) => (
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
                    <div className="d-flex align-items-center">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <Badge bg="secondary" className="mx-2">
                        {item.quantity}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        className="ms-auto"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between mb-3">
                <h5>Total:</h5>
                <h5>${cartTotal.toFixed(2)}</h5>
              </div>

              <div className="d-grid gap-2">
                <Button as={Link} to="/cart" variant="primary" onClick={onHide}>
                  View Cart
                </Button>
                <Button as={Link} to="/checkout" variant="success" onClick={onHide}>
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartOffcanvas;