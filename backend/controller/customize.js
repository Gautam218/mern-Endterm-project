const fs = require("fs");
const path = require("path");
const categoryModel = require("../models/categories");
const productModel = require("../models/products");
const orderModel = require("../models/orders");
const userModel = require("../models/users");
const customizeModel = require("../models/customize");
const mockStore = require("../config/mockStore");
const mongoose = require("mongoose");

class Customize {
  async getImages(req, res) {
    try {
      if (mongoose.connection.readyState === 1) {
        let Images = await customizeModel.find({}).sort({ _id: -1 });
        return res.json({ Images: Images || [] });
      } else {
        return res.json({ Images: mockStore.getSlides() });
      }
    } catch (err) {
      console.error("Error in getImages:", err);
      return res.json({ Images: mockStore.getSlides() });
    }
  }

  async uploadSlideImage(req, res) {
    let image = req.file ? req.file.filename : req.body.image;
    if (!image) {
      return res.json({ error: "Image file or URL is required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let newCustomize = new customizeModel({
          slideImage: image,
        });
        let save = await newCustomize.save();
        if (save) {
          return res.json({ success: "Image uploaded successfully", data: save });
        }
      } else {
        const slide = {
          _id: "slide_" + Date.now(),
          slideImage: image,
          firstShow: mockStore.slides.length + 1,
          createdAt: new Date().toISOString(),
        };
        mockStore.slides.push(slide);
        return res.json({ success: "Image uploaded successfully", data: slide });
      }
    } catch (err) {
      console.error("Error in uploadSlideImage:", err);
      return res.status(500).json({ error: "Failed to save slide image" });
    }
  }

  async deleteSlideImage(req, res) {
    let { id } = req.body;
    if (!id) {
      return res.json({ error: "Slide ID is required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let slide = await customizeModel.findById(id);
        if (slide) {
          if (slide.slideImage) {
            const filePath = path.join(__dirname, "../public/uploads/customize", slide.slideImage);
            if (fs.existsSync(filePath)) {
              try { fs.unlinkSync(filePath); } catch (e) {}
            }
          }
          await customizeModel.findByIdAndDelete(id);
          return res.json({ success: "Image deleted successfully" });
        }
        return res.json({ error: "Slide image not found" });
      } else {
        const index = mockStore.slides.findIndex((s) => s._id === id);
        if (index > -1) {
          mockStore.slides.splice(index, 1);
          return res.json({ success: "Image deleted successfully" });
        }
        return res.json({ error: "Slide image not found" });
      }
    } catch (err) {
      console.error("Error in deleteSlideImage:", err);
      return res.status(500).json({ error: "Failed to delete image" });
    }
  }

  async getAllData(req, res) {
    try {
      if (mongoose.connection.readyState === 1) {
        let Categories = await categoryModel.countDocuments();
        let Products = await productModel.countDocuments();
        let Orders = await orderModel.countDocuments();
        let Users = await userModel.countDocuments();

        let recentOrders = await orderModel
          .find({})
          .populate("allProduct.id", "pName pPrice")
          .populate("user", "name email hospitalName")
          .sort({ _id: -1 })
          .limit(5);

        return res.json({
          Categories,
          Products,
          Orders,
          Users,
          recentOrders: recentOrders || [],
        });
      } else {
        return res.json(mockStore.getDashboardData());
      }
    } catch (err) {
      console.error("Error in getAllData:", err);
      return res.json(mockStore.getDashboardData());
    }
  }
}

const customizeController = new Customize();
module.exports = customizeController;
