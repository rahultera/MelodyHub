import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { deleteEventBookmarks, getSpotifyArtists } from './controllers/eventController.js';
import { register, login, logout, getMe } from "./controllers/AuthController.js";
import { searchSpotifyArtists } from './controllers/eventController.js';
import {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  addComment,
  getUserComments,
  toggleBookmark,
  getUserBookmarks,
} from "./controllers/eventController.js";
import { requireAuth } from "./middleware/requireAuth.js";

const app = express();

app.use(cors({
  origin: ['https://melody-hub-wheat-two.vercel.app'],
  credentials: true
}));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get('/api/user/name', requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user); 
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post("/register", register);
app.post("/login", login);
app.post("/logout", logout);
app.get("/me", requireAuth, getMe);
app.get("/Events", getAllEvents);
app.post("/Add-Event", requireAuth, createEvent);
app.get("/Events/:id", getEventById);
app.put("/Events/:id", requireAuth, updateEvent);
app.delete("/Events/:id", requireAuth, deleteEvent);
app.post("/Events/:id/comments", requireAuth, addComment);
app.get("/user/comments", requireAuth, getUserComments);
app.post("/Events/:id/bookmark", requireAuth, toggleBookmark);
app.get("/user/bookmarks", requireAuth, getUserBookmarks);
app.get('/api/spotify/artists', getSpotifyArtists);
app.delete('/Events/:id/bookmarks', deleteEventBookmarks);
app.get('/api/spotify/search', searchSpotifyArtists);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});
