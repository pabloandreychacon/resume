import React from 'react';
import { Container, Row, Col, Accordion, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FAQ: React.FC = () => {
  return (
    <>
      {/* Page Header */}
      <section className="bg-primary text-white py-5 mt-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold">Frequently Asked Questions</h1>
              <p className="lead">Find answers to common questions about our services.</p>
            </Col>
            <Col lg={4} className="text-lg-end">
              <Breadcrumb className="justify-content-lg-end mb-0">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }} className="breadcrumb-link">
                  Home
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="text-white">
                  FAQ
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ Content */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>How do I place an order?</Accordion.Header>
                  <Accordion.Body>
                    To place an order, simply browse our products, add items to your cart, and proceed to checkout. You'll need to provide your shipping and payment information to complete the order.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>What payment methods do you accept?</Accordion.Header>
                  <Accordion.Body>
                    We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through our payment partners.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>How long does shipping take?</Accordion.Header>
                  <Accordion.Body>
                    Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business days. International shipping may take 7-14 business days depending on the destination.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>What is your return policy?</Accordion.Header>
                  <Accordion.Body>
                    We offer a 30-day return policy for most items. Products must be in their original condition and packaging. Some items may have different return policies due to their nature.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                  <Accordion.Header>How can I track my order?</Accordion.Header>
                  <Accordion.Body>
                    Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the order history section.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="5">
                  <Accordion.Header>Do you ship internationally?</Accordion.Header>
                  <Accordion.Body>
                    Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can check shipping options during checkout.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="6">
                  <Accordion.Header>How can I contact customer support?</Accordion.Header>
                  <Accordion.Body>
                    You can contact our customer support team through our contact form, email, or phone. We typically respond within 24 hours during business days.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="7">
                  <Accordion.Header>Are your products authentic?</Accordion.Header>
                  <Accordion.Body>
                    Yes, all our products are 100% authentic. We work directly with manufacturers and authorized distributors to ensure the quality and authenticity of every item we sell.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="8">
                  <Accordion.Header>Do you offer discounts or promotions?</Accordion.Header>
                  <Accordion.Body>
                    Yes, we regularly offer discounts and promotions. Sign up for our newsletter to stay updated on the latest deals, or check our website for current promotions.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default FAQ;