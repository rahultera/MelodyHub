import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventsList from "./pages/EventsList";
import AddEvent from "./pages/AddEvent";
import UserProfile from "./pages/UserProfile";
import EventDetails from "./pages/EventDetails";
import Footer from "./components/footer";
import Bookmarks from "./pages/Bookmarks";
import Comments from './pages/comments';
import EditEvent from "./pages/EditEvent";
import "./styles.css";
import SpotifyArtistList from './components/SpotifyArtistList';



function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user/name", { withCredentials: true })
      .then((res) => {
        setUser({ id: res.data.id, name: res.data.name });
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#000" }}>
    <Navbar user={user} onLogout={() => setUser(null)} />

    <div className="page-content">

      <Routes>
      <Route path="/artists" element={ <SpotifyArtistList />} />
        <Route path="/user/comments" element={<Comments />} />
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<EventsList />} />
        <Route path="/Add-Event" element={<AddEvent />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/User" element={<UserProfile user={user} />} />
        <Route path="/user/bookmarks" element={<Bookmarks user={user} />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/edit-event/:id" element={<EditEvent />} />

      </Routes>
    </div>

    <Footer />
  </div>
</Router>

  );
}

const styles = {
  content: {
    minHeight: "100vh",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
};

export default App;
