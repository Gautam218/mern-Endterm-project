const bcrypt = require("bcryptjs");

const MOCK_CATEGORIES = [
  {
    _id: "cat_kidney_01",
    cName: "Kidneys",
    cDescription: "Renal allografts for acute and end-stage renal disease transplants. Max Cold Ischemia: 24-36 hrs.",
    cImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
    cStatus: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "cat_liver_02",
    cName: "Liver",
    cDescription: "Hepatic grafts for pediatric and adult orthotopic transplantation. Max Cold Ischemia: 8-12 hrs.",
    cImage: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80",
    cStatus: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "cat_heart_03",
    cName: "Heart",
    cDescription: "Cardiac allografts for cardiothoracic transplant emergencies. Critical Cold Ischemia: 4-6 hrs.",
    cImage: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=600&q=80",
    cStatus: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "cat_lungs_04",
    cName: "Lungs",
    cDescription: "Single & bilateral pulmonary grafts maintained in low-potassium dextran solution. Ischemia: 6-8 hrs.",
    cImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
    cStatus: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "cat_cornea_05",
    cName: "Cornea",
    cDescription: "Ocular corneal endothelium tissue for penetrating keratoplasty. Preservation: Up to 14 days in Optisol.",
    cImage: "https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?auto=format&fit=crop&w=600&q=80",
    cStatus: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "cat_pancreas_06",
    cName: "Pancreas",
    cDescription: "Pancreatic islet and vascular grafts for Type-1 diabetes severe complications. Ischemia: 12-18 hrs.",
    cImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
    cStatus: "Active",
    createdAt: new Date().toISOString(),
  },
];

const MOCK_USERS = [
  {
    _id: "usr_admin_01",
    name: "National Registry Admin",
    email: "admin@organease.org",
    password: bcrypt.hashSync("admin12345", 10),
    userRole: 1, // Admin / Procurement Centre
    hospitalName: "National Organ & Tissue Transplant Organization (NOTTO)",
    phoneNumber: "1800114770",
    address: "National Transplant Operations Center, New Delhi",
    userImage: "admin.png",
    verified: true,
  },
  {
    _id: "usr_hospital_01",
    name: "Dr. Vikram Sethi",
    email: "hospital@aims.org",
    password: bcrypt.hashSync("hospital12345", 10),
    userRole: 0, // Hospital / Surgeon
    hospitalName: "AIIMS Apex Trauma Center & Transplant Unit",
    phoneNumber: "+91-9876543210",
    address: "Transplant Surgery Ward 4B, AIIMS, Ansari Nagar, New Delhi",
    userImage: "user.png",
    verified: true,
  },
];

