import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT;

export const generateToken = (userId) => {
  const payload = {
    userId: userId,
  };
  return jwt.sign(payload, process.env.JWT, { expiresIn: "1h" });
};

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ mess: "Access denied. No token provided." });
  }
  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err) {
      return res.status(403).json({ mess: "Invalid token." });
    }
    req.userId = decoded.userId;
    next();
  });
};

// module.exports = {
//   SECRET_KEY,
//   generateToken,
//   authenticateToken,
// };
