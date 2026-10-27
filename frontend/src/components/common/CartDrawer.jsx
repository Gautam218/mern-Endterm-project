import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import ViabilityTimer from "./ViabilityTimer";
import { X, Trash2, ArrowRight, ShieldAlert, HeartHandshake, Plus, Minus } from "lucide-react";

export const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalAmount, totalItems } = useCart();
  const { isAuthenticated, openLoginModal } = useAuth();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900/90 border-l border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Organ Requisition Queue</h3>
                <p className="text-xs text-slate-400">
                  {totalItems} {totalItems === 1 ? "Allograft" : "Allografts"} earmarked for transfer
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Viability Warning Banner */}
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-2.5 flex items-center gap-2 text-xs text-amber-300">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Active cold ischemia countdown is in progress. Complete checkout promptly.</span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <HeartHandshake className="w-16 h-16 stroke-1 text-slate-600 mb-3" />
                <h4 className="text-sm font-semibold text-slate-200">No Organs Earmarked</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Browse available verified organs in hypothermic storage and add them to your transplant request queue.
                </p>
              </div>
            ) : (
              cart.map(({ product, quantity }) => {
                const img =
                  product.pImages && product.pImages[0]
                    ? product.pImages[0].startsWith("http")
                      ? product.pImages[0]
                      : `/uploads/products/${product.pImages[0]}`
                    : "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80";

                return (
                  <div
                    key={product._id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-3 relative group"
                  >
                    <div className="flex gap-3">
                      <img
                        src={img}
                        alt={product.pName}
                        className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0 bg-slate-950"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {product.pBloodGroup || "O+"} Blood Compatible
                          </span>
                          <button
                            onClick={() => removeFromCart(product._id)}
                            className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1 truncate" title={product.pName}>
                          {product.pName}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          ₹{product.pPrice?.toLocaleString("en-IN") || "0"} Token Fee
                        </p>
                      </div>
                    </div>

                    {/* Viability Timer for this organ */}
                    <ViabilityTimer
                      viableUntil={product.pViableUntil}
                      coldIschemiaHours={product.pColdIschemiaHours}
                      compact={true}
                    />

                    {/* Quantity Selector & Item Total */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                      <span className="text-slate-400">Allograft Units:</span>
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(product._id, quantity - 1)}
                          className="p-1 hover:text-white text-slate-400"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-white px-1.5">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product._id, quantity + 1)}
                          className="p-1 hover:text-white text-slate-400"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-slate-950/60 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Protocol Security Surcharge</span>
                <span className="text-emerald-400 font-medium">Included (Zero Charge)</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-white">
                <span>Total Token Processing Fee</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 rounded-xl glass-btn-emerald flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold shadow-xl"
              >
                <span>Initiate Hospital Transfer Protocol</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CartDrawer;
