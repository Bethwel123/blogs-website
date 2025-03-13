import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { Navbar, Nav, Container, Form, FormControl, Button, Dropdown, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faSignOutAlt, faPen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function NavigationBar({ user, setUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    const response = await axios.get(`http://localhost:3001/notifications?userId=${user.id}&read=false`);
    setNotifications(response.data);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchTerm}`);
  };

  const handleLogout = async () => {
    setUser(null);
    navigate('/');
  };

  return (
    <Navbar bg="white" expand="lg" className="border-bottom fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="font-weight-bold">
          BlogHub
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form className="d-flex mx-auto" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search stories"
              className="me-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-success" type="submit">Search</Button>
          </Form>

          <Nav className="ms-auto">
            {user ? (
              <>
                <Button
                  as={Link}
                  to="/create"
                  variant="success"
                  className="me-3"
                >
                  <FontAwesomeIcon icon={faPen} className="me-2" />
                  Write
                </Button>

                <Nav.Link as={Link} to="/notifications" className="me-3 position-relative">
                  <FontAwesomeIcon icon={faBell} />
                  {notifications.length > 0 && (
                    <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle">
                      {notifications.length}
                    </Badge>
                  )}
                </Nav.Link>

                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="nav-link" id="dropdown-user">
                    <img
                      src={user.avatar || 'https://via.placeholder.com/32'}
                      alt="avatar"
                      className="rounded-circle"
                      width="32"
                      height="32"
                    />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={`/profile/${user.id}`}>
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/settings">
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                      Sign Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Sign In</Nav.Link>
                <Button
                  as={Link}
                  to="/register"
                  variant="success"
                  className="ms-2"
                >
                  Get Started
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;