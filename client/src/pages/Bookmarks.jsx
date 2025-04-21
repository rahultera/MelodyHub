import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Bookmarks.css";

const Bookmarks = ({ user }) => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    axios
      .get("https://melodyhub-icod.onrender.com/user/bookmarks", { withCredentials: true })
      .then((res) => {
        setBookmarks(res.data);
      })
      .catch((err) => {
        console.error("Error fetching bookmarks:", err);
        alert("Failed to load bookmarks.");
      });
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="Bookmarkpage">
      <div className="overlay"></div>
      <div className="container">
        <h2 className="heading">All Bookmarked Events</h2>
        {bookmarks.length > 0 ? (
          <ul className="list">
            {bookmarks.map((bookmark) => (
              <li
                key={bookmark.id}
                onClick={() => handleEventClick(bookmark.event.id)}
                className="card"
              >
                <strong>{bookmark.event.title}</strong>
                <br />
                <span>{bookmark.event.description?.slice(0, 100)}...</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="message">No bookmarks found.</p>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
