import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  customizeService,
  productService,
  categoryService,
  orderService,
} from "../services/api";
import ViabilityTimer from "../components/common/ViabilityTimer";
import {
  ShieldCheck,
  Activity,
  Layers,
  HeartHandshake,
  Users,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Database,
  Calendar,
  Phone,
  MapPin,
  X,
  Upload,
} from "lucide-react";

export const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(tabParam);

  const [stats, setStats] = useState({
    Categories: 0,
    Products: 0,
    Orders: 0,
    Users: 0,
    recentOrders: [],
  });

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters for Orders Tab
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Filters for Organs Tab
  const [organSearch, setOrganSearch] = useState("");

  // Modals state
  const [organModalOpen, setOrganModalOpen] = useState(false);
  const [editingOrgan, setEditingOrgan] = useState(null);
  const [organFormData, setOrganFormData] = useState({
    pName: "",
    pDescription: "",
    pPrice: 50000,
    pQuantity: 1,
    pCategory: "",
    pBloodGroup: "O+",
    pColdIschemiaHours: 12,
    pProcurementCenter: "Central Regional Organ Bank",
    pImages: "",
    pStatus: "Active",
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    cName: "",
    cDescription: "",
    cStatus: "Active",
    cImage: "",
  });

  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [slideImageUrl, setSlideImageUrl] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    } else {
      fetchAllAdminData();
    }
  }, [isAdmin]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, prodsRes, catsRes, slidesRes] = await Promise.all([
        customizeService.getDashboardData().catch(() => ({})),
        orderService.getAllOrders().catch(() => ({ Orders: [] })),
        productService.getAllProducts().catch(() => ({ Products: [] })),
        categoryService.getAllCategories().catch(() => ({ Categories: [] })),
        customizeService.getSlideImages().catch(() => ({ Images: [] })),
      ]);

      if (statsRes) setStats(statsRes);
      setOrders(ordersRes?.Orders || []);
      setProducts(prodsRes?.Products || []);
      setCategories(catsRes?.Categories || []);
      setSlides(slidesRes?.Images || []);
    } catch (err) {
      console.error("Error loading admin hub data:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ==================== ORDER ACTIONS ==================== */
  const handleUpdateOrderStatus = async (oId, newStatus) => {
    try {
      const res = await orderService.updateOrder(oId, newStatus);
      if (res.success) {
        addToast(`Transfer order updated to "${newStatus}"`, "success");
        fetchAllAdminData();
      } else {
        addToast("Failed to update status", "error");
      }
    } catch (err) {
      addToast("Error updating order", "error");
    }
  };

  const handleDeleteOrder = async (oId) => {
    if (!window.confirm("Are you sure you want to delete this transfer request log?")) return;
    try {
      const res = await orderService.deleteOrder(oId);
      if (res.success) {
        addToast("Transfer record deleted", "info");
        fetchAllAdminData();
      }
    } catch (err) {
      addToast("Failed to delete order", "error");
    }
  };

  /* ==================== ORGAN (PRODUCT) ACTIONS ==================== */
  const openAddOrganModal = () => {
    setEditingOrgan(null);
    setOrganFormData({
      pName: "",
      pDescription: "",
      pPrice: 50000,
      pQuantity: 1,
      pCategory: categories[0]?._id || "",
      pBloodGroup: "O+",
      pColdIschemiaHours: 12,
      pProcurementCenter: "Central Regional Organ Bank",
      pImages: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
      pStatus: "Active",
    });
    setOrganModalOpen(true);
  };

  const openEditOrganModal = (organ) => {
    setEditingOrgan(organ);
    setOrganFormData({
      pName: organ.pName,
      pDescription: organ.pDescription,
      pPrice: organ.pPrice,
      pQuantity: organ.pQuantity || 1,
      pCategory: typeof organ.pCategory === "object" ? organ.pCategory?._id : organ.pCategory,
      pBloodGroup: organ.pBloodGroup || "O+",
      pColdIschemiaHours: organ.pColdIschemiaHours || 12,
      pProcurementCenter: organ.pProcurementCenter || "Central Regional Organ Bank",
      pImages: Array.isArray(organ.pImages) ? organ.pImages.join(", ") : organ.pImages || "",
      pStatus: organ.pStatus || "Active",
    });
    setOrganModalOpen(true);
  };

  const handleOrganSubmit = async (e) => {
    e.preventDefault();
    try {
      const imagesArray = organFormData.pImages
        ? organFormData.pImages.split(",").map((s) => s.trim())
        : [];

      if (editingOrgan) {
        const res = await productService.editProduct({
          pId: editingOrgan._id,
          ...organFormData,
          pImages: imagesArray,
        });
        if (res.success) {
          addToast("Organ listing updated successfully", "success");
          setOrganModalOpen(false);
          fetchAllAdminData();
        } else {
          addToast(res.error || "Failed to update organ", "error");
        }
      } else {
        const res = await productService.addProduct({
          ...organFormData,
          pImages: imagesArray,
        });
        if (res.success) {
          addToast("Organ allograft added to hypothermic registry", "success");
          setOrganModalOpen(false);
          fetchAllAdminData();
        } else {
          addToast(res.error || "Failed to add organ", "error");
        }
      }
    } catch (err) {
      addToast("Server error saving organ", "error");
    }
  };

  const handleDeleteOrgan = async (pId) => {
    if (!window.confirm("Are you sure you want to remove this allograft from the registry?")) return;
    try {
      const res = await productService.deleteProduct(pId);
      if (res.success) {
        addToast("Allograft removed from storage registry", "info");
        fetchAllAdminData();
      }
    } catch (err) {
      addToast("Failed to delete allograft", "error");
    }
  };

  /* ==================== CATEGORY ACTIONS ==================== */
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryFormData({
      cName: "",
      cDescription: "",
      cStatus: "Active",
      cImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
    });
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryFormData({
      cName: cat.cName,
      cDescription: cat.cDescription,
      cStatus: cat.cStatus || "Active",
      cImage: cat.cImage || "",
    });
    setCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const res = await categoryService.editCategory({
          cId: editingCategory._id,
          ...categoryFormData,
        });
        if (res.success) {
          addToast("Category updated successfully", "success");
          setCategoryModalOpen(false);
          fetchAllAdminData();
        }
      } else {
        const res = await categoryService.addCategory(categoryFormData);
        if (res.success) {
          addToast("Organ category created", "success");
          setCategoryModalOpen(false);
          fetchAllAdminData();
        }
      }
    } catch (err) {
      addToast("Error saving category", "error");
    }
  };

  const handleDeleteCategory = async (cId) => {
    if (!window.confirm("Delete this organ category?")) return;
    try {
      const res = await categoryService.deleteCategory(cId);
      if (res.success) {
        addToast("Category deleted", "info");
        fetchAllAdminData();
      }
    } catch (err) {
      addToast("Failed to delete category", "error");
    }
  };

  /* ==================== SLIDES ACTIONS ==================== */
  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!slideImageUrl.trim()) return;
    try {
      const res = await customizeService.uploadSlideImage({ image: slideImageUrl });
      if (res.success) {
        addToast("Banner slide uploaded", "success");
        setSlideModalOpen(false);
        setSlideImageUrl("");
        fetchAllAdminData();
      }
    } catch (err) {
      addToast("Failed to add slide", "error");
    }
  };

  const handleDeleteSlide = async (id) => {
    try {
      const res = await customizeService.deleteSlideImage(id);
      if (res.success) {
        addToast("Slide removed", "info");
        fetchAllAdminData();
      }
    } catch (err) {
      addToast("Failed to delete slide", "error");
    }
  };

  /* Filtered Orders */
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== "all" && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchTxn = o.transactionId?.toLowerCase().includes(q);
      const matchUser = o.user?.name?.toLowerCase().includes(q);
      const matchHospital = o.user?.hospitalName?.toLowerCase().includes(q);
      const matchAddr = o.address?.toLowerCase().includes(q);
      if (!matchTxn && !matchUser && !matchHospital && !matchAddr) return false;
    }
    return true;
  });

  /* Filtered Products */
  const filteredProducts = products.filter((p) => {
    if (!organSearch.trim()) return true;
    const q = organSearch.toLowerCase();
    return (
      p.pName?.toLowerCase().includes(q) ||
      p.pProcurementCenter?.toLowerCase().includes(q) ||
      p.pBloodGroup?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Request Accepted":
      case "In Transit":
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Under Scrutiny":
      case "Not processed":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Expired":
      case "Cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>National Organ Procurement Registry Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Procurement & Allocation Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Administered by NOTTO Registry Operations • Operator: {user?.name}
          </p>
        </div>

        <button
          onClick={fetchAllAdminData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-btn-outline text-xs font-semibold self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Synchronize Data</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Transfer Requisitions</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{orders.length}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Active Hospital Claims</span>
        </div>

        <div className="p-5 rounded-2xl glass border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Storage Allografts</span>
            <HeartHandshake className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{products.length}</div>
          <span className="text-[10px] text-cyan-400 font-semibold">Under Hypothermic Care</span>
        </div>

        <div className="p-5 rounded-2xl glass border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Organ Categories</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{categories.length}</div>
          <span className="text-[10px] text-amber-400 font-semibold">Classified Organs</span>
        </div>

        <div className="p-5 rounded-2xl glass border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Registered Units</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{stats.Users || 2}</div>
          <span className="text-[10px] text-indigo-400 font-semibold">Hospitals & Centers</span>
        </div>
      </div>

      {/* Tab Navigation Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl glass border border-white/10">
        <button
          onClick={() => handleTabChange("overview")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "overview"
              ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Transfer Requisitions ({orders.length})
        </button>
        <button
          onClick={() => handleTabChange("products")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "products"
              ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Organ Inventory ({products.length})
        </button>
        <button
          onClick={() => handleTabChange("categories")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "categories"
              ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Organ Categories ({categories.length})
        </button>
        <button
          onClick={() => handleTabChange("slides")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "slides"
              ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Portal Announcements
        </button>
      </div>

      {/* ==================== TAB 1: TRANSFER REQUISITIONS (ORDERS) ==================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Hospital Requisition Orders</h3>
              <p className="text-xs text-slate-400">Review transfer requests and confirm procurement dispatch</p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Filter by ID or hospital..."
                  className="pl-8 pr-3 py-2 rounded-xl glass-input text-xs w-48"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl glass-input text-xs font-medium cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">All Statuses</option>
                <option value="Under Scrutiny" className="bg-slate-900 text-amber-400">Under Scrutiny</option>
                <option value="Request Accepted" className="bg-slate-900 text-emerald-400">Request Accepted</option>
                <option value="In Transit" className="bg-slate-900 text-cyan-400">In Transit</option>
                <option value="Delivered" className="bg-slate-900 text-emerald-400">Delivered</option>
                <option value="Cancelled" className="bg-slate-900 text-rose-400">Cancelled</option>
              </select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 rounded-3xl glass text-center max-w-md mx-auto space-y-2">
              <Activity className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No Matching Transfer Requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl glass border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Tracking ID</th>
                    <th className="p-4">Receiving Hospital</th>
                    <th className="p-4">Allocated Organ</th>
                    <th className="p-4">Token Fee</th>
                    <th className="p-4">Status & Dispatch Action</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((order) => {
                    const firstProd = order.allProduct?.[0]?.id;
                    return (
                      <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                          {order.transactionId}
                          <div className="text-[10px] text-slate-500 font-normal">
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-slate-200">
                            {order.user?.hospitalName || order.user?.name || "Hospital Unit"}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{order.address}</div>
                          <div className="text-[10px] text-emerald-400">{order.phone}</div>
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-white">
                            {firstProd?.pName || "Organ Allograft"}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {firstProd?.pBloodGroup ? `${firstProd.pBloodGroup} Compatible` : "Allograft"}
                          </div>
                        </td>

                        <td className="p-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                          ₹{order.amount?.toLocaleString("en-IN")}
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(order.status)}`}>
                              {order.status}
                            </span>

                            {/* Dropdown to change status immediately */}
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className="px-2 py-1 rounded-lg glass-input text-[11px] font-medium cursor-pointer"
                            >
                              <option value="Not processed" className="bg-slate-900 text-white">Not processed</option>
                              <option value="Under Scrutiny" className="bg-slate-900 text-amber-400">Under Scrutiny</option>
                              <option value="Request Accepted" className="bg-slate-900 text-emerald-400">Accept Request</option>
                              <option value="In Transit" className="bg-slate-900 text-cyan-400">Dispatch: In Transit</option>
                              <option value="Delivered" className="bg-slate-900 text-emerald-400">Delivered</option>
                              <option value="Cancelled" className="bg-slate-900 text-rose-400">Reject / Cancel</option>
                            </select>
                          </div>
                        </td>

                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: ORGAN INVENTORY (PRODUCTS) ==================== */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Hypothermic Storage Allografts</h3>
              <p className="text-xs text-slate-400">Add, edit, and track stored donor organs across all regional banks</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={organSearch}
                  onChange={(e) => setOrganSearch(e.target.value)}
                  placeholder="Search organs..."
                  className="pl-8 pr-3 py-2 rounded-xl glass-input text-xs w-44"
                />
              </div>

              <button
                onClick={openAddOrganModal}
                className="px-4 py-2 rounded-xl glass-btn-emerald text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Organ</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod._id}
                className="p-5 rounded-3xl glass-card border border-white/10 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {prod.pBloodGroup || "O+"} Compatible
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditOrganModal(prod)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrgan(prod._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1">{prod.pName}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {prod.pDescription}
                  </p>
                  <p className="text-[11px] text-cyan-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{prod.pProcurementCenter || "Central Bank"}</span>
                  </p>
                </div>

                <ViabilityTimer
                  viableUntil={prod.pViableUntil}
                  coldIschemiaHours={prod.pColdIschemiaHours}
                />

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Token Fee</span>
                    <p className="font-mono font-bold text-emerald-400 text-sm">
                      ₹{prod.pPrice?.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/10 text-slate-300">
                    Quota: {prod.pQuantity || 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: CATEGORIES ==================== */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Organ Categories</h3>
              <p className="text-xs text-slate-400">Define anatomical classifications and cold ischemia guidelines</p>
            </div>
            <button
              onClick={openAddCategoryModal}
              className="px-4 py-2 rounded-xl glass-btn-emerald text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Organ Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat._id} className="p-5 rounded-3xl glass-card border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{cat.cName}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditCategoryModal(cat)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{cat.cDescription}</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {cat.cStatus || "Active"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: SLIDES & ANNOUNCEMENTS ==================== */}
      {activeTab === "slides" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Homepage Announcements & Hero Slides</h3>
              <p className="text-xs text-slate-400">Manage promotional slides and emergency alerts shown on the homepage</p>
            </div>
            <button
              onClick={() => setSlideModalOpen(true)}
              className="px-4 py-2 rounded-xl glass-btn-emerald text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Slide Image</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide) => (
              <div key={slide._id} className="rounded-3xl glass-card overflow-hidden border border-white/10">
                <div className="h-40 bg-slate-950 relative">
                  <img
                    src={slide.slideImage?.startsWith("http") ? slide.slideImage : `/uploads/customize/${slide.slideImage}`}
                    alt="Slide"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <button
                    onClick={() => handleDeleteSlide(slide._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-rose-400 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-300 font-mono truncate">{slide.slideImage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== MODALS ==================== */}

      {/* Add / Edit Organ Modal */}
      {organModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/15 backdrop-blur-2xl shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingOrgan ? "Edit Organ Allograft" : "Log New Allograft Listing"}
              </h3>
              <button onClick={() => setOrganModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOrganSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Organ Name & Identifier</label>
                <input
                  type="text"
                  value={organFormData.pName}
                  onChange={(e) => setOrganFormData({ ...organFormData, pName: e.target.value })}
                  required
                  placeholder="e.g. Human Left Kidney (Pediatric Compatible)"
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Organ Category</label>
                  <select
                    value={organFormData.pCategory}
                    onChange={(e) => setOrganFormData({ ...organFormData, pCategory: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id} className="bg-slate-900 text-white">
                        {c.cName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Blood Group</label>
                  <select
                    value={organFormData.pBloodGroup}
                    onChange={(e) => setOrganFormData({ ...organFormData, pBloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  >
                    {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
                      <option key={bg} value={bg} className="bg-slate-900 text-white">
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Cold Ischemia Hours</label>
                  <input
                    type="number"
                    value={organFormData.pColdIschemiaHours}
                    onChange={(e) =>
                      setOrganFormData({ ...organFormData, pColdIschemiaHours: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Token Transfer Fee (₹)</label>
                  <input
                    type="number"
                    value={organFormData.pPrice}
                    onChange={(e) => setOrganFormData({ ...organFormData, pPrice: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Procurement Bank Center</label>
                <input
                  type="text"
                  value={organFormData.pProcurementCenter}
                  onChange={(e) =>
                    setOrganFormData({ ...organFormData, pProcurementCenter: e.target.value })
                  }
                  required
                  placeholder="e.g. Apollo Multi-Specialty Retrieval Center"
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Image URLs (comma separated)</label>
                <input
                  type="text"
                  value={organFormData.pImages}
                  onChange={(e) => setOrganFormData({ ...organFormData, pImages: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Clinical Histology & Biopsy Notes</label>
                <textarea
                  value={organFormData.pDescription}
                  onChange={(e) => setOrganFormData({ ...organFormData, pDescription: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl glass-input resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOrganModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl glass-btn-emerald font-bold">
                  Save Allograft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900/90 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? "Edit Category" : "Add Organ Category"}
              </h3>
              <button onClick={() => setCategoryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  value={categoryFormData.cName}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, cName: e.target.value })}
                  required
                  placeholder="e.g. Kidneys, Heart, Liver"
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description & Guidelines</label>
                <textarea
                  value={categoryFormData.cDescription}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, cDescription: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl glass-input resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl glass-btn-emerald font-bold">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Slide Modal */}
      {slideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900/90 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Upload Banner Slide</h3>
              <button onClick={() => setSlideModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSlide} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={slideImageUrl}
                  onChange={(e) => setSlideImageUrl(e.target.value)}
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSlideModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl glass-btn-emerald font-bold">
                  Add Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboardPage;
