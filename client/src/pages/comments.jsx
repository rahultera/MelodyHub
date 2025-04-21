import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./comments.css"; 

const Comments = () => {
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/user/comments", { withCredentials: true })
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
        alert("Failed to load comments.");
      });
  }, []);

  const handleCommentClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="Commentspage">
      <div className="overlay"></div>
      <div className="container">
        <h2 className="heading">All Comments</h2>
        {comments.length > 0 ? (
          <ul className="list">
            {comments.map((comment) => (
              <li
                key={comment.id}
                onClick={() => handleCommentClick(comment.event.id)}
                className="comment"
              >
                <strong>{comment.event.title}</strong>: {comment.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="message">No comments found.</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
