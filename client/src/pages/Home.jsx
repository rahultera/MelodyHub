import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./homestyle.css";

const Home = () => {
  return (
    <div
      className="hero bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/Homebg.jpeg')" }}

    >
      <div className="overlay bg-black bg-opacity-50 p-8 rounded-xl text-center">
        <h1 className="text-6xl font-extrabold mb-4">Welcome to MelodyHub</h1>
        <p className="text-2xl">Your gateway to unforgettable music events.</p>
      </div>
    </div>
  );
};

export default Home;
