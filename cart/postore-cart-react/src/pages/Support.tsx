import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { emailjsHelpers } from '../lib/emailjs';
import { SupportTicket } from '../types';

const Support: React.FC = () => {
  const { state } = useGlobalContext();
  const [formData, setFormData] = useState<SupportTicket>({
    from_name: '',
    from_email: '',
    order_number: '',
    issue_type: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await emailjsHelpers.sendSupportTicket(formData);
      setSuccess(true);
      setFormData({
        from_name: '',
        from_email: '',
        order_number: '',
        issue_type: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('Failed to submit support ticket. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Page Header */}
      <section className="bg-primary text-white py-5 mt-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold">Customer Support</h1>
              <p className="lead">We're here to help with any issues or questions you may have.</p>
            </Col>
            <Col lg={4} className="text-lg-end">
              <Breadcrumb className="justify-content-lg-end mb-0">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }} className="breadcrumb-link">
                  Home
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="text-white">
                  Support
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Support Options */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon bg-primary text-white mb-4">
                    <i className="bi bi-envelope fs-2"></i>
                  </div>
                  <h3 className="h4 mb-3">Email Support</h3>
                  <p className="text-muted mb-4">Send us an email and we'll get back to you within 24 hours.</p>
                  <Button as={Link} to="/contact" variant="outline-primary">
                    Contact Form
                  </Button>
                  <p className="small text-muted mt-2">{state.Email}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon bg-primary text-white mb-4">
                    <i className="bi bi-telephone fs-2"></i>
                  </div>
                  <h3 className="h4 mb-3">Phone Support</h3>
                  <p className="text-muted mb-4">Call us directly for urgent matters or complex issues.</p>
                  <Button
                    href={`tel:${state.Phone.replace(/\D/g, '')}`}
                    variant="outline-primary"
                  >
                    {state.Phone}
                  </Button>
                  <p className="small text-muted mt-2">Mon-Fri: 9am-6pm EST</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Common Issues */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Common Issues</h2>
            <p className="lead text-muted">Quick solutions to frequently encountered problems</p>
          </div>
          <Row className="g-4">
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="h5 mb-3">
                    <i className="bi bi-box me-2 text-primary"></i>Order Issues
                  </h3>
                  <ul className="list-unstyled">
                    <li className="mb-2"><a href="#" className="text-decoration-none">How to track my order</a></li>
                    <li className="mb-2"><a href="#" className="text-decoration-none">My order is delayed</a></li>
                    <li className="mb-2"><a href="#" className="text-decoration-none">I received the wrong item</a></li>
                    <li className="mb-2"><a href="#" className="text-decoration-none">Item arrived damaged</a></li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="h5 mb-3">
                    <i className="bi bi-arrow-return-left me-2 text-primary"></i>Returns & Refunds
                  </h3>
                  <ul className="list-unstyled">
                    <li className="mb-2"><a href="#" className="text-decoration-none">How to return an item</a></li>
                    <li className="mb-2"><a href="#" className="text-decoration-none">Return policy information</a></li>
                    <li className="mb-2"><a href="#" className="text-decoration-none">Check refund status</a></li>
                    <li className="mb-2"><a href="#" className="text-decoration-none">Exchange an item</a></li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="h5 mb-3">
                    <i className="bi bi-credit-card me-2 text-primary"></i>Payment Issues
                  </h3>
                  <ul className="list-unstyled">
                    <li className="mb-2"><a href="#" className="text-decoration-none">Payment methods accepted</a></li>
                    <li className="mb-2"><a href="#" className="text-decoration-none">My payment was declined</a></li>
                    <li className="mb-2"><a href="#" className="text-decoration-none">I was charged twice</a></li>
                    <li className="mb-2"><a href="#" className="text-decoration-none">Update payment information</a></li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="h5 mb-3">
                    <i className="bi bi-person me-2 text-primary"></i>Account Help
                  </h3>
                  <ul className="list-unstyled">
                    <li className="mb-2"><a href="#" className="text-decoration-none">Reset my password</a></li>
                    <li className="mb-2"><a href="#" className="text-decoration-none">Update account information</a></li>
                    <li className="mb-2"><a href="#" className="text-decoration-none">Manage email preferences</a></li>
                    <li className="mb-2"><a href="#" className="text-decoration-none">Delete my account</a></li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Support Ticket Form */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="border-0 shadow">
                <Card.Body className="p-4 p-md-5">
                  <h2 className="text-center mb-4">Submit a Support Ticket</h2>
                  <p className="text-center text-muted mb-4">
                    Can't find what you're looking for? Submit a ticket and our support team will get back to you.
                  </p>

                  {success && (
                    <Alert variant="success" className="mb-4">
                      Thank you for submitting your support ticket! We'll get back to you as soon as possible.
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="danger" className="mb-4">
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Your Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="from_name"
                            value={formData.from_name}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            name="from_email"
                            value={formData.from_email}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Order Number (if applicable)</Form.Label>
                          <Form.Control
                            type="text"
                            name="order_number"
                            value={formData.order_number}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Issue Type</Form.Label>
                          <Form.Select
                            name="issue_type"
                            value={formData.issue_type}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select an issue type</option>
                            <option value="Order Issue">Order Issue</option>
                            <option value="Return/Refund">Return/Refund</option>
                            <option value="Payment Problem">Payment Problem</option>
                            <option value="Account Help">Account Help</option>
                            <option value="Product Question">Product Question</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label>Subject</Form.Label>
                          <Form.Control
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label>Message</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={5}
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} className="text-center">
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="px-5"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Ticket
                              <i className="bi bi-send ms-2"></i>
                            </>
                          )}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Support;