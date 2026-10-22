const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ JWT Token verify karo aur user ko req mein attach karo
const protect = async (req, res, next) => {
  let token;

  // Cookie se token lo (HttpOnly cookie)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Ya Authorization header se (Bearer token)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Please login first.",
    });
  }

  try {
    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User ko database se fetch karo (password exclude)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token invalid.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token expired or invalid. Please login again.",
    });
  }
};

// ✅ Sirf Admin access karne de
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
};

// ✅ JWT Token generate karo aur cookie mein set karo
const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,       // JS se access nahi hoga (XSS protection)
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict",   // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din
  });

  return token;
};

module.exports = { protect, adminOnly, generateTokenAndSetCookie };

