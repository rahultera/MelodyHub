import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
res.cookie("token", token, { httpOnly: true, maxAge: 15 * 60 * 1000, sameSite: 'none', secure: true });

export async function getAllEvents(req, res) {
  try {
    const events = await prisma.event.findMany({
      include: { organizer: { select: { name: true } } }
    });
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

export async function getEventById(req, res) {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        Comment: {
          include: {
            user: { select: { name: true } } 
          }
        },
        organizer: { select: { name: true } }
      }
    });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};


export async function addComment(req, res) {
  const { id } = req.params;  
  const { text } = req.body;  
  const userId = req.userId;  

  try {
    
    const event = await prisma.event.findUnique({ where: { id: parseInt(id) } });
    if (!event) return res.status(404).json({ error: "Event not found" });

    const comment = await prisma.comment.create({
      data: {
        text,
        userId,
        eventId: parseInt(id),
      },
      include: {
        user: { select: { name: true } } 
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
}

export async function getUserComments(req, res) {
  const userId = req.userId;
  try {
    const comments = await prisma.comment.findMany({
      where: { userId: userId },
      include: {
        event: { select: { id: true, title: true } }, 
      },
    });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching user comments:", error);
    res.status(500).json({ error: "Failed to fetch user comments" });
  }
}

export async function toggleBookmark(req, res) {
  const { id } = req.params;  
  const userId = req.userId;  

  try {
  
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId: userId,
        eventId: parseInt(id),
      }
    });

    if (existingBookmark) {
    
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      return res.json({ message: "Bookmark removed" });
    } else {

      const newBookmark = await prisma.bookmark.create({
        data: {
          userId,
          eventId: parseInt(id),
        }
      });
      return res.json(newBookmark);
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ error: "Failed to toggle bookmark" });
  }
}

export async function getUserBookmarks(req, res) {
  const userId = req.userId;
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: userId },
      include: { event: true },
    });
    res.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
};

export const deleteEventBookmarks = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.bookmark.deleteMany({
      where: {
        eventId: parseInt(id),
      },
    });
    res.status(200).json({ message: 'Bookmarks deleted successfully.' });
  } catch (error) {
    console.error('Error deleting bookmarks:', error);
    res.status(500).json({ error: 'Failed to delete bookmarks.' });
  }
};


export async function createEvent(req, res) {
  const { title, description, date, location, artist } = req.body;
  const organizerId = req.userId;

  try {
    if (!title || !date || !location || !artist) {
      return res.status(400).json({ error: "All fields (title, date, location, artist) are required" });
    }
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        artist,
        organizerId
      }
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized: User not logged in" });
  }
};


export async function searchSpotifyArtists(req, res) {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          "Authorization": "Basic " + Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const searchResponse = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        q: query,
        type: 'artist',
        limit: 10,
      },
    });

    const artists = searchResponse.data.artists.items;
    res.json(artists);

  } catch (error) {
    console.error("Error searching Spotify artists:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to search Spotify artists" });
  }
}



export async function updateEvent(req, res) {
  const { id } = req.params;
  const { title, description, date, location, artist } = req.body;

  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // ✅ Fix this line
    if (event.organizerId !== req.userId) {
      return res.status(403).json({ error: "You are not authorized to update this event" });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        date,
        location,
        artist,
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
}



export async function deleteEvent(req, res) {
  const { id } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (event.organizerId !== req.userId) {
      return res.status(403).json({ error: "You are not authorized to delete this event" });
    }

    await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
}

export async function getSpotifyArtists(req, res) {
  const ids = req.query.ids;

  if (!ids) {
    return res.status(400).json({ error: "Missing artist IDs in query parameter" });
  }

  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          "Authorization": "Basic " + Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const artistResponse = await axios.get("https://api.spotify.com/v1/artists", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { ids }
    });

    res.json(artistResponse.data.artists);
  } catch (error) {
    console.error("Error fetching Spotify artists:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch Spotify artist data" });
  }
}




