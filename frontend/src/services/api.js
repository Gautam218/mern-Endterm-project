import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "/api"
    : "https://mern-endterm-project.onrender.com/api");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.token = `Bearer ${token}`;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for friendly error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/* ==================== AUTH SERVICES ==================== */
export const authService = {
  signin: async (email, password) => {
    const res = await api.post("/signin", { email, password });
    return res.data;
  },
  signup: async (userData) => {
    const res = await api.post("/signup", userData);
    return res.data;
  },
  checkAdmin: async (loggedInUserId) => {
    const res = await api.post("/isadmin", { loggedInUserId });
    return res.data;
  },
  getAllUsers: async () => {
    const res = await api.post("/user");
    return res.data;
  },
};

/* ==================== USER SERVICES ==================== */
export const userService = {
  getAllUsers: async () => {
    const res = await api.get("/user/all-user");
    return res.data;
  },
  getSingleUser: async (uId) => {
    const res = await api.post("/user/signle-user", { uId });
    return res.data;
  },
  editUser: async (userData) => {
    const res = await api.post("/user/edit-user", userData);
    return res.data;
  },
  changePassword: async (passwordData) => {
    const res = await api.post("/user/change-password", passwordData);
    return res.data;
  },
};

/* ==================== CATEGORY SERVICES ==================== */
export const categoryService = {
  getAllCategories: async () => {
    const res = await api.get("/category/all-category");
    return res.data;
  },
  addCategory: async (formData) => {
    const isMultipart = formData instanceof FormData;
    const res = await api.post("/category/add-category", formData, {
      headers: isMultipart ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  },
  editCategory: async (data) => {
    const res = await api.post("/category/edit-category", data);
    return res.data;
  },
  deleteCategory: async (cId) => {
    const res = await api.post("/category/delete-category", { cId });
    return res.data;
  },
};

/* ==================== PRODUCT (ORGAN) SERVICES ==================== */
export const productService = {
  getAllProducts: async () => {
    const res = await api.get("/product/all-product");
    return res.data;
  },
  getSingleProduct: async (pId) => {
    const res = await api.post("/product/single-product", { pId });
    return res.data;
  },
  getProductsByCategory: async (catId) => {
    const res = await api.post("/product/product-by-category", { catId });
    return res.data;
  },
  getProductsByPrice: async (price) => {
    const res = await api.post("/product/product-by-price", { price });
    return res.data;
  },
  getWishProducts: async (productArray) => {
    const res = await api.post("/product/wish-product", { productArray });
    return res.data;
  },
  getCartProducts: async (productArray) => {
    const res = await api.post("/product/cart-product", { productArray });
    return res.data;
  },
  addProduct: async (data) => {
    const isMultipart = data instanceof FormData;
    const res = await api.post("/product/add-product", data, {
      headers: isMultipart ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  },
  editProduct: async (data) => {
    const isMultipart = data instanceof FormData;
    const res = await api.post("/product/edit-product", data, {
      headers: isMultipart ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  },
  deleteProduct: async (pId) => {
    const res = await api.post("/product/delete-product", { pId });
    return res.data;
  },
  addReview: async (reviewData) => {
    const res = await api.post("/product/add-review", reviewData);
    return res.data;
  },
  deleteReview: async (rId, pId) => {
    const res = await api.post("/product/delete-review", { rId, pId });
    return res.data;
  },
};

/* ==================== ORDER / REQUEST SERVICES ==================== */
export const orderService = {
  getAllOrders: async () => {
    const res = await api.get("/order/get-all-orders");
    return res.data;
  },
  getOrderByUser: async (uId) => {
    const res = await api.post("/order/order-by-user", { uId });
    return res.data;
  },
  createOrder: async (orderData) => {
    const res = await api.post("/order/create-order", orderData);
    return res.data;
  },
  updateOrder: async (oId, status) => {
    const res = await api.post("/order/update-order", { oId, status });
    return res.data;
  },
  deleteOrder: async (oId) => {
    const res = await api.post("/order/delete-order", { oId });
    return res.data;
  },
};

/* ==================== BRAINTREE / PAYMENT SERVICES ==================== */
export const paymentService = {
  getToken: async () => {
    const res = await api.get("/braintree/get-token");
    return res.data;
  },
  processPayment: async (paymentData) => {
    const res = await api.post("/braintree/payment-process", paymentData);
    return res.data;
  },
};

/* ==================== DASHBOARD / CUSTOMIZE SERVICES ==================== */
export const customizeService = {
  getDashboardData: async () => {
    const res = await api.post("/customize/dashboard-data");
    return res.data;
  },
  getSlideImages: async () => {
    const res = await api.get("/customize/get-slide-image");
    return res.data;
  },
  uploadSlideImage: async (formData) => {
    const isMultipart = formData instanceof FormData;
    const res = await api.post("/customize/upload-slide-image", formData, {
      headers: isMultipart ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  },
  deleteSlideImage: async (id) => {
    const res = await api.post("/customize/delete-slide-image", { id });
    return res.data;
  },
};

export default api;
