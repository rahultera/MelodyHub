import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css'; 

const UserProfile = ({ user }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/user/comments', { withCredentials: true })
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user comments:", err);
        alert("Failed to load comments.");
      });

    axios
      .get('http://localhost:8000/user/bookmarks', { withCredentials: true })
      .then((res) => {
        setBookmarks(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user bookmarks:", err);
        alert("Failed to load bookmarks.");
      });
  }, []);

  const handleCommentClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleBookmarkClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="userProfilePage">
      <div className="overlay"></div>
      <div className="formContainer">
        <h1>Welcome {user?.name || 'User'}</h1>

        <h3>Your Comments</h3>
        {comments.length > 0 ? (
          <ul className="commentList">
            {comments.slice(0, 5).map((comment) => (
              <li
                key={comment.id}
                onClick={() => handleCommentClick(comment.event.id)}
                className="commentItem"
              >
                <strong>{comment.event.title}:</strong> {comment.text}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments found.</p>
        )}
        <Link to="/user/comments" className="link">View all comments</Link>

        <h3 style={{ marginTop: "20px" }}>Bookmarked Events</h3>
        {bookmarks.length > 0 ? (
          <ul className="commentList">
            {bookmarks.slice(0, 5).map((bookmark) => (
              <li
                key={bookmark.id}
                onClick={() => handleBookmarkClick(bookmark.event.id)}
                className="commentItem"
              >
                <strong>{bookmark.event.title}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookmarks found.</p>
        )}
        <Link to="/user/bookmarks" className="link">View all bookmarks</Link>

      
      </div>
    </div>
  );
};

export default UserProfile;
