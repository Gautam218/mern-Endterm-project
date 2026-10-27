import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productService, categoryService, customizeService } from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ViabilityTimer from "../components/common/ViabilityTimer";
import {
  Search,
  SlidersHorizontal,
  Activity,
  Heart,
  HeartHandshake,
  ShieldCheck,
  Clock,
  MapPin,
  Check,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Filter,
  AlertCircle,
  Truck,
  RotateCcw,
} from "lucide-react";

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("all");
  const [sortBy, setSortBy] = useState("viable"); // "viable" | "price-asc" | "price-desc" | "newest"
  const [maxHours, setMaxHours] = useState(72);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Slide auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, slideRes] = await Promise.all([
        productService.getAllProducts().catch(() => ({ Products: [] })),
        categoryService.getAllCategories().catch(() => ({ Categories: [] })),
        customizeService.getSlideImages().catch(() => ({ Images: [] })),
      ]);

      setProducts(prodRes?.Products || []);
      setCategories(catRes?.Categories || []);
      setSlides(slideRes?.Images || []);
    } catch (err) {
      console.error("Error loading home data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.pName?.toLowerCase().includes(q);
          const matchDesc = p.pDescription?.toLowerCase().includes(q);
          const matchCenter = p.pProcurementCenter?.toLowerCase().includes(q);
          const matchBlood = p.pBloodGroup?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCenter && !matchBlood) return false;
        }

        // Category filter
        if (selectedCategory !== "all") {
          const pCatId = typeof p.pCategory === "object" ? p.pCategory?._id : p.pCategory;
          if (pCatId !== selectedCategory) return false;
        }

        // Blood Group filter
        if (selectedBloodGroup !== "all") {
          if (p.pBloodGroup !== selectedBloodGroup) return false;
        }

        // Cold ischemia max hours filter
        if (p.pColdIschemiaHours && p.pColdIschemiaHours > maxHours) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return (a.pPrice || 0) - (b.pPrice || 0);
        if (sortBy === "price-desc") return (b.pPrice || 0) - (a.pPrice || 0);
        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        // default "viable": most urgent cold ischemia first
        return (a.pColdIschemiaHours || 99) - (b.pColdIschemiaHours || 99);
      });
  }, [products, searchQuery, selectedCategory, selectedBloodGroup, sortBy, maxHours]);

  const bloodGroups = ["all", "O-", "O+", "A+", "A-", "B+", "B-", "AB+", "AB-"];

  return (
    <div className="space-y-16 pb-20">
      {/* ==================== HERO SECTION (Glassmorphism & Slider) ==================== */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative glass border border-white/10 shadow-2xl p-6 sm:p-12 lg:p-16">
          {/* Ambient bioluminescent glows */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Organ Procurement & Cold Ischemia Network</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Every Second Preserves a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Human Life</span>.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                OrganEase eliminates manual phone calls and fax delays. Synchronize regional hypothermic cold storages, match HLA/blood-type compatibility in clicks, and initiate emergency allograft transfer protocols with zero margin for error.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#organs-catalog"
                  className="px-6 py-3.5 rounded-xl glass-btn-emerald flex items-center gap-2 text-xs uppercase tracking-wider font-bold shadow-glass-glow"
                >
                  <Activity className="w-4 h-4" />
                  <span>Explore Available Allografts</span>
                </a>
                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 rounded-xl glass-btn-outline flex items-center gap-2 text-xs font-semibold"
                >
                  <span>Protocol Standard</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              {/* Quick KPI stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                    {products.length} Allografts
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">In Hypothermic Storage</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
                    100% Verified
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Histology & HLA Typed</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
                    &lt; 34 Mins
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Avg Allocation Time</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="p-6 rounded-3xl bg-slate-950/60 border border-white/15 backdrop-blur-xl shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Live Allocation Radar
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 animate-pulse">
                    ACTIVE STAT
                  </span>
                </div>

                {/* Highlighted urgent organ */}
                {products[0] && (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden h-44 bg-slate-900 border border-white/10">
                      <img
                        src={
                          products[0].pImages && products[0].pImages[0]
                            ? products[0].pImages[0].startsWith("http")
                              ? products[0].pImages[0]
                              : `/uploads/products/${products[0].pImages[0]}`
                            : "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
                        }
                        alt="Urgent Organ"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                          {products[0].pBloodGroup || "O+"} Compatible
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{products[0].pName}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{products[0].pProcurementCenter || "Central Regional Organ Bank"}</span>
                      </p>
                    </div>

                    <ViabilityTimer
                      viableUntil={products[0].pViableUntil}
                      coldIschemiaHours={products[0].pColdIschemiaHours}
                    />

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-mono font-bold text-emerald-400">
                        ₹{products[0].pPrice?.toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => addToCart(products[0])}
                        className="px-4 py-2 rounded-xl glass-btn-emerald text-xs font-bold uppercase tracking-wider"
                      >
                        Reserve Allograft
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES PILL / GRID ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Organ Classification & Retrieval Banks
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select category to isolate hypothermic storage specifications
            </p>
          </div>
          <button
            onClick={() => setSelectedCategory("all")}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`p-4 rounded-2xl border text-center transition-all ${
              selectedCategory === "all"
                ? "bg-emerald-500/20 border-emerald-400 text-white shadow-glass-glow"
                : "glass-card text-slate-300 hover:text-white"
            }`}
          >
            <div className="text-2xl mb-2">🏥</div>
            <div className="text-xs font-bold truncate">All Organs</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{products.length} Available</div>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat._id;
            const organCount = products.filter(
              (p) => (typeof p.pCategory === "object" ? p.pCategory?._id : p.pCategory) === cat._id
            ).length;

            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`p-4 rounded-2xl border text-center transition-all group ${
                  isSelected
                    ? "bg-emerald-500/20 border-emerald-400 text-white shadow-glass-glow"
                    : "glass-card text-slate-300 hover:text-white"
                }`}
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {cat.cName.toLowerCase().includes("kidney")
                    ? "🫘"
                    : cat.cName.toLowerCase().includes("heart")
                    ? "🫀"
                    : cat.cName.toLowerCase().includes("liver")
                    ? "🩺"
                    : cat.cName.toLowerCase().includes("lung")
                    ? "🫁"
                    : cat.cName.toLowerCase().includes("cornea")
                    ? "👁️"
                    : "🔬"}
                </div>
                <div className="text-xs font-bold truncate">{cat.cName}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{organCount} Allografts</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ==================== SEARCH & FILTERS CONTROLS ==================== */}
      <section id="organs-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl glass border border-white/10 space-y-5">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search allograft by organ name, storage bank, or compatibility..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-2xl glass-input text-xs font-medium cursor-pointer"
              >
                <option value="viable" className="bg-slate-900 text-white">Cold Ischemia (Urgent First)</option>
                <option value="price-asc" className="bg-slate-900 text-white">Token Fee: Low to High</option>
                <option value="price-desc" className="bg-slate-900 text-white">Token Fee: High to Low</option>
                <option value="newest" className="bg-slate-900 text-white">Recently Harvested</option>
              </select>
            </div>
          </div>

          {/* Blood Group Compatibility Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-2">
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              Blood Group:
            </span>
            {bloodGroups.map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedBloodGroup(bg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedBloodGroup === bg
                    ? "bg-rose-500/20 text-rose-300 border border-rose-400/50 shadow-sm"
                    : "glass-pill text-slate-400 hover:text-white"
                }`}
              >
                {bg === "all" ? "All Compatibility" : bg}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ORGAN CATALOG GRID ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Active Hypothermic Storage Allografts</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {filteredProducts.length} Matches
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-3xl glass animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 rounded-3xl glass text-center max-w-md mx-auto space-y-3">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
            <h4 className="text-base font-bold text-white">No Matching Allografts</h4>
            <p className="text-xs text-slate-400">
              Try adjusting your blood group filter, search query, or category selection.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedBloodGroup("all");
              }}
              className="mt-2 px-4 py-2 rounded-xl glass-btn-emerald text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isWish = isInWishlist(product._id);
              const img =
                product.pImages && product.pImages[0]
                  ? product.pImages[0].startsWith("http")
                    ? product.pImages[0]
                    : `/uploads/products/${product.pImages[0]}`
                  : (product.image || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80");

              return (
                <div
                  key={product._id}
                  className="rounded-3xl glass-card overflow-hidden flex flex-col justify-between border border-white/10 group"
                >
                  {/* Card Header & Thumbnail */}
                  <div className="relative h-48 bg-slate-950 overflow-hidden">
                    <img
                      src={img}
                      alt={product.pName || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30" />

                    {/* Blood Group Tag */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/90 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                        {product.pBloodGroup || "O+"}
                      </span>
                      <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-slate-300 border border-white/10">
                        {typeof product.pCategory === "object" ? product.pCategory?.cName : "Allograft"}
                      </span>
                    </div>

                    {/* Wishlist Heart Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                        isWish
                          ? "bg-rose-500 text-white shadow-glass-urgent"
                          : "bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-900"
                      }`}
                      title={isWish ? "Remove from Watchlist" : "Add to Emergency Watchlist"}
                    >
                      <Heart className={`w-4 h-4 ${isWish ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <Link to={`/products/${product._id}`}>
                        <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {product.pName || product.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {product.pDescription || product.description}
                      </p>

                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{product.pProcurementCenter || "Central Regional Organ Bank"}</span>
                      </div>
                    </div>

                    {/* Real-time Cold Ischemia Timer */}
                    <ViabilityTimer
                      viableUntil={product.pViableUntil}
                      coldIschemiaHours={product.pColdIschemiaHours}
                    />

                    {/* Price & Action Buttons */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Token Protocol Fee</div>
                        <div className="text-base font-mono font-bold text-emerald-400">
                          ₹{(product.pPrice ?? product.price)?.toLocaleString("en-IN")}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="px-3 py-2 rounded-xl glass-btn-outline text-xs font-semibold"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => addToCart(product)}
                          className="px-3.5 py-2 rounded-xl glass-btn-emerald text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                        >
                          <HeartHandshake className="w-3.5 h-3.5" />
                          <span>Request</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================== PROTOCOL WORKFLOW SECTION ==================== */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl glass border border-white/10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Clinical Transfer Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              From Hypothermic Retrieval to Operating Theater
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Zero manual paperwork. Instant algorithmic matching. Live preservation monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono">
                01
              </div>
              <h4 className="text-sm font-bold text-white">Hypothermic Harvest & Entry</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Procurement banks log deceased or living donor allografts with HLA typing, cold ischemia timer initiation, and storage preservation fluids.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono">
                02
              </div>
              <h4 className="text-sm font-bold text-white">Hospital Requisition & Token Confirmation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transplant units claim suitable organs based on patient urgency, blood group compatibility, and execute instant protocol token verification.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-mono">
                03
              </div>
              <h4 className="text-sm font-bold text-white">Green Corridor STAT Dispatch</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Procurement admins approve the request. Continuous cold chain logistics coordinates delivery straight to the surgical theater.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
