import React from 'react';
import { Container, Row, Col, Card, Breadcrumb, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

const About: React.FC = () => {
  const { state } = useGlobalContext();

  return (
    <>
      {/* Page Header */}
      <section className="bg-primary text-white py-5 mt-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold">About {state.BusinessName}</h1>
              <p className="lead">Learn more about our story and mission.</p>
            </Col>
            <Col lg={4} className="text-lg-end">
              <Breadcrumb className="justify-content-lg-end mb-0">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }} className="breadcrumb-link">
                  Home
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="text-white">
                  About
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Content */}
      <section className="py-5">
        <Container>
          <Row className="g-5">
            <Col lg={6}>
              <h2 className="display-6 fw-bold mb-4">Our Story</h2>
              <p className="lead mb-4">
                Founded with a passion for quality and customer satisfaction, {state.BusinessName} has been serving customers since our inception.
              </p>
              <p className="mb-4">
                We believe that everyone deserves access to premium products at affordable prices. Our carefully curated selection of items represents the perfect balance of quality, style, and value.
              </p>
              <p className="mb-4">
                Our team is dedicated to providing exceptional customer service and ensuring that every shopping experience is memorable and satisfying.
              </p>
            </Col>
            <Col lg={6}>
              <img
                src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="About Us"
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Values */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Our Mission & Values</h2>
            <p className="lead text-muted">What drives us forward</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div className="feature-icon bg-primary text-white mb-4">
                    <i className="bi bi-star fs-2"></i>
                  </div>
                  <h3 className="h4 mb-3">Quality First</h3>
                  <p className="text-muted">
                    We never compromise on quality. Every product in our collection meets our high standards for excellence.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div className="feature-icon bg-primary text-white mb-4">
                    <i className="bi bi-heart fs-2"></i>
                  </div>
                  <h3 className="h4 mb-3">Customer Focus</h3>
                  <p className="text-muted">
                    Our customers are at the heart of everything we do. We strive to exceed expectations at every touchpoint.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div className="feature-icon bg-primary text-white mb-4">
                    <i className="bi bi-lightning fs-2"></i>
                  </div>
                  <h3 className="h4 mb-3">Innovation</h3>
                  <p className="text-muted">
                    We continuously innovate to bring you the latest trends and cutting-edge products.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Our Team</h2>
            <p className="lead text-muted">Meet the people behind {state.BusinessName}</p>
          </div>
          <Row className="g-4">
            <Col lg={3} md={6}>
              <Card className="border-0 shadow-sm text-center">
                <Card.Img
                  variant="top"
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <Card.Body className="p-4">
                  <h4 className="h5 mb-2">John Doe</h4>
                  <p className="text-muted mb-0">CEO & Founder</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="border-0 shadow-sm text-center">
                <Card.Img
                  variant="top"
                  src="https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=400"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <Card.Body className="p-4">
                  <h4 className="h5 mb-2">Jane Smith</h4>
                  <p className="text-muted mb-0">Head of Operations</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="border-0 shadow-sm text-center">
                <Card.Img
                  variant="top"
                  src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <Card.Body className="p-4">
                  <h4 className="h5 mb-2">Mike Johnson</h4>
                  <p className="text-muted mb-0">Marketing Director</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="border-0 shadow-sm text-center">
                <Card.Img
                  variant="top"
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <Card.Body className="p-4">
                  <h4 className="h5 mb-2">Sarah Wilson</h4>
                  <p className="text-muted mb-0">Customer Success</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="display-6 fw-bold mb-4">Ready to Get Started?</h2>
              <p className="lead mb-4">
                Join thousands of satisfied customers who trust {state.BusinessName} for their shopping needs.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button as={Link} to="/#products" variant="light" size="lg">
                  Shop Now
                </Button>
                <Button as={Link} to="/contact" variant="outline-light" size="lg">
                  Contact Us
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default About;