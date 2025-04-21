import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const registerUser = (userData) =>
  axios.post(`${API_BASE_URL}/auth/register`, userData, { withCredentials: true });

export const loginUser = (credentials) =>
  axios.post(`${API_BASE_URL}/auth/login`, credentials, { withCredentials: true });

export const logoutUser = () =>
  axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });

export const fetchEvents = () =>
  axios.get(`${API_BASE_URL}/events`, { withCredentials: true });

