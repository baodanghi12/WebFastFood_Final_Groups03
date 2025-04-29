import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  let token = req.cookies.token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ success: false, message: "Unauthorized - Token failed" });
  }
};

export default userAuth;
