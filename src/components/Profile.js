import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Button, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState('stories');

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    const [userResponse, blogsResponse] = await Promise.all([
      axios.get(`http://localhost:3001/users/${id}`),
      axios.get(`http://localhost:3001/blogs?userId=${id}`)
    ]);
    setUser(userResponse.data);
    setBlogs(blogsResponse.data);
  };

  return (
    <Container className="py-5 mt-4">
      {user && (
        <>
          <Row className="mb-4">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <Image
                  src={user.avatar}
                  roundedCircle
                  width={100}
                  height={100}
                  className="me-4"
                />
                <div>
                  <h2>{user.username}</h2>
                  <p className="text-muted mb-2">{user.bio}</p>
                  <Button variant="outline-success">Edit Profile</Button>
                </div>
              </div>
            </Col>
          </Row>

          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'stories'}
                onClick={() => setActiveTab('stories')}
              >
                Stories ({blogs.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'about'}
                onClick={() => setActiveTab('about')}
              >
                About
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === 'stories' && (
            <Row>
              {blogs.map(blog => (
                <Col md={6} key={blog.id} className="mb-4">
                  <Card>
                    {blog.image && (
                      <Card.Img variant="top" src={blog.image} />
                    )}
                    <Card.Body>
                      <Card.Title>{blog.title}</Card.Title>
                      <Card.Text>
                        {blog.content.replace(/<[^>]+>/g, '').substring(0, 150)}...
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {activeTab === 'about' && (
            <Card>
              <Card.Body>
                <h5>About {user.username}</h5>
                <p>{user.bio}</p>
                <h6>Member since</h6>
                <p>{new Date(user.joinDate).toLocaleDateString()}</p>
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </Container>
  );
}

export default Profile;