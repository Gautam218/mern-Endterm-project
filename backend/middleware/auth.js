const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const userModel = require("../models/users");
const mockStore = require("../config/mockStore");
const mongoose = require("mongoose");

exports.loginCheck = (req, res, next) => {
  try {
    let token = req.headers.token || req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Authentication token missing" });
    }
    token = token.replace("Bearer ", "").trim();
    const decode = jwt.verify(token, JWT_SECRET);
    req.userDetails = decode;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "You must be logged in",
      message: err.message,
    });
  }
};

exports.isAuth = (req, res, next) => {
  let { loggedInUserId } = req.body;
  const currentUserId = req.userDetails && req.userDetails._id;
  if (!loggedInUserId || !currentUserId || String(loggedInUserId) !== String(currentUserId)) {
    return res.status(403).json({ error: "You are not authorized for this resource" });
  }
  next();
};

exports.isAdmin = async (req, res, next) => {
  try {
    const userId = req.body.loggedInUserId || (req.userDetails && req.userDetails._id);
    let role = null;

    if (req.userDetails && req.userDetails.role !== undefined) {
      role = req.userDetails.role;
    } else if (mongoose.connection.readyState === 1) {
      let reqUser = await userModel.findById(userId);
      if (reqUser) role = reqUser.userRole;
    } else {
      let reqUser = mockStore.findUserById(userId);
      if (reqUser) role = reqUser.userRole;
    }

    if (role !== 1) {
      return res.status(403).json({ error: "Access denied: Procurement Admin privileges required" });
    }
    next();
  } catch (err) {
    return res.status(403).json({ error: "Access denied" });
  }
};
