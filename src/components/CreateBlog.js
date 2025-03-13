import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';

function CreateBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogData = {
      title,
      content,
      image,
      category,
      tags: tags.split(',').map(tag => tag.trim()),
      userId: 1, // Replace with actual user ID
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0
    };

    const response = await axios.post('http://localhost:3001/blogs', blogData);
    navigate(`/blog/${response.data.id}`);
  };

  return (
    <Container className="py-5 mt-4">
      <h2 className="mb-4">Create New Story</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control-lg border-0 mb-3"
          />
          
          <Form.Control
            type="text"
            placeholder="Add a cover image (URL)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mb-3"
          />

          <ReactQuill
            value={content}
            onChange={setContent}
            className="mb-3"
            style={{ height: '300px' }}
          />

          <Form.Select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mb-3"
          >
            <option value="">Select Category</option>
            <option value="Technology">Technology</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Business">Business</option>
          </Form.Select>

          <Form.Control
            type="text"
            placeholder="Add tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mb-3"
          />
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button variant="outline-secondary" className="me-2">
            Save Draft
          </Button>
          <Button variant="success" type="submit">
            Publish
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default CreateBlog;