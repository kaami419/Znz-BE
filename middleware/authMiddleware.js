const jwt = require("jsonwebtoken");

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
    const decodedToken = await jwt.verify(token, "paypal");
    req.userData = { sellerId: decodedToken._id };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed",
    });
  }
};