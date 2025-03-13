import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faBookmark } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      let blogsUrl = 'http://localhost:3001/blogs?_sort=timestamp&_order=desc';
      if (selectedCategory !== 'all') {
        blogsUrl += `&category=${selectedCategory}`;
      }
      
      const [blogsResponse, categoriesResponse] = await Promise.all([
        axios.get(blogsUrl),
        axios.get('http://localhost:3001/categories')
      ]);

      setBlogs(blogsResponse.data);
      setCategories(categoriesResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Container className="py-5 mt-4">
      <Row>
        <Col md={8}>
          <h1 className="mb-4">Trending Stories</h1>
          
          <Nav variant="pills" className="mb-4">
            <Nav.Item>
              <Nav.Link 
                active={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Nav.Link>
            </Nav.Item>
            {categories.map(category => (
              <Nav.Item key={category.id}>
                <Nav.Link
                  active={selectedCategory === category.name}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            blogs.map(blog => (
              <Card key={blog.id} className="mb-4 blog-card">
                <Row className="g-0">
                  {blog.image && (
                    <Col md={4}>
                      <Card.Img 
                        src={blog.image} 
                        alt={blog.title}
                        className="h-100 object-fit-cover"
                      />
                    </Col>
                  )}
                  <Col md={blog.image ? 8 : 12}>
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <img
                          src={blog.authorAvatar || 'https://via.placeholder.com/32'}
                          alt="author"
                          className="rounded-circle me-2"
                          width="32"
                          height="32"
                        />
                        <small className="text-muted">
                          {blog.authorName} · {formatDate(blog.timestamp)}
                        </small>
                      </div>
                      
                      <Card.Title as={Link} to={`/blog/${blog.id}`} className="h4 text-decoration-none text-dark">
                        {blog.title}
                      </Card.Title>
                      
                      <Card.Text className="text-muted">
                        {blog.content.replace(/<[^>]+>/g, '').substring(0, 150)}...
                      </Card.Text>

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          {blog.tags.map((tag, index) => (
                            <span key={index} className="tag-pill me-2">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="d-flex align-items-center">
                          <Button variant="link" className="text-muted">
                            <FontAwesomeIcon icon={faHeart} /> {blog.likes}
                          </Button>
                          <Button variant="link" className="text-muted">
                            <FontAwesomeIcon icon={faComment} /> {blog.comments}
                          </Button>
                          <Button variant="link" className="text-muted">
                            <FontAwesomeIcon icon={faBookmark} />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            ))
          )}
        </Col>

        <Col md={4}>
          <div className="position-sticky" style={{ top: '100px' }}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Discover more</Card.Title>
                <Card.Text>
                  Find stories that matter to you. Follow authors and topics you love.
                </Card.Text>
                <Button variant="success" as={Link} to="/topics" className="w-100">
                  Explore Topics
                </Button>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Card.Title>Popular Tags</Card.Title>
                {blogs.reduce((tags, blog) => {
                  blog.tags.forEach(tag => {
                    if (!tags.includes(tag)) tags.push(tag);
                  });
                  return tags;
                }, []).slice(0, 10).map((tag, index) => (
                  <Button
                    key={index}
                    variant="outline-secondary"
                    size="sm"
                    className="me-2 mb-2"
                  >
                    {tag}
                  </Button>
                ))}
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;