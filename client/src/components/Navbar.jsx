import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowNav(currentY < lastScrollY || currentY < 50);
      setLastScrollY(currentY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    navigate('/User');
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://melodyhub-icod.onrender.com/logout', {}, { withCredentials: true });
      onLogout();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Logout failed.');
    }
  };

  return (
    <>
      <header className={`navbar ${showNav ? 'visible' : 'hidden'}`}>
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/" className="brand">
              <span className="icon">🎵</span> 
              <span className="brand-text">MelodyHub</span>
            </Link>
          </div>

          <div className="navbar-center">
            <Link to="/items" className="nav-item">Events</Link>
            <Link to="/Add-Event" className="nav-item">Add Event</Link>
            <Link to="/artists" className="nav-item">Artists</Link>
          </div>

          <div className="navbar-right" ref={dropdownRef}>
            {user ? (
              <div className="user-menu">
               <button className="icon-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
  <img
    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
    alt="Profile"
    className="profile-icon"
  />
</button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <button onClick={handleProfileClick} className="dropdown-item">Profile</button>
                    <button onClick={handleLogout} className="dropdown-item">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-item login-button">Login</Link>
            )}
          </div>
        </div>
      </header>

      <style>{ `
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #000;
  color: #fff;
  z-index: 1000;
  transition: transform 0.3s ease;
  padding: 0 20px;
  height: 50px;
  display: flex;
  align-items: center;
}
.nav-item, 
.login-button {
  font-size: 20px; 
  color: #fff;
  
}
.nav-item:hover,
.login-button:hover {
  color: #ddd;
}

.navbar-container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  position: relative;
}


.navbar-left,
.navbar-center,
.navbar-right {
  display: flex;
  align-items: center;
}

.navbar-left {
  flex: 1;
  justify-content: flex-start;
}
.navbar-center {
   
  flex: 2;
  justify-content: center;
  gap: 32px;
}
.navbar-right {
  flex: 1;
  justify-content: flex-end;
  position: relative;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-decoration: none;
  font-size: 20px; 
  font-weight: bold;
}
.brand-text {
  font-size: 20px;
}
.icon {
  font-size: 20px; 
}

.profile-icon {
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 50%; /* makes it round */
}

.icon-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
}
.user-menu {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: 60px;
  right: 0;
  background: #222;
  border: 1px solid #444;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  min-width: 160px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 999;
}
.dropdown-item {
  padding: 12px 16px;
  font-size: 14px; /* Profile and Logout */
  color: #fff;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #333;
}

// @media (max-width: 768px) {
//   .brand {
//     font-size: 15px;
//   }
//   .brand-text {
//     font-size: 15px;
//   }
//   .icon {
//     font-size: 15px;
//   }
//   .icon-button {
//     font-size: 15px;
//   }
//   .nav-item {
//     font-size: 15px;
//   }
//   .dropdown-item {
//     font-size: 15px;
//   }
// }


     `
     }</style>
    </>
  );
};

export default Navbar;
