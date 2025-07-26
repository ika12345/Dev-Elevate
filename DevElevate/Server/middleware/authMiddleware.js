
import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "User not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticate