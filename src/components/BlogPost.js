import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare, faBookmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function BlogPost() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    fetchBlogData();
  }, [id]);

  const fetchBlogData = async () => {
    try {
      const [blogResponse, commentsResponse] = await Promise.all([
        axios.get(`http://localhost:3001/blogs/${id}`),
        axios.get(`http://localhost:3001/comments?blogId=${id}`)
      ]);

      setBlog(blogResponse.data);
      setComments(commentsResponse.data);

      const authorResponse = await axios.get(`http://localhost:3001/users/${blogResponse.data.userId}`);
      setAuthor(authorResponse.data);

      const relatedResponse = await axios.get(
        `http://localhost:3001/blogs?category=${blogResponse.data.category}&id_ne=${id}&_limit=3`
      );
      setRelatedPosts(relatedResponse.data);
    } catch (error) {
      console.error('Error fetching blog data:', error);
    }
  };

  const handleLike = async () => {
    try {
      const updatedLikes = blog.likes + (isLiked ? -1 : 1);
      await axios.patch(`http://localhost:3001/blogs/${id}`, {
        likes: updatedLikes
      });
      setBlog({ ...blog, likes: updatedLikes });
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const newCommentData = {
        blogId: parseInt(id),
        userId: 1, // Replace with actual user ID
        content: newComment,
        timestamp: new Date().toISOString()
      };

      const response = await axios.post('http://localhost:3001/comments', newCommentData);
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (!blog || !author) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Container className="py-5 mt-4">
      <Row>
        <Col lg={8}>
          <article>
            <h1 className="display-4 mb-4">{blog.title}</h1>

            <div className="d-flex align-items-center mb-4">
              <Image
                src={author.avatar}
                roundedCircle
                width={50}
                height={50}
                className="me-3"
              />
              <div>
                <h5 className="mb-0">{author.username}</h5>
                <small className="text-muted">
                  {new Date(blog.timestamp).toLocaleDateString()} · {blog.readTime}
                </small>
              </div>
            </div>

            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="img-fluid rounded mb-4"
              />
            )}

            <div 
              className="blog-content mb-4"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <Button 
                  variant={isLiked ? "danger" : "outline-danger"}
                  onClick={handleLike}
                  className="me-2"
                >
                  <FontAwesomeIcon icon={faHeart} /> {blog.likes}
                </Button>
                <Button variant="outline-secondary" className="me-2">
                  <FontAwesomeIcon icon={faComment} /> {comments.length}
                </Button>
                <Button variant="outline-secondary" className="me-2">
                  <FontAwesomeIcon icon={faShare} />
                </Button>
              </div>
              <Button
                variant={isBookmarked ? "dark" : "outline-dark"}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <FontAwesomeIcon icon={faBookmark} />
              </Button>
            </div>

            <div className="tags mb-4">
              {blog.tags.map((tag, index) => (
                <span key={index} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>

            <hr />

            <section className="comments-section">
              <h3>Comments ({comments.length})</h3>
              <Form onSubmit={handleComment} className="mb-4">
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit" className="mt-2">
                  Post Comment
                </Button>
              </Form>

              {comments.map(comment => (
                <Card key={comment.id} className="mb-3">
                  <Card.Body>
                    <Card.Text>{comment.content}</Card.Text>
                    <small className="text-muted">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </small>
                  </Card.Body>
                </Card>
              ))}
            </section>
          </article>
        </Col>

        <Col lg={4}>
          <div className="position-sticky" style={{ top: '100px' }}>
            <Card className="mb-4">
              <Card.Body>
                <h5>About the Author</h5>
                <p>{author.bio}</p>
                <Button variant="success" className="w-100">
                  Follow
                </Button>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <h5>More from {author.username}</h5>
                {relatedPosts.map(post => (
                  <div key={post.id} className="mb-3">
                    <h6>{post.title}</h6>
                    <small className="text-muted">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </small>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default BlogPost;