const MOCK_PRODUCTS = [
  {
    _id: "org_kidney_01",
    pName: "Human Left Kidney (Pediatric Compatible)",
    pDescription: "High-viability Left Kidney retrieved from deceased brain-dead donor (DBD). Preserved via Hypothermic Machine Perfusion (HMP) at 4°C with Belzer MPS. HLA typing match confirmed, crossmatch negative. Vascular cuffs intact.",
    pPrice: 45000,
    pSold: 0,
    pQuantity: 1,
    pCategory: { _id: "cat_kidney_01", cName: "Kidneys" },
    pImages: [
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    ],
    pOffer: "0",
    pStatus: "Active",
    pBloodGroup: "O+",
    pColdIschemiaHours: 24,
    pProcurementCenter: "Apollo Multi-Specialty Procurement Bank, Delhi NCR",
    pViableUntil: new Date(Date.now() + 18.5 * 3600 * 1000).toISOString(),
    pRatingsReviews: [
      {
        _id: "rev_01",
        rating: "5",
        review: "Biopsy histological score 1/4. Resistive index 0.18 under pulsatile perfusion. Highly viable.",
        user: { _id: "usr_hospital_01", name: "Dr. Vikram Sethi", email: "hospital@aims.org" },
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "org_heart_02",
    pName: "Cardiac Allograft (Adult Ventricular)",
    pDescription: "Optimal cardiac graft with zero ischemic history prior to retrieval. Stored in Custodiol HTK Cardioplegic Solution at 2-4°C. Donor LVEF 65%, coronary angiogram completely normal. Urgent STAT requisition required.",
    pPrice: 120000,
    pSold: 0,
    pQuantity: 1,
    pCategory: { _id: "cat_heart_03", cName: "Heart" },
    pImages: [
      "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
    ],
    pOffer: "0",
    pStatus: "Active",
    pBloodGroup: "A+",
    pColdIschemiaHours: 6,
    pProcurementCenter: "Fortis Escorts Heart Institute Regional Bank",
    pViableUntil: new Date(Date.now() + 3.8 * 3600 * 1000).toISOString(),
    pRatingsReviews: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "org_liver_03",
    pName: "Whole Liver Graft (Orthotopic)",
    pDescription: "Full hepatic graft suitable for whole organ transplantation or split-liver pediatric allocation. Flushed with 4L University of Wisconsin (UW) solution. Minimal macrosteatosis (<5%), donor LFTs normal.",
    pPrice: 95000,
    pSold: 0,
    pQuantity: 1,
    pCategory: { _id: "cat_liver_02", cName: "Liver" },
    pImages: [
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=800&q=80",
    ],
    pOffer: "0",
    pStatus: "Active",
    pBloodGroup: "B+",
    pColdIschemiaHours: 12,
    pProcurementCenter: "Medanta Medicity Hypothermic Retrieval Center",
    pViableUntil: new Date(Date.now() + 8.2 * 3600 * 1000).toISOString(),
    pRatingsReviews: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "org_lungs_04",
    pName: "Bilateral Pulmonary En-Bloc Graft",
    pDescription: "Double lung allograft harvested from donor with PaO2/FiO2 ratio > 460. Cold storage maintained in Perfadex Plus solution with prostaglandin flush. Bronchoscopy clear, bronchial wash negative.",
    pPrice: 110000,
    pSold: 0,
    pQuantity: 1,
    pCategory: { _id: "cat_lungs_04", cName: "Lungs" },
    pImages: [
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
    ],
    pOffer: "0",
    pStatus: "Active",
    pBloodGroup: "O-", // Universal donor
    pColdIschemiaHours: 8,
    pProcurementCenter: "Max Healthcare Pulmonary Retrieval Unit",
    pViableUntil: new Date(Date.now() + 5.1 * 3600 * 1000).toISOString(),
    pRatingsReviews: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "org_cornea_05",
    pName: "Clear Ocular Cornea (Donor Grade A)",
    pDescription: "High-grade corneal donor button with endothelial cell density > 2,850 cells/mm2. Preserved in Optisol-GS at 2-8°C with gentamycin/streptomycin prophylaxis. Clear stroma, intact epithelium.",
    pPrice: 20000,
    pSold: 0,
    pQuantity: 2,
    pCategory: { _id: "cat_cornea_05", cName: "Cornea" },
    pImages: [
      "https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    ],
    pOffer: "0",
    pStatus: "Active",
    pBloodGroup: "AB+",
    pColdIschemiaHours: 336,
    pProcurementCenter: "Dr. Rajendra Prasad Centre for Ophthalmic Sciences",
    pViableUntil: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString(),
    pRatingsReviews: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "org_pancreas_06",
    pName: "Pancreatic Islet & Vascular En-Bloc",
    pDescription: "Intact pancreas with duodenal loop and vascular mesenteric cuffs. Cold perfusion executed with chilled Celsior preservation fluid. Certified for whole-organ or islet cell isolation.",
    pPrice: 65000,
    pSold: 0,
    pQuantity: 1,
    pCategory: { _id: "cat_pancreas_06", cName: "Pancreas" },
    pImages: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
    ],
    pOffer: "0",
    pStatus: "Active",
    pBloodGroup: "B-",
    pColdIschemiaHours: 14,
    pProcurementCenter: "Sir Ganga Ram Hospital Transplant Bank",
    pViableUntil: new Date(Date.now() + 9.5 * 3600 * 1000).toISOString(),
    pRatingsReviews: [],
    createdAt: new Date().toISOString(),
  },
];

const MOCK_ORDERS = [
  {
    _id: "ord_transfer_01",
    allProduct: [
      {
        id: {
          _id: "org_heart_02",
          pName: "Cardiac Allograft (Adult Ventricular)",
          pImages: ["https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80"],
          pPrice: 120000,
          pBloodGroup: "A+",
          pColdIschemiaHours: 6,
        },
        quantitiy: 1,
      },
    ],
    user: {
      _id: "usr_hospital_01",
      name: "Dr. Vikram Sethi",
      email: "hospital@aims.org",
      phoneNumber: "+91-9876543210",
      hospitalName: "AIIMS Apex Trauma Center & Transplant Unit",
    },
    amount: 120000,
    transactionId: "TXN-ORG-99824X",
    address: "OT Wing 4, AIIMS Apex Trauma Center, New Delhi",
    phone: "9876543210",
    urgencyLevel: "Emergency Stat",
    recipientBloodGroup: "A+",
    status: "Under Scrutiny",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    _id: "ord_transfer_02",
    allProduct: [
      {
        id: {
          _id: "org_kidney_01",
          pName: "Human Left Kidney (Pediatric Compatible)",
          pImages: ["https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"],
          pPrice: 45000,
          pBloodGroup: "O+",
          pColdIschemiaHours: 24,
        },
        quantitiy: 1,
      },
    ],
    user: {
      _id: "usr_hospital_01",
      name: "Dr. Vikram Sethi",
      email: "hospital@aims.org",
      phoneNumber: "+91-9876543210",
      hospitalName: "AIIMS Apex Trauma Center & Transplant Unit",
    },
    amount: 45000,
    transactionId: "TXN-ORG-77142A",
    address: "Renal Transplant Unit, Block 3, AIIMS, New Delhi",
    phone: "9876543210",
    urgencyLevel: "Urgent",
    recipientBloodGroup: "O+",
    status: "Request Accepted",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
  },
];

const MOCK_SLIDES = [
  {
    _id: "slide_01",
    slideImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80",
    title: "National Organ & Tissue Allocation Network",
    subtitle: "Real-time hypothermic storage tracking and secure emergency transfer protocol.",
    firstShow: 1,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "slide_02",
    slideImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80",
    title: "Cold Ischemia Viability Monitoring",
    subtitle: "Connecting transplant surgery wards directly with regional procurement hypothermic banks.",
    firstShow: 2,
    createdAt: new Date().toISOString(),
  },
];

// In-Memory Storage instance
class MockStore {
  constructor() {
    this.categories = [...MOCK_CATEGORIES];
    this.products = [...MOCK_PRODUCTS];
    this.users = [...MOCK_USERS];
    this.orders = [...MOCK_ORDERS];
    this.slides = [...MOCK_SLIDES];
  }

  // Categories
  getAllCategories() {
    return [...this.categories].reverse();
  }

  addCategory({ cName, cDescription, cStatus, cImage }) {
    const exists = this.categories.some((c) => c.cName.toLowerCase() === cName.toLowerCase());
    if (exists) return { error: "Category already exists" };
    const newCat = {
      _id: "cat_" + Date.now(),
      cName,
      cDescription,
      cStatus: cStatus || "Active",
      cImage: cImage || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
      createdAt: new Date().toISOString(),
    };
    this.categories.push(newCat);
    return { success: "Category created successfully", category: newCat };
  }

  editCategory({ cId, cName, cDescription, cStatus }) {
    const index = this.categories.findIndex((c) => c._id === cId);
    if (index === -1) return { error: "Category not found" };
    if (cName) this.categories[index].cName = cName;
    if (cDescription) this.categories[index].cDescription = cDescription;
    if (cStatus) this.categories[index].cStatus = cStatus;
    return { success: "Category updated successfully", category: this.categories[index] };
  }

  deleteCategory(cId) {
    const index = this.categories.findIndex((c) => c._id === cId);
    if (index === -1) return { error: "Category not found" };
    this.categories.splice(index, 1);
    return { success: "Category deleted successfully" };
  }

  // Products
  getAllProducts() {
    return [...this.products].reverse();
  }

  getProductById(pId) {
    const prod = this.products.find((p) => p._id === pId);
    return prod || null;
  }

  getProductsByCategory(catId) {
    return this.products.filter(
      (p) => p.pCategory && (p.pCategory._id === catId || p.pCategory === catId)
    );
  }

  addProduct(data) {
    const cat = this.categories.find((c) => c._id === data.pCategory) || { _id: data.pCategory, cName: "Organ" };
    const coldHours = Number(data.pColdIschemiaHours) || 12;
    const newProd = {
      _id: "org_" + Date.now(),
      pName: data.pName,
      pDescription: data.pDescription,
      pPrice: Number(data.pPrice),
      pQuantity: Number(data.pQuantity) || 1,
      pCategory: cat,
      pImages: data.pImages || ["https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"],
      pOffer: data.pOffer || "0",
      pStatus: data.pStatus || "Active",
      pBloodGroup: data.pBloodGroup || "O+",
      pColdIschemiaHours: coldHours,
      pProcurementCenter: data.pProcurementCenter || "Central Regional Organ Bank",
      pViableUntil: new Date(Date.now() + coldHours * 3600 * 1000).toISOString(),
      pRatingsReviews: [],
      createdAt: new Date().toISOString(),
    };
    this.products.push(newProd);
    return { success: "Organ listing created successfully", product: newProd };
  }

  editProduct(data) {
    const index = this.products.findIndex((p) => p._id === data.pId);
    if (index === -1) return { error: "Organ not found" };
    const p = this.products[index];
    if (data.pName) p.pName = data.pName;
    if (data.pDescription) p.pDescription = data.pDescription;
    if (data.pPrice !== undefined) p.pPrice = Number(data.pPrice);
    if (data.pQuantity !== undefined) p.pQuantity = Number(data.pQuantity);
    if (data.pStatus) p.pStatus = data.pStatus;
    if (data.pBloodGroup) p.pBloodGroup = data.pBloodGroup;
    if (data.pColdIschemiaHours) {
      p.pColdIschemiaHours = Number(data.pColdIschemiaHours);
      p.pViableUntil = new Date(Date.now() + p.pColdIschemiaHours * 3600 * 1000).toISOString();
    }
    if (data.pProcurementCenter) p.pProcurementCenter = data.pProcurementCenter;
    if (data.pCategory) {
      const cat = this.categories.find((c) => c._id === data.pCategory);
      if (cat) p.pCategory = cat;
    }
    return { success: "Organ listing updated successfully", product: p };
  }

  deleteProduct(pId) {
    const index = this.products.findIndex((p) => p._id === pId);
    if (index === -1) return { error: "Organ not found" };
    this.products.splice(index, 1);
    return { success: "Organ listing deleted successfully" };
  }

  addReview(pId, uId, rating, review) {
    const product = this.products.find((p) => p._id === pId);
    if (!product) return { error: "Organ not found" };
    const user = this.users.find((u) => u._id === uId) || { _id: uId, name: "Verified Hospital", email: "surgeon@hospital.org" };
    const existingIndex = product.pRatingsReviews.findIndex(
      (r) => r.user && (r.user._id === uId || r.user === uId)
    );
    if (existingIndex > -1) {
      product.pRatingsReviews[existingIndex].rating = String(rating);
      product.pRatingsReviews[existingIndex].review = review;
      product.pRatingsReviews[existingIndex].createdAt = new Date().toISOString();
    } else {
      product.pRatingsReviews.push({
        _id: "rev_" + Date.now(),
        rating: String(rating),
        review,
        user: { _id: user._id, name: user.name, email: user.email },
        createdAt: new Date().toISOString(),
      });
    }
    return { success: "Review added successfully" };
  }

  deleteReview(pId, rId) {
    const product = this.products.find((p) => p._id === pId);
    if (!product) return { error: "Organ not found" };
    product.pRatingsReviews = product.pRatingsReviews.filter((r) => r._id !== rId);
    return { success: "Review deleted successfully" };
  }

  // Orders
  getAllOrders() {
    return [...this.orders].reverse();
  }

  getOrdersByUser(uId) {
    return this.orders.filter(
      (o) => o.user && (o.user._id === uId || o.user === uId)
    ).reverse();
  }

  createOrder(data) {
    const user = this.users.find((u) => u._id === data.user) || {
      _id: data.user,
      name: "Hospital Unit",
      email: "hospital@aims.org",
      hospitalName: "Transplant Hospital",
    };

    const hydratedProducts = data.allProduct.map((item) => {
      const prod = this.products.find((p) => p._id === item.id) || {
        _id: item.id,
        pName: "Organ Allograft",
        pPrice: data.amount,
        pImages: [],
      };
      return { id: prod, quantitiy: item.quantitiy || 1 };
    });

    const newOrder = {
      _id: "ord_" + Date.now(),
      allProduct: hydratedProducts,
      user,
      amount: Number(data.amount),
      transactionId: data.transactionId || "TXN-ORG-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
      address: data.address,
      phone: data.phone,
      urgencyLevel: data.urgencyLevel || "Urgent",
      recipientBloodGroup: data.recipientBloodGroup || "O+",
      status: "Not processed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orders.push(newOrder);
    return { success: "Organ transfer request submitted successfully", order: newOrder };
  }

  updateOrderStatus(oId, status) {
    const index = this.orders.findIndex((o) => o._id === oId);
    if (index === -1) return { error: "Order not found" };
    this.orders[index].status = status;
    this.orders[index].updatedAt = new Date().toISOString();
    return { success: "Order status updated successfully", order: this.orders[index] };
  }

  deleteOrder(oId) {
    const index = this.orders.findIndex((o) => o._id === oId);
    if (index === -1) return { error: "Order not found" };
    this.orders.splice(index, 1);
    return { success: "Order record deleted successfully" };
  }

  // Users & Auth
  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(uId) {
    return this.users.find((u) => u._id === uId);
  }

  addUser(data) {
    const existing = this.findUserByEmail(data.email);
    if (existing) return { error: "Email already registered" };
    const newUser = {
      _id: "usr_" + Date.now(),
      name: data.name,
      email: data.email.toLowerCase(),
      password: bcrypt.hashSync(data.password, 10),
      userRole: data.userRole !== undefined ? Number(data.userRole) : 0,
      phoneNumber: data.phoneNumber || "",
      hospitalName: data.hospitalName || data.name,
      address: data.address || "",
      userImage: "user.png",
      verified: true,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return { success: "Account created successfully", user: newUser };
  }

  updateUser(uId, data) {
    const user = this.findUserById(uId);
    if (!user) return { error: "User not found" };
    if (data.name) user.name = data.name;
    if (data.phoneNumber !== undefined) user.phoneNumber = data.phoneNumber;
    if (data.hospitalName !== undefined) user.hospitalName = data.hospitalName;
    if (data.address !== undefined) user.address = data.address;
    user.updatedAt = new Date().toISOString();
    return { success: "Profile updated successfully", user };
  }

  // Dashboard Stats
  getDashboardData() {
    return {
      Categories: this.categories.length,
      Products: this.products.length,
      Orders: this.orders.length,
      Users: this.users.length,
      recentOrders: [...this.orders].reverse().slice(0, 5),
    };
  }

  getSlides() {
    return this.slides;
  }
}

const mockStore = new MockStore();
module.exports = mockStore;
