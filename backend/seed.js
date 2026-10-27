const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const categoryModel = require("./models/categories");
const productModel = require("./models/products");
const userModel = require("./models/users");
const orderModel = require("./models/orders");
const customizeModel = require("./models/customize");

const seedData = async () => {
  console.log("Checking seed data...");

  // Check or create default users
  const adminEmail = "admin@organease.org";
  const hospitalEmail = "hospital@aims.org";

  let adminUser = await userModel.findOne({ email: adminEmail });
  if (!adminUser) {
    adminUser = await userModel.create({
      name: "National Registry Admin",
      email: adminEmail,
      password: bcrypt.hashSync("admin12345", 10),
      userRole: 1, // Admin / Procurement
      hospitalName: "National Organ & Tissue Transplant Organization (NOTTO)",
      phoneNumber: "1800114770",
      address: "Registry Headquarters, New Delhi",
      verified: true,
    });
    console.log("Created Default Admin:", adminEmail);
  }

  let hospitalUser = await userModel.findOne({ email: hospitalEmail });
  if (!hospitalUser) {
    hospitalUser = await userModel.create({
      name: "Dr. Vikram Sethi",
      email: hospitalEmail,
      password: bcrypt.hashSync("hospital12345", 10),
      userRole: 0, // Hospital / Surgeon
      hospitalName: "AIIMS Apex Trauma Center & Transplant Unit",
      phoneNumber: "+91-9876543210",
      address: "Ansari Nagar, New Delhi - 110029",
      verified: true,
    });
    console.log("Created Default Hospital User:", hospitalEmail);
  }

  // Check or create Categories
  let categoriesCount = await categoryModel.countDocuments();
  let kidneyCat, liverCat, heartCat, lungsCat, corneaCat, pancreasCat;

  if (categoriesCount === 0) {
    kidneyCat = await categoryModel.create({
      cName: "Kidneys",
      cDescription: "Renal allografts for acute and end-stage renal disease transplants. Max Cold Ischemia: 24-36 hrs.",
      cImage: "kidney.png",
      cStatus: "Active",
    });

    liverCat = await categoryModel.create({
      cName: "Liver",
      cDescription: "Hepatic grafts for pediatric and adult orthotopic transplantation. Max Cold Ischemia: 8-12 hrs.",
      cImage: "liver.png",
      cStatus: "Active",
    });

    heartCat = await categoryModel.create({
      cName: "Heart",
      cDescription: "Cardiac allografts for cardiothoracic transplant emergencies. Critical Ischemia: 4-6 hrs.",
      cImage: "heart.png",
      cStatus: "Active",
    });

    lungsCat = await categoryModel.create({
      cName: "Lungs",
      cDescription: "Single & bilateral pulmonary grafts maintained in low-potassium dextran solution. Ischemia: 6-8 hrs.",
      cImage: "lungs.png",
      cStatus: "Active",
    });

    corneaCat = await categoryModel.create({
      cName: "Cornea",
      cDescription: "Ocular corneal endothelium tissue for penetrating keratoplasty. Preservation: Up to 14 days in Optisol.",
      cImage: "cornea.png",
      cStatus: "Active",
    });

    pancreasCat = await categoryModel.create({
      cName: "Pancreas",
      cDescription: "Pancreatic islet and vascular grafts for Type-1 diabetes severe complications. Ischemia: 12-18 hrs.",
      cImage: "pancreas.png",
      cStatus: "Active",
    });

    console.log("Created 6 Organ Categories");
  } else {
    kidneyCat = await categoryModel.findOne({ cName: "Kidneys" });
    liverCat = await categoryModel.findOne({ cName: "Liver" });
    heartCat = await categoryModel.findOne({ cName: "Heart" });
    lungsCat = await categoryModel.findOne({ cName: "Lungs" });
    corneaCat = await categoryModel.findOne({ cName: "Cornea" });
    pancreasCat = await categoryModel.findOne({ cName: "Pancreas" });
  }

  // Check or create Products (Organs)
  let productsCount = await productModel.countDocuments();
  if (productsCount === 0) {
    const sampleOrgans = [
      {
        pName: "Human Left Kidney (Pediatric Compatible)",
        pDescription: "High-viability Left Kidney retrieved from deceased donor. Preserved via Hypothermic Machine Perfusion (HMP) at 4°C with Belzer MPS. HLA typing match confirmed, crossmatch negative.",
        pPrice: 45000,
        pQuantity: 1,
        pCategory: kidneyCat ? kidneyCat._id : null,
        pImages: ["kidney-1.jpg", "kidney-diagram.jpg"],
        pOffer: "0",
        pStatus: "Active",
        pBloodGroup: "O+",
        pColdIschemiaHours: 24,
        pProcurementCenter: "Apollo Multi-Specialty Procurement Bank, Delhi NCR",
        pViableUntil: new Date(Date.now() + 18 * 3600 * 1000),
        pRatingsReviews: [
          {
            rating: "5",
            review: "Perfusion logs and biopsy histology verified. High glomerular filtration prognosis.",
            user: hospitalUser._id,
            createdAt: new Date(),
          },
        ],
      },
      {
        pName: "Cardiac Allograft (Adult Ventricular)",
        pDescription: "Optimal cardiac graft with zero ischemic history prior to retrieval. Stored in Custodiol HTK Cardioplegic Solution at 2-4°C. Echocardiogram LVEF 65%. Urgent STAT requisition required.",
        pPrice: 120000,
        pQuantity: 1,
        pCategory: heartCat ? heartCat._id : null,
        pImages: ["heart-1.jpg", "heart-ecg.jpg"],
        pOffer: "0",
        pStatus: "Active",
        pBloodGroup: "A+",
        pColdIschemiaHours: 6,
        pProcurementCenter: "Fortis Escorts Heart Institute Regional Bank",
        pViableUntil: new Date(Date.now() + 4.5 * 3600 * 1000),
        pRatingsReviews: [],
      },
      {
        pName: "Whole Liver Graft (Orthotopic)",
        pDescription: "Full hepatic graft suitable for whole organ transplantation or split-liver pediatric allocation. Flushed with 4L University of Wisconsin (UW) solution. Minimal macrosteatosis (<5%).",
        pPrice: 95000,
        pQuantity: 1,
        pCategory: liverCat ? liverCat._id : null,
        pImages: ["liver-1.jpg", "liver-ultrasound.jpg"],
        pOffer: "0",
        pStatus: "Active",
        pBloodGroup: "B+",
        pColdIschemiaHours: 10,
        pProcurementCenter: "Medanta Medicity Hypothermic Retrieval Center",
        pViableUntil: new Date(Date.now() + 7 * 3600 * 1000),
        pRatingsReviews: [],
      },
      {
        pName: "Bilateral Pulmonary En-Bloc Graft",
        pDescription: "Double lung allograft harvested from donor with PaO2/FiO2 ratio > 450. Cold storage maintained in Perfadex Plus solution. Bronchoscopy clear, bronchial wash negative.",
        pPrice: 110000,
        pQuantity: 1,
        pCategory: lungsCat ? lungsCat._id : null,
        pImages: ["lungs-1.jpg", "lungs-ct.jpg"],
        pOffer: "0",
        pStatus: "Active",
        pBloodGroup: "O-",
        pColdIschemiaHours: 8,
        pProcurementCenter: "Max Healthcare Pulmonary Retrieval Unit",
        pViableUntil: new Date(Date.now() + 5.2 * 3600 * 1000),
        pRatingsReviews: [],
      },
      {
        pName: "Clear Ocular Cornea (Donor Grade A)",
        pDescription: "High-grade corneal donor button with endothelial cell density > 2,800 cells/mm2. Preserved in Optisol-GS at 2-8°C with gentamycin/streptomycin prophylaxis.",
        pPrice: 20000,
        pQuantity: 2,
        pCategory: corneaCat ? corneaCat._id : null,
        pImages: ["cornea-1.jpg", "cornea-slit.jpg"],
        pOffer: "0",
        pStatus: "Active",
        pBloodGroup: "AB+",
        pColdIschemiaHours: 336,
        pProcurementCenter: "Dr. Rajendra Prasad Centre for Ophthalmic Sciences",
        pViableUntil: new Date(Date.now() + 14 * 24 * 3600 * 1000),
        pRatingsReviews: [],
      },
      {
        pName: "Pancreatic Islet / Vascular En-Bloc",
        pDescription: "Intact pancreas with duodenal loop and vascular cuffs. Cold perfusion executed with chilled Celsior preservation fluid. Certified for whole-organ or islet cell isolation.",
        pPrice: 65000,
        pQuantity: 1,
        pCategory: pancreasCat ? pancreasCat._id : null,
        pImages: ["pancreas-1.jpg", "pancreas-spec.jpg"],
        pOffer: "0",
        pStatus: "Active",
        pBloodGroup: "B-",
        pColdIschemiaHours: 14,
        pProcurementCenter: "Sir Ganga Ram Hospital Transplant Bank",
        pViableUntil: new Date(Date.now() + 11 * 3600 * 1000),
        pRatingsReviews: [],
      },
    ];

    await productModel.insertMany(sampleOrgans);
    console.log("Seeded 6 Clinically Detailed Organs");
  }

  // Check or create sample customize slide
  let slideCount = await customizeModel.countDocuments();
  if (slideCount === 0) {
    await customizeModel.create({
      slideImage: "banner-1.jpg",
      firstShow: 1,
    });
    console.log("Created Default Hero Slide");
  }

  // Create initial sample order if none
  let ordersCount = await orderModel.countDocuments();
  if (ordersCount === 0) {
    let firstProduct = await productModel.findOne({});
    if (firstProduct && hospitalUser) {
      await orderModel.create({
        allProduct: [{ id: firstProduct._id, quantitiy: 1 }],
        user: hospitalUser._id,
        amount: firstProduct.pPrice,
        transactionId: "TXN-ORG-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        address: "OT Wing 4, AIIMS Apex Trauma Center, New Delhi",
        phone: "9876543210",
        urgencyLevel: "Emergency Stat",
        recipientBloodGroup: firstProduct.pBloodGroup || "O+",
        status: "Under Scrutiny",
      });
      console.log("Created Initial Sample Organ Transfer Request");
    }
  }

  console.log("Database Seed Check Complete!");
};

module.exports = seedData;

if (require.main === module) {
  require("dotenv").config();
  const dbUri = process.env.DATABASE || "mongodb://127.0.0.1:27017/OrganEase";
  mongoose
    .connect(dbUri)
    .then(async () => {
      console.log("Connected to MongoDB for direct seed...");
      await seedData();
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seed connection failed:", err.message);
      process.exit(1);
    });
}
