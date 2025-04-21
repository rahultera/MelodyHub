 import jwt from "jsonwebtoken";
export function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ error: "You are not logged in" });
  }
 res.cookie("token", token, { httpOnly: true, maxAge: 15 * 60 * 1000, sameSite: 'none', secure: true });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
