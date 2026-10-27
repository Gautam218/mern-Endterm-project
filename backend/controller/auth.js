const { toTitleCase, validateEmail } = require("../config/function");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users");
const mockStore = require("../config/mockStore");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");

class Auth {
  async isAdmin(req, res) {
    let { loggedInUserId } = req.body;
    try {
      if (mongoose.connection.readyState === 1) {
        let loggedInUser = await userModel.findById(loggedInUserId);
        if (!loggedInUser) return res.status(404).json({ error: "User not found" });
        return res.json({ role: loggedInUser.userRole });
      } else {
        const u = mockStore.findUserById(loggedInUserId);
        if (u) return res.json({ role: u.userRole });
        return res.status(404).json({ error: "User not found" });
      }
    } catch {
      return res.status(404).json({ error: "Invalid user" });
    }
  }

  async allUser(req, res) {
    try {
      if (mongoose.connection.readyState === 1) {
        let allUser = await userModel.find({}).select("-password");
        return res.json({ users: allUser });
      } else {
        return res.json({ users: mockStore.users.map(({ password, ...u }) => u) });
      }
    } catch {
      return res.status(500).json({ error: "Server error" });
    }
  }

  /* User Registration / Signup controller */
  async postSignup(req, res) {
    let { name, email, password, cPassword, userRole, phoneNumber, hospitalName } = req.body;
    let error = {};

    if (!name || !email || !password || !cPassword) {
      error = {
        name: !name ? "Field must not be empty" : "",
        email: !email ? "Field must not be empty" : "",
        password: !password ? "Field must not be empty" : "",
        cPassword: !cPassword ? "Field must not be empty" : "",
      };
      return res.json({ error });
    }

    if (password !== cPassword) {
      return res.json({ error: { password: "Passwords do not match", cPassword: "Passwords do not match" } });
    }

    if (name.length < 3 || name.length > 50) {
      return res.json({ error: { name: "Name must be 3-50 characters" } });
    }

    if (!validateEmail(email)) {
      return res.json({ error: { email: "Please enter a valid email address" } });
    }

    if (password.length < 6) {
      return res.json({ error: { password: "Password must be at least 6 characters" } });
    }

    try {
      name = toTitleCase(name);
      const cleanEmail = email.toLowerCase().trim();
      const assignedRole = userRole !== undefined ? Number(userRole) : 0;

      if (mongoose.connection.readyState === 1) {
        const data = await userModel.findOne({ email: cleanEmail });
        if (data) {
          return res.json({ error: { email: "Email already registered" } });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        let newUser = new userModel({
          name,
          email: cleanEmail,
          password: hashedPassword,
          userRole: assignedRole,
          phoneNumber: phoneNumber || "",
          hospitalName: hospitalName || name,
          verified: true,
        });

        await newUser.save();
        return res.json({
          success: "Account created successfully. Please login to continue.",
        });
      } else {
        const result = mockStore.addUser({
          name,
          email: cleanEmail,
          password,
          userRole: assignedRole,
          phoneNumber,
          hospitalName,
        });
        if (result.error) {
          return res.json({ error: { email: result.error } });
        }
        return res.json({
          success: "Account created successfully. Please login to continue.",
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      return res.status(500).json({ error: "Server error during registration" });
    }
  }

  /* User Login / Signin controller */
  async postSignin(req, res) {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        error: "Please enter email and password",
      });
    }

    try {
      const cleanEmail = email.toLowerCase().trim();
      let user = null;

      if (mongoose.connection.readyState === 1) {
        user = await userModel.findOne({ email: cleanEmail });
      } else {
        user = mockStore.findUserByEmail(cleanEmail);
      }

      if (!user) {
        return res.json({
          error: "Invalid email or password",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({
          error: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        { _id: user._id, role: user.userRole, name: user.name, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        token: token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.userRole,
          userRole: user.userRole,
          hospitalName: user.hospitalName,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (err) {
      console.error("Signin error:", err);
      return res.status(500).json({ error: "Server error during signin" });
    }
  }
}

const authController = new Auth();
module.exports = authController;
