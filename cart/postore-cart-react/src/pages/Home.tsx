import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { Product, Category } from '../types';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, addToWishlist, state } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.categoryId === selectedCategory)
    : products;

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleAddToWishlist = (product: Product) => {
    addToWishlist(product);
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

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section text-white py-5">
        <video className="hero-video-bg" autoPlay loop playsInline muted>
          <source src="/assets/video/postore.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">Discover Premium Products</h1>
              <p className="lead mb-4">
                Shop the latest trends with our curated collection of high-quality
                products at unbeatable prices.
              </p>
              <Button
                as="a"
                href="#products"
                variant="light"
                size="lg"
                style={{ position: 'relative', zIndex: 10 }}
              >
                Shop Now <i className="bi bi-arrow-right ms-2"></i>
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Shop by Category</h2>
            <p className="lead text-muted">Find what you're looking for</p>
          </div>

          <Row className="g-4">
            {categories.map((category) => (
              <Col key={category.id} md={4}>
                <Card
                  className={`text-center h-100 border-0 shadow-sm product-card ${selectedCategory === category.id ? 'border-primary' : ''
                    }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                >
                  <Card.Body className="p-4">
                    <div className="feature-icon bg-primary text-white mb-4">
                      <i className={`bi bi-${category.id === 1 ? 'laptop' :
                        category.id === 2 ? 'bag' : 'house'
                        } fs-2`}></i>
                    </div>
                    <h3 className="h4 mb-3">{category.name}</h3>
                    <p className="text-muted mb-0">{category.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Products Section */}
      <section id="products" className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Featured Products</h2>
            <p className="lead text-muted">Handpicked items just for you</p>
          </div>

          {filteredProducts.length === 0 ? (
            <Alert variant="info" className="text-center">
              No products found in this category.
            </Alert>
          ) : (
            <Row className="g-4">
              {filteredProducts.map((product) => (
                <Col key={product.id} lg={3} md={4} sm={6}>
                  <Card className="h-100 border-0 shadow-sm product-card">
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => navigate(`/product/${product.id}`)}
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="position-absolute top-0 end-0 m-2"
                        onClick={() => handleAddToWishlist(product)}
                        disabled={isInWishlist(product.id)}
                      >
                        <i className={`bi bi-heart${isInWishlist(product.id) ? '-fill' : ''}`}></i>
                      </Button>
                      {product.stockQuantity !== undefined && product.stockQuantity < 10 && (
                        <Badge bg="warning" className="position-absolute top-0 start-0 m-2">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h6 mb-2">{product.name}</Card.Title>
                      <Card.Text className="text-muted small mb-3">
                        {product.description}
                      </Card.Text>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="h5 mb-0">${product.price.toFixed(2)}</span>
                          {product.stockQuantity !== undefined && (
                            <small className="text-muted">
                              {product.stockQuantity} in stock
                            </small>
                          )}
                        </div>
                        <div className="d-grid gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                          >
                            Add to Cart
                          </Button>
                          <Button
                            as={Link}
                            to={`/product/${product.id}`}
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
          )}
        </Container>
      </section>

    </>
  );
};

export default Home;