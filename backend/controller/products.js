const productModel = require("../models/products");
const mockStore = require("../config/mockStore");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

class Product {
  static deleteImages(images, mode) {
    if (!images || !Array.isArray(images)) return;
    const basePath = path.join(__dirname, "../public/uploads/products");
    for (let i = 0; i < images.length; i++) {
      let fileName = mode === "file" ? images[i].filename : images[i];
      if (typeof fileName === "string") {
        let filePath = path.join(basePath, fileName);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) {}
        }
      }
    }
  }

  async getAllProduct(req, res) {
    try {
      if (mongoose.connection.readyState === 1) {
        let Products = await productModel
          .find({})
          .populate("pCategory", "_id cName")
          .sort({ _id: -1 });
        return res.json({ Products: Products || [] });
      } else {
        return res.json({ Products: mockStore.getAllProducts() });
      }
    } catch (err) {
      console.error("Error in getAllProduct:", err);
      return res.json({ Products: mockStore.getAllProducts() });
    }
  }

  async postAddProduct(req, res) {
    let {
      pName,
      pDescription,
      pPrice,
      pQuantity,
      pCategory,
      pOffer,
      pStatus,
      pBloodGroup,
      pColdIschemiaHours,
      pProcurementCenter,
    } = req.body;

    let files = req.files || [];
    let images = [];
    if (files.length > 0) {
      images = files.map((f) => f.filename);
    } else if (req.body.pImages) {
      images = Array.isArray(req.body.pImages) ? req.body.pImages : [req.body.pImages];
    } else {
      images = ["https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"];
    }

    if (!pName || !pDescription || pPrice === undefined || pQuantity === undefined || !pCategory) {
      Product.deleteImages(files, "file");
      return res.json({ error: "All required fields must be filled" });
    }

    try {
      let coldHours = Number(pColdIschemiaHours) || 12;
      let viableUntil = new Date(Date.now() + coldHours * 3600 * 1000);

      if (mongoose.connection.readyState === 1) {
        let newProduct = new productModel({
          pName: String(pName),
          pDescription: String(pDescription),
          pPrice: Number(pPrice),
          pQuantity: Number(pQuantity),
          pCategory,
          pImages: images,
          pOffer: pOffer || "0",
          pStatus: pStatus || "Active",
          pBloodGroup: pBloodGroup || "O+",
          pColdIschemiaHours: coldHours,
          pProcurementCenter: pProcurementCenter || "Central Organ Bank",
          pViableUntil: viableUntil,
        });

        let save = await newProduct.save();
        return res.json({ success: "Organ listing created successfully", product: save });
      } else {
        const result = mockStore.addProduct({
          pName,
          pDescription,
          pPrice,
          pQuantity,
          pCategory,
          pImages: images,
          pOffer,
          pStatus,
          pBloodGroup,
          pColdIschemiaHours,
          pProcurementCenter,
        });
        return res.json(result);
      }
    } catch (err) {
      Product.deleteImages(files, "file");
      console.error("Error in postAddProduct:", err);
      return res.status(500).json({ error: "Failed to create product" });
    }
  }

  async postEditProduct(req, res) {
    let {
      pId,
      pName,
      pDescription,
      pPrice,
      pQuantity,
      pCategory,
      pOffer,
      pStatus,
      pBloodGroup,
      pColdIschemiaHours,
      pProcurementCenter,
    } = req.body;

    if (!pId) {
      return res.json({ error: "Organ ID is required" });
    }

    try {
      if (mongoose.connection.readyState === 1) {
        let updateData = {};
        if (pName) updateData.pName = pName;
        if (pDescription) updateData.pDescription = pDescription;
        if (pPrice !== undefined) updateData.pPrice = Number(pPrice);
        if (pQuantity !== undefined) updateData.pQuantity = Number(pQuantity);
        if (pCategory) updateData.pCategory = pCategory;
        if (pOffer !== undefined) updateData.pOffer = pOffer;
        if (pStatus) updateData.pStatus = pStatus;
        if (pBloodGroup) updateData.pBloodGroup = pBloodGroup;
        if (pColdIschemiaHours) {
          updateData.pColdIschemiaHours = Number(pColdIschemiaHours);
          updateData.pViableUntil = new Date(Date.now() + Number(pColdIschemiaHours) * 3600 * 1000);
        }
        if (pProcurementCenter) updateData.pProcurementCenter = pProcurementCenter;

        if (req.files && req.files.length > 0) {
          updateData.pImages = req.files.map((f) => f.filename);
        } else if (req.body.pImages) {
          updateData.pImages = Array.isArray(req.body.pImages) ? req.body.pImages : [req.body.pImages];
        }

        let updatedProduct = await productModel.findByIdAndUpdate(pId, updateData, { new: true });
        if (updatedProduct) {
          return res.json({ success: "Organ listing updated successfully", product: updatedProduct });
        }
        return res.json({ error: "Organ not found" });
      } else {
        const result = mockStore.editProduct({
          pId,
          pName,
          pDescription,
          pPrice,
          pQuantity,
          pCategory,
          pOffer,
          pStatus,
          pBloodGroup,
          pColdIschemiaHours,
          pProcurementCenter,
          pImages: req.body.pImages,
        });
        return res.json(result);
      }
    } catch (err) {
      console.error("Error in postEditProduct:", err);
      return res.status(500).json({ error: "Failed to edit product" });
    }
  }

  async getDeleteProduct(req, res) {
    let { pId } = req.body;
    if (!pId) {
      return res.json({ error: "Organ ID is required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let product = await productModel.findById(pId);
        if (product) {
          if (product.pImages && product.pImages.length > 0) {
            Product.deleteImages(product.pImages, "string");
          }
          await productModel.findByIdAndDelete(pId);
          return res.json({ success: "Organ listing deleted successfully" });
        }
        return res.json({ error: "Organ not found" });
      } else {
        const result = mockStore.deleteProduct(pId);
        return res.json(result);
      }
    } catch (err) {
      console.error("Error in getDeleteProduct:", err);
      return res.status(500).json({ error: "Failed to delete product" });
    }
  }

  async getSingleProduct(req, res) {
    let { pId } = req.body;
    if (!pId) {
      return res.json({ error: "Organ ID is required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let singleProduct = await productModel
          .findById(pId)
          .populate("pCategory", "_id cName")
          .populate("pRatingsReviews.user", "name email");
        if (singleProduct) {
          return res.json({ Product: singleProduct });
        }
        return res.json({ error: "Organ not found" });
      } else {
        const prod = mockStore.getProductById(pId);
        if (prod) return res.json({ Product: prod });
        return res.json({ error: "Organ not found" });
      }
    } catch (err) {
      console.error("Error in getSingleProduct:", err);
      const prod = mockStore.getProductById(pId);
      if (prod) return res.json({ Product: prod });
      return res.status(500).json({ error: "Failed to fetch single product" });
    }
  }

  async getProductByCategory(req, res) {
    let { catId } = req.body;
    if (!catId) {
      return res.json({ error: "Category ID is required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let products = await productModel
          .find({ pCategory: catId })
          .populate("pCategory", "_id cName")
          .sort({ _id: -1 });
        return res.json({ Products: products || [] });
      } else {
        return res.json({ Products: mockStore.getProductsByCategory(catId) });
      }
    } catch (err) {
      console.error("Error in getProductByCategory:", err);
      return res.json({ Products: mockStore.getProductsByCategory(catId) });
    }
  }

  async getProductByPrice(req, res) {
    let { price } = req.body;
    if (price === undefined) {
      return res.json({ error: "Price filter is required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let products = await productModel
          .find({ pPrice: { $lte: Number(price) } })
          .populate("pCategory", "_id cName")
          .sort({ pPrice: 1 });
        return res.json({ Products: products || [] });
      } else {
        const filtered = mockStore.getAllProducts().filter((p) => p.pPrice <= Number(price));
        return res.json({ Products: filtered });
      }
    } catch (err) {
      console.error("Error in getProductByPrice:", err);
      return res.status(500).json({ error: "Failed to filter products by price" });
    }
  }

  async getWishProduct(req, res) {
    let { productArray } = req.body;
    if (!productArray || !Array.isArray(productArray) || productArray.length === 0) {
      return res.json({ Products: [] });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let wishProducts = await productModel.find({ _id: { $in: productArray } });
        return res.json({ Products: wishProducts || [] });
      } else {
        const found = mockStore.getAllProducts().filter((p) => productArray.includes(p._id));
        return res.json({ Products: found });
      }
    } catch (err) {
      console.error("Error in getWishProduct:", err);
      return res.json({ Products: [] });
    }
  }

  async getCartProduct(req, res) {
    let { productArray } = req.body;
    if (!productArray || !Array.isArray(productArray) || productArray.length === 0) {
      return res.json({ Products: [] });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let cartProducts = await productModel.find({ _id: { $in: productArray } });
        return res.json({ Products: cartProducts || [] });
      } else {
        const found = mockStore.getAllProducts().filter((p) => productArray.includes(p._id));
        return res.json({ Products: found });
      }
    } catch (err) {
      console.error("Error in getCartProduct:", err);
      return res.json({ Products: [] });
    }
  }

  async postAddReview(req, res) {
    let { pId, uId, rating, review } = req.body;
    if (!pId || !rating || !review || !uId) {
      return res.json({ error: "All review fields are required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        let product = await productModel.findById(pId);
        if (!product) return res.json({ error: "Organ listing not found" });

        let alreadyReviewed = product.pRatingsReviews.find(
          (r) => r.user && r.user.toString() === uId.toString()
        );

        if (alreadyReviewed) {
          await productModel.findOneAndUpdate(
            { _id: pId, "pRatingsReviews.user": uId },
            {
              $set: {
                "pRatingsReviews.$.rating": String(rating),
                "pRatingsReviews.$.review": review,
                "pRatingsReviews.$.createdAt": new Date(),
              },
            }
          );
          return res.json({ success: "Review updated successfully" });
        } else {
          await productModel.findByIdAndUpdate(pId, {
            $push: {
              pRatingsReviews: {
                review,
                user: uId,
                rating: String(rating),
                createdAt: new Date(),
              },
            },
          });
          return res.json({ success: "Review added successfully" });
        }
      } else {
        const result = mockStore.addReview(pId, uId, rating, review);
        return res.json(result);
      }
    } catch (err) {
      console.error("Error in postAddReview:", err);
      return res.status(500).json({ error: "Failed to add review" });
    }
  }

  async deleteReview(req, res) {
    let { rId, pId } = req.body;
    if (!rId || !pId) {
      return res.json({ error: "Review ID and Organ ID are required" });
    }
    try {
      if (mongoose.connection.readyState === 1) {
        await productModel.findByIdAndUpdate(pId, {
          $pull: { pRatingsReviews: { _id: rId } },
        });
        return res.json({ success: "Review deleted successfully" });
      } else {
        const result = mockStore.deleteReview(pId, rId);
        return res.json(result);
      }
    } catch (err) {
      console.error("Error in deleteReview:", err);
      return res.status(500).json({ error: "Failed to delete review" });
    }
  }
}

const productController = new Product();
module.exports = productController;
