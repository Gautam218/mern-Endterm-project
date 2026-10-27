const orderModel = require("../models/orders");
const mockStore = require("../config/mockStore");
const mongoose = require("mongoose");

class Order {
  async getAllOrders(req, res) {
    try {
      if (mongoose.connection.readyState === 1) {
        let Orders = await orderModel
          .find({})
          .populate("allProduct.id", "pName pImages pPrice pBloodGroup pColdIschemiaHours")
          .populate("user", "name email phoneNumber hospitalName")
          .sort({ _id: -1 });
        return res.json({ Orders: Orders || [] });
      } else {
        return res.json({ Orders: mockStore.getAllOrders() });
      }
    } catch (err) {
      console.error("Error in getAllOrders:", err);
      return res.json({ Orders: mockStore.getAllOrders() });
    }
  }

  async getOrderByUser(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ message: "User ID is required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let Order = await orderModel
          .find({ user: uId })
          .populate("allProduct.id", "pName pImages pPrice pBloodGroup pColdIschemiaHours")
          .populate("user", "name email phoneNumber hospitalName")
          .sort({ _id: -1 });
        return res.json({ Order: Order || [] });
      } else {
        return res.json({ Order: mockStore.getOrdersByUser(uId) });
      }
    } catch (err) {
      console.error("Error in getOrderByUser:", err);
      return res.json({ Order: mockStore.getOrdersByUser(uId) });
    }
  }

  async postCreateOrder(req, res) {
    let { allProduct, user, amount, transactionId, address, phone, urgencyLevel, recipientBloodGroup } = req.body;
    if (!allProduct || !user || !amount || !transactionId || !address || !phone) {
      return res.json({ message: "All required fields must be provided" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let newOrder = new orderModel({
          allProduct,
          user,
          amount,
          transactionId,
          address,
          phone,
          urgencyLevel: urgencyLevel || "Urgent",
          recipientBloodGroup: recipientBloodGroup || "O+",
          status: "Not processed",
        });
        let save = await newOrder.save();
        return res.json({ success: "Organ transfer request submitted successfully", order: save });
      } else {
        const result = mockStore.createOrder({
          allProduct,
          user,
          amount,
          transactionId,
          address,
          phone,
          urgencyLevel,
          recipientBloodGroup,
        });
        return res.json(result);
      }
    } catch (err) {
      console.error("Error in postCreateOrder:", err);
      return res.status(500).json({ error: "Failed to create order" });
    }
  }

  async postUpdateOrder(req, res) {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "Order ID and status are required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let updatedOrder = await orderModel.findByIdAndUpdate(
          oId,
          { status: status, updatedAt: Date.now() },
          { new: true }
        );
        if (updatedOrder) {
          return res.json({ success: "Order status updated successfully", order: updatedOrder });
        }
        return res.json({ error: "Order not found" });
      } else {
        const result = mockStore.updateOrderStatus(oId, status);
        return res.json(result);
      }
    } catch (err) {
      console.error("Error in postUpdateOrder:", err);
      return res.status(500).json({ error: "Failed to update order" });
    }
  }

  async postDeleteOrder(req, res) {
    let { oId } = req.body;
    if (!oId) {
      return res.json({ error: "Order ID is required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let deleteOrder = await orderModel.findByIdAndDelete(oId);
        if (deleteOrder) {
          return res.json({ success: "Order record deleted successfully" });
        }
        return res.json({ error: "Order not found" });
      } else {
        const result = mockStore.deleteOrder(oId);
        return res.json(result);
      }
    } catch (error) {
      console.error("Error in postDeleteOrder:", error);
      return res.status(500).json({ error: "Failed to delete order" });
    }
  }
}

const ordersController = new Order();
module.exports = ordersController;
