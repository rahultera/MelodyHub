import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './EventsList.css'; 

const EventsList = () => {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://melodyhub-icod.onrender.com/Events", { withCredentials: true })
      .then((res) => setTodos(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleCardClick = (id) => {
    navigate(`/events/${id}`);
  };

  return (
    <div className="eventsPage">
      <div className="Eoverlay"></div>
      <div className="EformContainer">
        <h1>Events List</h1>
        {todos.length === 0 ? (
          <p>No Events found.</p>
        ) : (
          <div className="itemsGrid">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="itemCard"
                onClick={() => handleCardClick(todo.id)}
              >
                <div className="cardContent">
                  <h3>{todo.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
