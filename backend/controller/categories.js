const { toTitleCase } = require("../config/function");
const categoryModel = require("../models/categories");
const mockStore = require("../config/mockStore");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

class Category {
  async getAllCategory(req, res) {
    try {
      if (mongoose.connection.readyState === 1) {
        let Categories = await categoryModel.find({}).sort({ _id: -1 });
        return res.json({ Categories: Categories || [] });
      } else {
        return res.json({ Categories: mockStore.getAllCategories() });
      }
    } catch (err) {
      console.error("Error in getAllCategory:", err);
      return res.json({ Categories: mockStore.getAllCategories() });
    }
  }

  async postAddCategory(req, res) {
    let { cName, cDescription, cStatus } = req.body;
    let cImage = req.file ? req.file.filename : (req.body.cImage || "default-organ.png");
    const filePath = req.file ? path.join(__dirname, "../public/uploads/categories", req.file.filename) : null;

    if (!cName || !cDescription || !cStatus) {
      if (filePath && fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
      return res.json({ error: "All fields are required" });
    }

    cName = toTitleCase(cName);
    try {
      if (mongoose.connection.readyState === 1) {
        let checkCategoryExists = await categoryModel.findOne({ cName: cName });
        if (checkCategoryExists) {
          if (filePath && fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch (e) {}
          }
          return res.json({ error: "Category already exists" });
        }

        let newCategory = new categoryModel({
          cName,
          cDescription,
          cStatus,
          cImage,
        });
        await newCategory.save();
        return res.json({ success: "Category created successfully", category: newCategory });
      } else {
        const result = mockStore.addCategory({ cName, cDescription, cStatus, cImage });
        return res.json(result);
      }
    } catch (err) {
      console.error("Error in postAddCategory:", err);
      return res.status(500).json({ error: "Failed to create category" });
    }
  }

  async postEditCategory(req, res) {
    let { cId, cDescription, cStatus, cName } = req.body;
    if (!cId || !cDescription || !cStatus) {
      return res.json({ error: "All fields are required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let updateFields = { cDescription, cStatus };
        if (cName) updateFields.cName = toTitleCase(cName);
        let updated = await categoryModel.findByIdAndUpdate(cId, updateFields, { new: true });
        if (updated) {
          return res.json({ success: "Category updated successfully", category: updated });
        }
        return res.json({ error: "Category not found" });
      } else {
        const result = mockStore.editCategory({ cId, cName, cDescription, cStatus });
        return res.json(result);
      }
    } catch (err) {
      console.error("Error in postEditCategory:", err);
      return res.status(500).json({ error: "Failed to update category" });
    }
  }

  async getDeleteCategory(req, res) {
    let { cId } = req.body;
    if (!cId) {
      return res.json({ error: "Category ID is required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let deleted = await categoryModel.findById(cId);
        if (deleted) {
          if (deleted.cImage) {
            const filePath = path.join(__dirname, "../public/uploads/categories", deleted.cImage);
            if (fs.existsSync(filePath)) {
              try { fs.unlinkSync(filePath); } catch (e) {}
            }
          }
          await categoryModel.findByIdAndDelete(cId);
          return res.json({ success: "Category deleted successfully" });
        }
        return res.json({ error: "Category not found" });
      } else {
        const result = mockStore.deleteCategory(cId);
        return res.json(result);
      }
    } catch (err) {
      console.error("Error in getDeleteCategory:", err);
      return res.status(500).json({ error: "Failed to delete category" });
    }
  }
}

const categoryController = new Category();
module.exports = categoryController;
