const userModel = require("../models/users");
const mockStore = require("../config/mockStore");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

class User {
  async getAllUser(req, res) {
    try {
      if (mongoose.connection.readyState === 1) {
        let Users = await userModel
          .find({})
          .select("-password")
          .sort({ _id: -1 });
        return res.json({ Users: Users || [] });
      } else {
        return res.json({ Users: mockStore.users.map(({ password, ...u }) => u) });
      }
    } catch (err) {
      console.error("Error in getAllUser:", err);
      return res.json({ Users: mockStore.users.map(({ password, ...u }) => u) });
    }
  }

  async getSingleUser(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ error: "User ID is required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let User = await userModel
          .findById(uId)
          .select("name email phoneNumber userRole hospitalName address userImage updatedAt createdAt");
        if (User) {
          return res.json({ User });
        }
        return res.json({ error: "User not found" });
      } else {
        const u = mockStore.findUserById(uId);
        if (u) {
          const { password, ...safeUser } = u;
          return res.json({ User: safeUser });
        }
        return res.json({ error: "User not found" });
      }
    } catch (err) {
      console.error("Error in getSingleUser:", err);
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  async postAddUser(req, res) {
    let { name, email, password, userRole, phoneNumber, hospitalName, address } = req.body;
    if (!name || !email || !password) {
      return res.json({ message: "Name, email and password are required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let existing = await userModel.findOne({ email });
        if (existing) {
          return res.json({ error: "Email already registered" });
        }
        let hashedPassword = bcrypt.hashSync(password, 10);
        let newUser = new userModel({
          name,
          email,
          password: hashedPassword,
          userRole: userRole !== undefined ? Number(userRole) : 0,
          phoneNumber: phoneNumber || "",
          hospitalName: hospitalName || "",
          address: address || "",
        });
        let save = await newUser.save();
        return res.json({ success: "User registered successfully", user: save });
      } else {
        const result = mockStore.addUser({ name, email, password, userRole, phoneNumber, hospitalName, address });
        return res.json(result);
      }
    } catch (err) {
      console.error("Error in postAddUser:", err);
      return res.status(500).json({ error: "Failed to create user" });
    }
  }

  async postEditUser(req, res) {
    let { uId, name, phoneNumber, hospitalName, address } = req.body;
    if (!uId || !name) {
      return res.json({ message: "User ID and name are required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let updateData = { name, updatedAt: Date.now() };
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
        if (hospitalName !== undefined) updateData.hospitalName = hospitalName;
        if (address !== undefined) updateData.address = address;

        let updated = await userModel.findByIdAndUpdate(uId, updateData, { new: true });
        if (updated) {
          return res.json({ success: "Profile updated successfully", user: updated });
        }
        return res.json({ error: "User not found" });
      } else {
        const result = mockStore.updateUser(uId, { name, phoneNumber, hospitalName, address });
        return res.json(result);
      }
    } catch (err) {
      console.error("Error in postEditUser:", err);
      return res.status(500).json({ error: "Failed to update user" });
    }
  }

  async getDeleteUser(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ message: "User ID is required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let deleted = await userModel.findByIdAndDelete(uId);
        if (deleted) {
          return res.json({ success: "User account deleted successfully" });
        }
        return res.json({ error: "User not found" });
      } else {
        const index = mockStore.users.findIndex((u) => u._id === uId);
        if (index > -1) {
          mockStore.users.splice(index, 1);
          return res.json({ success: "User account deleted successfully" });
        }
        return res.json({ error: "User not found" });
      }
    } catch (err) {
      console.error("Error in getDeleteUser:", err);
      return res.status(500).json({ error: "Failed to delete user" });
    }
  }

  async changePassword(req, res) {
    let { uId, oldPassword, newPassword } = req.body;
    if (!uId || !oldPassword || !newPassword) {
      return res.json({ message: "All fields are required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        const data = await userModel.findById(uId);
        if (!data) return res.json({ error: "User not found" });
        const oldPassCheck = await bcrypt.compare(oldPassword, data.password);
        if (oldPassCheck) {
          const hashedPassword = bcrypt.hashSync(newPassword, 10);
          await userModel.findByIdAndUpdate(uId, { password: hashedPassword });
          return res.json({ success: "Password updated successfully" });
        } else {
          return res.json({ error: "Incorrect current password" });
        }
      } else {
        const user = mockStore.findUserById(uId);
        if (!user) return res.json({ error: "User not found" });
        const oldPassCheck = await bcrypt.compare(oldPassword, user.password);
        if (oldPassCheck) {
          user.password = bcrypt.hashSync(newPassword, 10);
          return res.json({ success: "Password updated successfully" });
        } else {
          return res.json({ error: "Incorrect current password" });
        }
      }
    } catch (err) {
      console.error("Error in changePassword:", err);
      return res.status(500).json({ error: "Failed to change password" });
    }
  }
}

const usersController = new User();
module.exports = usersController;
