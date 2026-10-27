const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema(
  {
    allProduct: [
      {
        id: { type: ObjectId, ref: "products" },
        quantitiy: { type: Number, default: 1 },
      },
    ],
    user: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    urgencyLevel: {
      type: String,
      enum: ["Standard", "Urgent", "Emergency Stat"],
      default: "Urgent",
    },
    recipientBloodGroup: {
      type: String,
      default: "O+",
    },
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Under Scrutiny",
        "Request Accepted",
        "In Transit",
        "Delivered",
        "Expired",
        "Cancelled",
      ],
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("orders", orderSchema);
module.exports = orderModel;
