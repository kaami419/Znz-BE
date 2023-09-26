const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header missing",
    });
  }
  
  const [bearer, token] = authHeader.split(" ");
  
  if (bearer !== "Bearer") {
    return res.status(401).json({
      message: "Invalid token format",
    });
  }


  try {
    const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
    req.userData = { sellerId: decodedToken._id };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed",
    });
  }
};