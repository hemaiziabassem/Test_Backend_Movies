const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(
        token.split(" ")[1],
        process.env.JWT_SECRET_KEY || "testMovieApi"
      );
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "invalid token" });
    }
  } else {
    res.status(401).json({ message: "no token provided!!" });
  }
};

module.exports = {
  verifyToken,
};
