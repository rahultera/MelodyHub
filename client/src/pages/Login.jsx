import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; 

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://melodyhub-icod.onrender.com/login",
        { email, password },
        { withCredentials: true }
      );
      onLogin({ name: res.data.name });
      navigate("/");
    } catch (error) {
      console.error(error.response.data.error);
      alert(error.response.data.error);
    }
  };

  return (
    <div className="loginPage">
      <div className="Loverlay"></div>
      <div className="LformContainer">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="loginInput"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="loginInput"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="loginButton">
            Login
          </button>
          <p>
            Don't have an account?{" "}
            <a href="/Register" className="loginLink">
              Sign up now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
