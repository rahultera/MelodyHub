import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://melodyhub-icod.onrender.com/register", { email, password, name });
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error(error.response.data.error);
      alert(error.response.data.error);
    }
  };

  return (
    <div className="registerPage">
      <div className="registerOverlay"></div>
      <div className="registerFormContainer">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
        <input
            type="Name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="registerInput"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="registerInput"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="registerInput"
          />
          <button
            type="submit"
            className="registerButton"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
