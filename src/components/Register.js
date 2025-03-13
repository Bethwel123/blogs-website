import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const emailCheck = await axios.get(`http://localhost:3001/users?email=${email}`);
      if (emailCheck.data.length > 0) {
        setError('Email already exists');
        return;
      }

      const userData = {
        username,
        email,
        password,
        bio,
        avatar: `https://ui-avatars.com/api/?name=${username}`,
        joinDate: new Date().toISOString(),
        following: [],
        followers: []
      };

      await axios.post('http://localhost:3001/users', userData);
      navigate('/login');
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
    <Container className="py-5 mt-4">
      <div className="mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Join BlogHub</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 mb-3">
            Create Account
          </Button>

          <div className="text-center">
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default Register;