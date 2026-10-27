import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productService } from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ViabilityTimer from "../components/common/ViabilityTimer";
import {
  Activity,
  Heart,
  HeartHandshake,
  ShieldCheck,
  Clock,
  MapPin,
  Star,
  Trash2,
  Send,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Thermometer,
  FileText,
  AlertTriangle,
} from "lucide-react";

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Review Form state
  const [rating, setRating] = useState("5");
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await productService.getSingleProduct(id);
      if (res && res.Product) {
        setProduct(res.Product);
      }
    } catch (err) {
      console.error("Error fetching organ details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (!reviewText.trim()) {
      addToast("Please provide review observations", "warning");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await productService.addReview({
        pId: product._id,
        uId: user._id,
        rating,
        review: reviewText,
      });

      if (res.success) {
        addToast("Clinical review submitted successfully", "success");
        setReviewText("");
        fetchProduct();
      } else {
        addToast(res.error || "Failed to submit review", "error");
      }
    } catch (err) {
      addToast("Server error submitting review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await productService.deleteReview(reviewId, product._id);
      if (res.success) {
        addToast("Review deleted successfully", "info");
        fetchProduct();
      }
    } catch (err) {
      addToast("Failed to delete review", "error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-400 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Allograft Record Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested organ may have been allocated or expired from hypothermic storage.
        </p>
        <Link to="/" className="inline-block px-5 py-2.5 rounded-xl glass-btn-emerald text-xs font-bold">
          Return to Registry
        </Link>
      </div>
    );
  }

  const isWish = isInWishlist(product._id);
  const images =
    product.pImages && product.pImages.length > 0
      ? product.pImages.map((img) =>
          img.startsWith("http") ? img : `/uploads/products/${img}`
        )
      : (product.image ? [product.image] : ["https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Allograft Catalog</span>
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden glass border border-white/10 aspect-video sm:aspect-square max-h-[460px] bg-slate-950">
            <img
              src={images[activeImage]}
              alt={product.pName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80";
              }}
            />
            {/* Status badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                {product.pBloodGroup || "O+"} Compatible
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-slate-200 border border-white/10">
                {typeof product.pCategory === "object" ? product.pCategory?.cName : "Allograft"}
              </span>
            </div>

            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
                isWish
                  ? "bg-rose-500 text-white shadow-glass-urgent"
                  : "bg-slate-900/70 text-slate-300 hover:text-white"
              }`}
            >
              <Heart className={`w-5 h-5 ${isWish ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border transition-all ${
                    activeImage === idx
                      ? "border-emerald-400 ring-2 ring-emerald-400/30 scale-95"
                      : "border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Clinical Specifications Matrix */}
          <div className="p-6 rounded-3xl glass border border-white/10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Preservation & Compatibility Profile
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-400 text-[11px]">Storage Temperature</span>
                <p className="font-bold text-white flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2°C to 4°C Hypothermic</span>
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-400 text-[11px]">Cold Ischemia Limit</span>
                <p className="font-bold text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{product.pColdIschemiaHours || 12} Hours Max</span>
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-400 text-[11px]">Vascular Quality</span>
                <p className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cuffs Clean & Intact</span>
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-400 text-[11px]">Procurement Protocol</span>
                <p className="font-bold text-cyan-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>NOTTO Verified</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Requisition Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-8 rounded-3xl glass border border-white/10 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Allograft Listing #{product._id.slice(-6).toUpperCase()}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {product.pName || product.name}
              </h1>

              <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{product.pProcurementCenter || "Central Regional Organ Bank"}</span>
              </div>
            </div>

            {/* Cold Ischemia Viability Meter */}
            <ViabilityTimer
              viableUntil={product.pViableUntil}
              coldIschemiaHours={product.pColdIschemiaHours}
            />

            {/* Price & Token Surcharge */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Protocol Transfer Token Fee</span>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  ₹{(product.pPrice ?? product.price)?.toLocaleString("en-IN")}
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Standard Token Surcharge
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Clinical Overview & Donor Notes
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {product.pDescription || product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => addToCart(product)}
                className="w-full py-4 rounded-xl glass-btn-emerald flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold shadow-xl"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Initiate Hospital Allocation Requisition</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => toggleWishlist(product)}
                  className="py-2.5 rounded-xl glass-btn-outline flex items-center justify-center gap-2 text-xs font-medium"
                >
                  <Heart className={`w-4 h-4 ${isWish ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{isWish ? "Saved in Watchlist" : "Add to Watchlist"}</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    addToast("Allograft link copied to clipboard", "info");
                  }}
                  className="py-2.5 rounded-xl glass-btn-outline flex items-center justify-center gap-2 text-xs font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Allograft ID</span>
                </button>
              </div>
            </div>
          </div>

          {/* Clinical Reviews & Histology Ratings */}
          <div className="p-8 rounded-3xl glass border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Clinical Biopsy Reviews & Observations</h3>
                <p className="text-xs text-slate-400">Notes from retrieval teams and evaluating transplant surgeons</p>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm font-mono">
                <Star className="w-4 h-4 fill-current" />
                <span>
                  {product.pRatingsReviews?.length > 0
                    ? (
                        product.pRatingsReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) /
                        product.pRatingsReviews.length
                      ).toFixed(1)
                    : "5.0"}
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  ({product.pRatingsReviews?.length || 0})
                </span>
              </div>
            </div>

            {/* Submit Review Form */}
            <form onSubmit={handleAddReview} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Log Evaluation Score:</span>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="px-3 py-1 rounded-xl glass-input text-xs font-medium"
                >
                  <option value="5" className="bg-slate-900 text-white">5 ★★★★★ Optimal Histology</option>
                  <option value="4" className="bg-slate-900 text-white">4 ★★★★☆ High Viability</option>
                  <option value="3" className="bg-slate-900 text-white">3 ★★★☆☆ Moderate Steatosis</option>
                  <option value="2" className="bg-slate-900 text-white">2 ★★☆☆☆ Marginal Viability</option>
                  <option value="1" className="bg-slate-900 text-white">1 ★☆☆☆☆ Critical Concern</option>
                </select>
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Log histology biopsy results, resistive index, perfusate pH, or vascular observations..."
                rows={3}
                className="w-full p-3 rounded-xl glass-input text-xs resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 rounded-xl glass-btn-emerald text-xs font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Surgeon Log</span>
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {!product.pRatingsReviews || product.pRatingsReviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-4">
                  No evaluation logs recorded yet. Be the first surgeon to log histology notes.
                </p>
              ) : (
                product.pRatingsReviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center">
                          {rev.user?.name ? rev.user.name[0] : "S"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">
                            {rev.user?.name || "Verified Transplant Specialist"}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(rev.createdAt || Date.now()).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-0.5">
                          {rev.rating} <Star className="w-3 h-3 fill-current" />
                        </span>
                        {user && rev.user && (user._id === rev.user._id || user._id === rev.user) && (
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                            title="Delete Log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{rev.review}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetailsPage;
