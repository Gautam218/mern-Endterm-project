import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productService, categoryService } from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ViabilityTimer from "../components/common/ViabilityTimer";
import { ArrowLeft, Heart, HeartHandshake, MapPin, AlertCircle } from "lucide-react";

export const CategoryProductsPage = () => {
  const { catId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchCategoryProducts();
  }, [catId]);

  const fetchCategoryProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getProductsByCategory(catId),
        categoryService.getAllCategories(),
      ]);

      setProducts(prodRes?.Products || []);
      const currentCat = catRes?.Categories?.find((c) => c._id === catId);
      setCategory(currentCat || null);
    } catch (err) {
      console.error("Error loading category organs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-300 hover:text-white mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Organ Categories</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {category?.cName || "Organ Category"} Hypothermic Allografts
        </h1>
        {category?.cDescription && (
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {category.cDescription}
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 rounded-3xl glass animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="p-16 rounded-3xl glass text-center max-w-md mx-auto space-y-3">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Stored Allografts Currently Available</h3>
          <p className="text-xs text-slate-400">
            There are currently no active donor organs listed under this category. Check back soon or explore other categories.
          </p>
          <Link to="/" className="inline-block px-4 py-2 rounded-xl glass-btn-emerald text-xs font-bold">
            Return to Registry
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const isWish = isInWishlist(product._id);
            const img =
              product.pImages && product.pImages[0]
                ? product.pImages[0].startsWith("http")
                  ? product.pImages[0]
                  : `/uploads/products/${product.pImages[0]}`
                : "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80";

            return (
              <div
                key={product._id}
                className="rounded-3xl glass-card border border-white/10 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-48 bg-slate-950">
                  <img src={img} alt={product.pName} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                      {product.pBloodGroup || "O+"}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md ${
                      isWish ? "bg-rose-500 text-white" : "bg-slate-900/80 text-slate-300"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWish ? "fill-current" : ""}`} />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <Link to={`/products/${product._id}`}>
                      <h4 className="text-sm font-bold text-white hover:text-emerald-400 transition-colors line-clamp-1">
                        {product.pName}
                      </h4>
                    </Link>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.pDescription}</p>
                    <p className="text-[11px] text-cyan-400 flex items-center gap-1 mt-2">
                      <MapPin className="w-3 h-3" />
                      <span>{product.pProcurementCenter || "Central Regional Bank"}</span>
                    </p>
                  </div>

                  <ViabilityTimer
                    viableUntil={product.pViableUntil}
                    coldIschemiaHours={product.pColdIschemiaHours}
                  />

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Token Fee</span>
                      <p className="text-sm font-mono font-bold text-emerald-400">
                        ₹{product.pPrice?.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/products/${product._id}`}
                        className="px-3 py-1.5 rounded-xl glass-btn-outline text-xs font-semibold"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-3.5 py-1.5 rounded-xl glass-btn-emerald text-xs font-bold uppercase tracking-wider flex items-center gap-1"
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
    </div>
  );
};
export default CategoryProductsPage;
