import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Breadcrumb, Modal, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useGlobalContext } from '../context/GlobalContext';
import { supabaseHelpers } from '../lib/supabase';
import { sendEmail } from '../lib/emailjs';

interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  estimatedDays: string;
}

const Checkout: React.FC = () => {
  const { state, getCartTotal, clearCart, updateCartQuantity, removeFromCart } = useGlobalContext();
  const navigate = useNavigate();
  const [selectedShipping, setSelectedShipping] = useState<string>('standard');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [error, setError] = useState('');

  const cartItems = state.cart;
  const cartTotal = getCartTotal();
  const shippingMethods: ShippingMethod[] = [
    { id: 'standard', name: 'Standard Shipping', cost: 5.99, estimatedDays: '3-5 business days' },
    { id: 'express', name: 'Express Shipping', cost: 12.99, estimatedDays: '1-2 business days' },
    { id: 'overnight', name: 'Overnight Shipping', cost: 24.99, estimatedDays: 'Next business day' }
  ];

  const selectedShippingMethod = shippingMethods.find(method => method.id === selectedShipping);
  const shippingCost = selectedShippingMethod?.cost || 0;
  const tax = (cartTotal + shippingCost) * 0.08; // 8% tax
  const total = cartTotal + shippingCost + tax;

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
  };

  const handlePayPalApprove = async (data: any, actions: any) => {
    try {
      const orderData = await actions.order.capture();

      // Generate order number
      const orderNum = "PP-" + Date.now().toString().slice(-8);
      setOrderNumber(orderNum);

      // Get shipping method details
      const shippingMethod = selectedShippingMethod?.name || 'Standard Shipping';

      // Get shipping address from PayPal
      const shippingAddress = orderData.purchase_units[0].shipping?.address || {};
      const addressStr = shippingAddress.address_line_1
        ? `${shippingAddress.address_line_1}, ${shippingAddress.admin_area_2 || ""}, ${shippingAddress.admin_area_1 || ""}, ${shippingAddress.postal_code || ""}, ${shippingAddress.country_code || ""}`
        : "Store Pickup";

      // Get customer info
      const customerName = orderData.payer?.name?.given_name + " " + orderData.payer?.name?.surname || "Customer";
      const customerEmail = orderData.payer?.email_address || "customer@example.com";

      // Prepare items list for email
      let itemsList = "";
      cartItems.forEach((item) => {
        itemsList += `${item.product.name} - $${item.product.price.toFixed(2)} x ${item.quantity}\n`;
      });

      // Send confirmation email
      await sendEmail({
        to_email: "pabloandreychacon@gmail.com",
        from_email: customerEmail,
        message: `
          Order Number: ${orderNum}\n\n
          Customer: ${customerName}\n
          Email: ${customerEmail}\n\n
          Shipping Method: ${shippingMethod}\n
          Shipping Address: ${addressStr}\n\n
          Items:\n${itemsList}\n
          Subtotal: $${cartTotal.toFixed(2)}\n
          Shipping: $${shippingCost.toFixed(2)}\n
          Tax: $${tax.toFixed(2)}\n
          Total: $${total.toFixed(2)}
        `
      });

      // Save order to Supabase
      await supabaseHelpers.createOrder({
        TotalAmount: total,
        StatusId: 1,
        PaymentOrderId: orderNum,
        Currency: "USD",
        ShippingAddress: addressStr,
        BillingAddress: addressStr,
        ShippingMethod: shippingMethod,
        TrackingNumber: null,
        EstimatedDeliveryDate: null,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        BuyerEmail: customerEmail,
        BusinessEmail: state.Email,
      });

      // Clear cart
      clearCart();

      // Show success modal
      setShowSuccessModal(true);

    } catch (error) {
      console.error("PayPal error:", error);
      setError("There was an error processing your payment. Please try again.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h1 className="display-4 fw-bold mb-4">Checkout</h1>
          <Alert variant="info">
            Your cart is empty. <Link to="/#products">Start shopping</Link>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* Page Header */}
      <section className="bg-primary text-white py-5 mt-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold">Checkout</h1>
              <p className="lead">Complete your purchase securely with PayPal.</p>
            </Col>
            <Col lg={4} className="text-lg-end">
              <Breadcrumb className="justify-content-lg-end mb-0">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }} className="breadcrumb-link">
                  Home
                </Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/cart" }} className="breadcrumb-link">
                  Cart
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="text-white">
                  Checkout
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Checkout Content */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8}>
              {/* Cart Items */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white">
                  <h5 className="mb-0"><i className="bi bi-cart me-2"></i>Your Items</h5>
                </Card.Header>
                <Card.Body>
                  {cartItems.map((item) => (
                    <Card key={item.product.id} className="mb-3 cart-item">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                width="50"
                                height="50"
                                className="rounded"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">{item.product.name}</h6>
                              <p className="text-muted mb-0">${item.product.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="input-group input-group-sm" style={{ width: '120px' }}>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </Button>
                              <Form.Control
                                type="text"
                                className="text-center item-qty"
                                value={item.quantity}
                                readOnly
                                style={{ width: '50px' }}
                              />
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="ms-2"
                              onClick={() => handleRemoveItem(item.product.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </Card.Body>
              </Card>

              {/* PayPal Info Notice */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-info-circle me-2"></i>Payment Information
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Alert variant="info" className="mb-0">
                    <i className="bi bi-paypal me-2"></i>
                    Your shipping and billing information will be collected securely
                    through PayPal during checkout. You can pay with PayPal or
                    credit/debit card.
                  </Alert>
                </Card.Body>
              </Card>

              {/* Shipping Method */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-truck me-2"></i>Shipping Method
                  </h5>
                </Card.Header>
                <Card.Body>
                  {shippingMethods.map((method) => (
                    <div key={method.id} className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="shipping"
                        id={method.id}
                        value={method.id}
                        checked={selectedShipping === method.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor={method.id}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{method.name}</strong>
                            <br />
                            <small className="text-muted">{method.estimatedDays}</small>
                          </div>
                          <span className="fw-bold">${method.cost.toFixed(2)}</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Order Summary */}
              <Card className="border-0 shadow">
                <Card.Body className="p-4">
                  <h4 className="mb-4">Order Summary</h4>

                  {cartItems.map((item) => (
                    <div key={item.product.id} className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 className="mb-0">{item.product.name}</h6>
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <hr />

                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span id="subtotal">${cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span id="shippingCost">${shippingCost.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Tax:</span>
                    <span id="tax">${tax.toFixed(2)}</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-4">
                    <strong>Total:</strong>
                    <strong id="total">${total.toFixed(2)}</strong>
                  </div>

                  {error && (
                    <Alert variant="danger" className="mb-3">
                      {error}
                    </Alert>
                  )}

                  {/* PayPal Button */}
                  <div id="paypal-button-container">
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: total.toFixed(2),
                                currency_code: "USD",
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={handlePayPalApprove}
                      style={{ layout: "vertical" }}
                    />
                  </div>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      <i className="bi bi-shield-check me-1"></i>
                      Secure checkout powered by PayPal
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Body className="text-center py-5">
          <i className="bi bi-check-circle-fill text-success display-1 mb-3"></i>
          <h3 className="mb-3">Order Placed Successfully!</h3>
          <p className="text-muted mb-4">
            Thank you for your purchase. You will receive a confirmation email
            shortly.
          </p>
          <div className="mb-4">
            <strong>Order Number: {orderNumber}</strong>
          </div>
          <Button as={Link} to="/#products" variant="primary">
            Continue Shopping
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Checkout;