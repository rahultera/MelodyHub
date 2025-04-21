import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    fetchEventDetails();
    fetchCurrentUser();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const res = await axios.get(`https://melodyhub-icod.onrender.com/Events/${id}`);
      setEvent(res.data);
      setComments(res.data.Comment || []);
      checkBookmark();
    } catch (error) {
      console.error('Error fetching event details:', error);
      alert('Failed to load event details.');
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('http://localhost:8000/me', { withCredentials: true });
      setCurrentUser(res.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const checkBookmark = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user/bookmarks', { withCredentials: true });
      const bookmarked = response.data.some((bookmark) => bookmark.event.id === parseInt(id));
      setIsBookmarked(bookmarked);
    } catch (error) {
      console.error('Error checking bookmark:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      await axios.post(`http://localhost:8000/Events/${id}/bookmark`, {}, { withCredentials: true });
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error bookmarking event:', error);
      alert('Failed to bookmark event.');
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8000/Events/${id}/comments`,
        { text: comment },
        { withCredentials: true }
      );
      const newComment = response.data;
      setComments([...comments, { text: newComment.text, user: { name: newComment.user.name } }]);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment.');
    }
  };

  const handleEdit = () => {
    navigate(`/edit-event/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:8000/Events/${id}/bookmarks`, { withCredentials: true });
        await axios.delete(`http://localhost:8000/Events/${id}`, { withCredentials: true });
  
        alert('Event deleted successfully.');
        navigate('/items');
      } catch (error) {
        console.error('Error deleting event:', error);
        if (error.response && error.response.status === 403) {
          alert('You are not authorized to delete this event.');
        } else {
          alert('Failed to delete event.');
        }
      }
    }
  };
  

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  if (!event) {
    return <div className="loading">Loading event details...</div>;
  }

  return (
    <div className="EventDetailsPage">
      <div className="Doverlay"></div>
      <div className="DformContainer">
        <h2>{event.title}</h2>
        <p><strong>Artist:</strong> {event.artist}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p style={{ marginBottom: '20px' }}>{event.description}</p>

        {currentUser && parseInt(event.organizerId) === parseInt(currentUser.id) && (
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleEdit} className="editButton">Edit Event</button>
            <button onClick={handleDelete} className="deleteButton">Delete Event</button>
          </div>
        )}

        <div className="commentSection">
          <h3>Comments</h3>
          <div className="commentsContainer">
            {comments.length > 0 ? (
              comments.map((cmt, index) => (
                <div key={index} className="comment">
                  <strong>{cmt.user?.name || 'Anonymous'}:</strong> {cmt.text}
                </div>
              ))
            ) : (
              <p style={{ color: '#aaa', fontStyle: 'italic' }}>No comments yet. Be the first!</p>
            )}
            <div ref={commentsEndRef} />
          </div>

          <input
            type="text"
            className="input"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleAddComment} className="button">Post Comment</button>
            <button onClick={handleBookmark} className="bookmarkButton">
              {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
