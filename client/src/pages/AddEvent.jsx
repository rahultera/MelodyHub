import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddEvent.css"; // Import the CSS file

const AddEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [artist, setArtist] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://melodyhub-icod.onrender.com/Add-Event",
        { title, description, date, location, artist },
        { withCredentials: true }
      );
      navigate("/items");
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      alert(error.response?.data?.error || "Failed to add event");
    }
  };  

  return (
    <div className="AddEventPage">
      <div className="Aoverlay"></div>
      <div className="AformContainer">
        <h2>Add New Event</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
          ></textarea>
          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="button">Add Event</button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
