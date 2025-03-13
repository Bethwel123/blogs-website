import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    fetchResults();
  }, [searchQuery, filter]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:3001/blogs?q=${searchQuery}`;
      if (filter !== 'all') {
        url += `&category=${filter}`;
      }
      const response = await axios.get(url);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
    setLoading(false);
  };

  return (
    <Container className="py-5 mt-4">
      <h2 className="mb-4">Search Results for "{searchQuery}"</h2>
      
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Filter Results</h5>
              <Form.Select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
              </Form.Select>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          {loading ? (
            <div className="text-center">Loading results...</div>
          ) : results.length > 0 ? (
            results.map(blog => (
              <Card key={blog.id} className="mb-3">
                <Card.Body>
                  <Row>
                    {blog.image && (
                      <Col md={3}>
                        <img 
                          src={blog.image} 
                          alt={blog.title} 
                          className="img-fluid rounded"
                        />
                      </Col>
                    )}
                    <Col md={blog.image ? 9 : 12}>
                      <Card.Title>
                        <Link 
                          to={`/blog/${blog.id}`}
                          className="text-decoration-none text-dark"
                        >
                          {blog.title}
                        </Link>
                      </Card.Title>
                      <Card.Text className="text-muted">
                        {blog.content.replace(/<[^>]+>/g, '').substring(0, 150)}...
                      </Card.Text>
                      <div className="d-flex">
                        {blog.tags.map((tag, index) => (
                          <span key={index} className="tag-pill me-2">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="text-center">
              <h4>No results found</h4>
              <p>Try different keywords or remove filters</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default SearchResults;