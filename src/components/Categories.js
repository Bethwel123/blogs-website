import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryBlogs();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const response = await axios.get('http://localhost:3001/categories');
    setCategories(response.data);
  };

  const fetchCategoryBlogs = async () => {
    const response = await axios.get(`http://localhost:3001/blogs?category=${selectedCategory}`);
    setBlogs(response.data);
  };

  return (
    <Container className="py-5 mt-4">
      <h2 className="mb-4">Explore Categories</h2>

      <Row className="mb-5">
        {categories.map(category => (
          <Col md={3} key={category.id} className="mb-4">
            <Card 
              className={`h-100 ${selectedCategory === category.name ? 'border-success' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Img 
                variant="top" 
                src={category.image} 
                height="150"
                style={{ objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{category.name}</Card.Title>
                <Card.Text>{category.description}</Card.Text>
                <div className="text-muted">
                  {category.postCount} articles
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedCategory && (
        <>
          <h3 className="mb-4">Latest in {selectedCategory}</h3>
          <Row>
            {blogs.map(blog => (
              <Col md={4} key={blog.id} className="mb-4">
                <Card className="h-100">
                  {blog.image && (
                    <Card.Img 
                      variant="top" 
                      src={blog.image} 
                      height="200"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>
                      <Link 
                        to={`/blog/${blog.id}`}
                        className="text-decoration-none text-dark"
                      >
                        {blog.title}
                      </Link>
                    </Card.Title>
                    <Card.Text>
                      {blog.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    <small className="text-muted">
                      {new Date(blog.timestamp).toLocaleDateString()}
                    </small>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Button variant="outline-success">
              View All {selectedCategory} Articles
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default Categories;