import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ViabilityTimer from "../components/common/ViabilityTimer";
import { Heart, Trash2, HeartHandshake, ArrowRight, AlertCircle, MapPin } from "lucide-react";

export const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-current" />
            <span>Emergency Allocation Watchlist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Saved Allografts for Scheduled Transplants
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor cold ischemia viability for critical donor allografts earmarked for upcoming surgical procedures.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl glass border border-white/10 text-xs font-mono font-bold text-slate-300">
          <span className="text-emerald-400">{wishlist.length}</span> Allografts on Watch
        </div>
      </div>

      {/* Grid of Wishlist Items */}
      {wishlist.length === 0 ? (
        <div className="p-16 rounded-3xl glass border border-white/10 text-center max-w-lg mx-auto space-y-4">
          <Heart className="w-16 h-16 stroke-1 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your Watchlist is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You have not saved any donor allografts yet. Add organs to your watchlist while evaluating HLA compatibility with your transplant recipients.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-btn-emerald text-xs font-bold uppercase tracking-wider"
          >
            <span>Explore Organ Registry</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => {
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
                <div className="relative h-44 bg-slate-950">
                  <img src={img} alt={product.pName} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                      {product.pBloodGroup || "O+"}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-rose-400 hover:text-rose-300 backdrop-blur-md"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white truncate" title={product.pName}>
                      {product.pName}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{product.pProcurementCenter || "Central Regional Organ Bank"}</span>
                    </p>
                  </div>

                  <ViabilityTimer
                    viableUntil={product.pViableUntil}
                    coldIschemiaHours={product.pColdIschemiaHours}
                  />

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Token Fee</span>
                      <div className="text-sm font-mono font-bold text-emerald-400">
                        ₹{product.pPrice?.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="px-4 py-2 rounded-xl glass-btn-emerald text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>Request Now</span>
                    </button>
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
export default WishlistPage;
