const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 64,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    },
    password: {
      type: String,
      required: true,
    },
    userRole: {
      type: Number,
      required: true,
      default: 0, // 0: Hospital / Transplant Center, 1: Procurement Admin
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    userImage: {
      type: String,
      default: "user.png",
    },
    hospitalName: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: true,
    },
    secretKey: {
      type: String,
      default: null,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
