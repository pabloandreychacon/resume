import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Breadcrumb, Alert } from 'react-bootstrap';
import { useGlobalContext } from '../context/GlobalContext';
import { Product } from '../types';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, state } = useGlobalContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundProduct = productsData.find(p => p.id === parseInt(id));
      if (foundProduct) {
        setProduct(foundProduct);
        const foundCategory = categoriesData.find(c => c.id === foundProduct.categoryId);
        setCategory(foundCategory);
      }
      setLoading(false);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId: number) => {
    return state.wishlist.some(item => item.product.id === productId);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Product not found. <Link to="/#products">Return to products</Link>
        </Alert>
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
              <h1 className="display-4 fw-bold">{product.name}</h1>
              <p className="lead">{category?.name}</p>
            </Col>
            <Col lg={4} className="text-lg-end">
              <Breadcrumb className="justify-content-lg-end mb-0">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }} className="breadcrumb-link">
                  Home
                </Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/#products" }} className="breadcrumb-link">
                  Products
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="text-white">
                  {product.name}
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Product Details */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={6}>
              <Card className="border-0 shadow-sm">
                <Card.Img
                  variant="top"
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ height: '400px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              </Card>
            </Col>

            <Col lg={6}>
              <div className="ps-lg-4">
                <h2 className="mb-3">{product.name}</h2>

                <div className="mb-3">
                  <span className="h3 text-primary">${product.price.toFixed(2)}</span>
                  {product.stockQuantity !== undefined && (
                    <Badge
                      bg={product.stockQuantity < 10 ? "warning" : "success"}
                      className="ms-3"
                    >
                      {product.stockQuantity < 10 ? "Low Stock" : "In Stock"}
                    </Badge>
                  )}
                </div>

                <p className="text-muted mb-4">{product.description}</p>

                {product.stockQuantity !== undefined && (
                  <p className="mb-4">
                    <strong>Stock:</strong> {product.stockQuantity} units available
                  </p>
                )}

                <div className="mb-4">
                  <label className="form-label">Quantity:</label>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="mx-3">{quantity}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="d-grid gap-2 mb-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity !== undefined && product.stockQuantity === 0}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </Button>

                  <Button
                    variant="outline-danger"
                    onClick={handleAddToWishlist}
                    disabled={isInWishlist(product.id)}
                  >
                    <i className={`bi bi-heart${isInWishlist(product.id) ? '-fill' : ''} me-2`}></i>
                    {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                  </Button>
                </div>

                <div className="border-top pt-4">
                  <h5>Product Features:</h5>
                  <ul className="list-unstyled">
                    <li><i className="bi bi-check text-success me-2"></i>Premium quality materials</li>
                    <li><i className="bi bi-check text-success me-2"></i>Fast shipping</li>
                    <li><i className="bi bi-check text-success me-2"></i>30-day return policy</li>
                    <li><i className="bi bi-check text-success me-2"></i>Customer support</li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Related Products */}
      <section className="py-5 bg-light">
        <Container>
          <h3 className="mb-4">Related Products</h3>
          <Row className="g-4">
            {productsData
              .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <Col key={relatedProduct.id} lg={3} md={6}>
                  <Card className="h-100 border-0 shadow-sm product-card">
                    <Card.Img
                      variant="top"
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => navigate(`/product/${relatedProduct.id}`)}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h6 mb-2">{relatedProduct.name}</Card.Title>
                      <Card.Text className="text-muted small mb-3">
                        {relatedProduct.description}
                      </Card.Text>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="h5 mb-0">${relatedProduct.price.toFixed(2)}</span>
                        </div>
                        <div className="d-grid gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => addToCart(relatedProduct)}
                          >
                            Add to Cart
                          </Button>
                          <Button
                            as={Link}
                            to={`/product/${relatedProduct.id}`}
                            variant="outline-secondary"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Container>
      </section>

    </>
  );
};

export default ProductDetail;