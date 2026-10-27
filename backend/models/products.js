const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema(
  {
    pName: {
      type: String,
      required: true,
    },
    pDescription: {
      type: String,
      required: true,
    },
    pPrice: {
      type: Number,
      required: true,
    },
    pSold: {
      type: Number,
      default: 0,
    },
    pQuantity: {
      type: Number,
      default: 0,
    },
    pCategory: {
      type: ObjectId,
      ref: "categories",
    },
    pImages: {
      type: Array,
      required: true,
    },
    pOffer: {
      type: String,
      default: "0",
    },
    pRatingsReviews: [
      {
        review: String,
        user: { type: ObjectId, ref: "users" },
        rating: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    pStatus: {
      type: String,
      required: true,
    },
    // Enhanced fields for Organ Viability & Compatibility
    pBloodGroup: {
      type: String,
      default: "O+",
    },
    pColdIschemiaHours: {
      type: Number,
      default: 12,
    },
    pProcurementCenter: {
      type: String,
      default: "Central Organ Bank",
    },
    pViableUntil: {
      type: Date,
      default: () => new Date(Date.now() + 12 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);
module.exports = productModel;
