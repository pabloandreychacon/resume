import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { emailjsHelpers } from '../lib/emailjs';
import { ContactForm } from '../types';

const Contact: React.FC = () => {
  const { state } = useGlobalContext();
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await emailjsHelpers.sendContactForm(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('Failed to send message. Please try again later.');
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
              <h1 className="display-4 fw-bold">Contact Us</h1>
              <p className="lead">Get in touch with us for any questions or inquiries.</p>
            </Col>
            <Col lg={4} className="text-lg-end">
              <Breadcrumb className="justify-content-lg-end mb-0">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }} className="breadcrumb-link">
                  Home
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="text-white">
                  Contact
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Information */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            <Col lg={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon bg-primary text-white mb-4">
                    <i className="bi bi-geo-alt fs-2"></i>
                  </div>
                  <h3 className="h4 mb-3">Address</h3>
                  <p className="text-muted mb-0">{state.Address}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon bg-primary text-white mb-4">
                    <i className="bi bi-telephone fs-2"></i>
                  </div>
                  <h3 className="h4 mb-3">Phone</h3>
                  <p className="text-muted mb-0">
                    <a href={`tel:${state.Phone.replace(/\D/g, '')}`} className="text-decoration-none">
                      {state.Phone}
                    </a>
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon bg-primary text-white mb-4">
                    <i className="bi bi-envelope fs-2"></i>
                  </div>
                  <h3 className="h4 mb-3">Email</h3>
                  <p className="text-muted mb-0">
                    <a href={`mailto:${state.Email}`} className="text-decoration-none">
                      {state.Email}
                    </a>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="border-0 shadow">
                <Card.Body className="p-4 p-md-5">
                  <h2 className="text-center mb-4">Send us a Message</h2>
                  <p className="text-center text-muted mb-4">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>

                  {success && (
                    <Alert variant="success" className="mb-4">
                      Thank you for your message! We'll get back to you as soon as possible.
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
                            name="name"
                            value={formData.name}
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
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
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
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
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

      {/* Map Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Find Us</h2>
            <p className="lead text-muted">Visit our location</p>
          </div>
          <Row>
            <Col lg={12}>
              <div className="ratio ratio-21x9">
                <iframe
                  src={state.MapLocation}
                  title="Location Map"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Contact;