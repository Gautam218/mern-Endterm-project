import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { orderService, paymentService } from "../services/api";
import ViabilityTimer from "../components/common/ViabilityTimer";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Building2,
  Phone,
  MapPin,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Clock,
  Sparkles,
} from "lucide-react";

export const CheckoutPage = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hospitalName: user?.hospitalName || user?.name || "",
    address: user?.address || "Transplant OT Ward 4B, Apex Trauma Center, New Delhi",
    phone: user?.phoneNumber || "+91-9876543210",
    leadSurgeon: user?.name || "Dr. Vikram Sethi",
    urgencyLevel: "Emergency Stat",
    recipientBloodGroup: cart[0]?.product?.pBloodGroup || "O+",
    cardNumber: "•••• •••• •••• 4242",
    cardExp: "12/28",
    cardCvv: "888",
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProcessOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      addToast("Your requisition queue is empty", "warning");
      return;
    }

    setLoading(true);
    try {
      // 1. Process Token Payment / Nonce
      const paymentRes = await paymentService.processPayment({
        amountTotal: totalAmount,
        paymentMethod: "fake-valid-nonce",
      });

      const txnId =
        paymentRes?.transaction?.id ||
        "TXN-ORG-" + Math.random().toString(36).substring(2, 8).toUpperCase();

      // 2. Format products array for backend order schema
      const allProduct = cart.map((item) => ({
        id: item.product._id,
        quantitiy: item.quantity,
      }));

      // 3. Create Order
      const orderPayload = {
        allProduct,
        user: user?._id || "usr_hospital_01",
        amount: totalAmount,
        transactionId: txnId,
        address: `${formData.hospitalName} - ${formData.address} (In-charge: ${formData.leadSurgeon})`,
        phone: formData.phone,
        urgencyLevel: formData.urgencyLevel,
        recipientBloodGroup: formData.recipientBloodGroup,
      };

      const orderRes = await orderService.createOrder(orderPayload);

      if (orderRes.success) {
        // Trigger celebratory confetti burst!
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#10b981", "#06b6d4", "#ffffff"],
        });

        setOrderSuccess({
          txnId,
          order: orderRes.order,
          itemsCount: cart.length,
          totalAmount,
        });

        clearCart();
        addToast("Emergency organ transfer requisition submitted successfully!", "success");
      } else {
        addToast(orderRes.error || orderRes.message || "Failed to submit request", "error");
      }
    } catch (err) {
      console.error("Order submission error:", err);
      addToast("Server communication error while initiating protocol", "error");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl glass border border-emerald-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glass-glow animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Transfer Protocol Initiated
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Organ Allocation Requisition Submitted
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Your requisition has been transmitted to the Regional Organ Procurement Bank. Cold chain logistics and scrutiny dispatch are underway.
            </p>
          </div>

          {/* Receipt details */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Protocol Tracking ID:</span>
              <span className="text-emerald-400 font-bold">{orderSuccess.txnId}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Receiving Surgical Unit:</span>
              <span className="text-white truncate max-w-[200px]">{formData.hospitalName}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Initial Allocation Status:</span>
              <span className="text-amber-400 font-bold">Under Scrutiny</span>
            </div>
            <div className="flex justify-between pt-1 font-bold text-sm">
              <span className="text-slate-300 font-sans">Token Processing Fee:</span>
              <span className="text-emerald-400">₹{orderSuccess.totalAmount?.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate("/user/orders")}
              className="flex-1 py-3.5 rounded-xl glass-btn-emerald text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Track Transfer in Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/"
              className="px-6 py-3.5 rounded-xl glass-btn-outline text-xs font-semibold text-center"
            >
              Browse Registry
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <HeartHandshake className="w-16 h-16 stroke-1 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Requisition Queue Empty</h2>
        <p className="text-xs text-slate-400">
          Please add a compatible donor allograft from the registry before proceeding to transfer protocol authorization.
        </p>
        <Link to="/" className="inline-block px-6 py-3 rounded-xl glass-btn-emerald text-xs font-bold">
          Explore Available Organs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Stage 2: Clinical Authorization & Confirmation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Execute Organ Transfer Protocol
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Provide transplant operating theater destination and authorize the confirmation token.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Delivery & Hospital Details */}
        <form onSubmit={handleProcessOrder} className="lg:col-span-7 space-y-6">
          {/* Hospital Recipient Details Card */}
          <div className="p-6 sm:p-8 rounded-3xl glass border border-white/10 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Transplant Center & Surgical Destination</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Recipient Hospital / Institution
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. AIIMS Apex Trauma Center"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Lead Transplant Surgeon
                </label>
                <input
                  type="text"
                  name="leadSurgeon"
                  value={formData.leadSurgeon}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Dr. Vikram Sethi"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  STAT Emergency Contact Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Clinical Urgency Level
                </label>
                <select
                  name="urgencyLevel"
                  value={formData.urgencyLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium cursor-pointer"
                >
                  <option value="Emergency Stat" className="bg-slate-900 text-rose-400">Emergency STAT (Immediate Dispatch)</option>
                  <option value="Urgent" className="bg-slate-900 text-amber-400">Urgent Priority (Within 4 Hours)</option>
                  <option value="Standard" className="bg-slate-900 text-white">Standard Allocation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                OT Ward Delivery Address / Green Corridor Drop-off
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="Surgical OT Ward 4B, Apex Trauma Wing, Main Medical Complex"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs resize-none"
                />
              </div>
            </div>
          </div>

          {/* Token Confirmation / Payment Card */}
          <div className="p-6 sm:p-8 rounded-3xl glass border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>Protocol Token Confirmation</span>
              </h3>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>256-bit Secure Gateway</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              As per national transplant regulations, a token authorization guarantees transfer confirmation and initiates cold-chain dispatch from the procurement hypothermic bank.
            </p>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Institutional Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Valid Thru</label>
                    <input
                      type="text"
                      name="cardExp"
                      value={formData.cardExp}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">CVV Nonce</label>
                    <input
                      type="text"
                      name="cardCvv"
                      value={formData.cardCvv}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl glass-btn-emerald flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold shadow-xl"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize Transfer & Submit Requisition (₹{totalAmount.toLocaleString("en-IN")})</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Column: Requisition Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass border border-white/10 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center justify-between">
              <span>Allografts In Transfer Queue</span>
              <span className="text-xs text-emerald-400 font-mono font-semibold">
                {cart.length} {cart.length === 1 ? "Organ" : "Organs"}
              </span>
            </h3>

            <div className="divide-y divide-white/5 space-y-3">
              {cart.map(({ product, quantity }) => (
                <div key={product._id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{product.pName}</h4>
                      <p className="text-[10px] text-slate-400">
                        {product.pBloodGroup || "O+"} Compatible • {quantity} Unit(s)
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 whitespace-nowrap">
                      ₹{((product.pPrice || 0) * quantity).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <ViabilityTimer
                    viableUntil={product.pViableUntil}
                    coldIschemiaHours={product.pColdIschemiaHours}
                    compact={true}
                  />
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Allograft Allocation</span>
                <span className="font-mono text-white">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cold Chain Green Corridor</span>
                <span className="text-emerald-400 font-medium">State Subsidized (₹0)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Histology & Biopsy Verification</span>
                <span className="text-emerald-400 font-medium">Certified (₹0)</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-bold text-white">
                <span>Total Token Confirmation Fee</span>
                <span className="text-lg font-mono text-emerald-400">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
