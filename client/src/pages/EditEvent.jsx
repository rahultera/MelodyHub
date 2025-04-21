import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditEvent.css'; 

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    artist: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`https://melodyhub-icod.onrender.com/Events/${id}`);
      const event = response.data;

      setEventData({
        title: event.title || '',
        description: event.description || '',
        date: event.date ? event.date.split('T')[0] : '', 
        location: event.location || '',
        artist: event.artist || '',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      alert('Failed to load event data.');
    }
  };

  const handleChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://melodyhub-icod.onrender.com/Events/${id}`,
        {
          ...eventData,
          date: new Date(eventData.date), 
        },
        { withCredentials: true }
      );
      alert('Event updated successfully!');
      navigate(`/events/${id}`); 
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event.');
    }
  };

  if (loading) {
    return <div className="loading">Loading event data...</div>;
  }

  return (
    <div className="editEventPage">
      <div className="EEoverlay"></div>
      <div className="EEformContainer">
        <h2>Edit Event</h2>
        <form onSubmit={handleSubmit} className="editEventForm">
          <div className="formGroup">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Description</label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="formGroup">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
            />
          </div>

          <div className="formGroup">
            <label>Artist</label>
            <input
              type="text"
              name="artist"
              value={eventData.artist}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submitButton">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
