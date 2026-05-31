import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast from "react-hot-toast";
import axios from "axios";
import { createPortal } from "react-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import "../styles/cart.css";

const API_URL = "http://localhost:5000/api";

// ── Add Address Mini Form ─────────────────────────────────────
function AddAddressForm({ onSave, onCancel }) {
  const [form, setForm] = useState({ type: "home", line: "", city: "", pincode: "", isDefault: false });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.line.trim() || !form.city.trim()) {
      toast.error("Street and city are required");
      return;
    }
    onSave(form);
  };

  return (
    <div className="co-add-form">
      <p className="co-form-title">Add New Address</p>
      <div className="co-type-row">
        {["home","work","other"].map(t => (
          <button key={t} className={`co-type-btn ${form.type===t?"active":""}`} onClick={() => set("type",t)}>
            {t==="home"?"🏠 Home":t==="work"?"🏢 Work":"📍 Other"}
          </button>
        ))}
      </div>
      <input className="co-input" placeholder="Street / Flat / Area *" value={form.line} onChange={e=>set("line",e.target.value)} />
      <div className="co-input-row">
        <input className="co-input" placeholder="City *" value={form.city} onChange={e=>set("city",e.target.value)} />
        <input className="co-input" placeholder="Pincode" value={form.pincode} onChange={e=>set("pincode",e.target.value)} />
      </div>
      <label className="co-default-row">
        <input type="checkbox" checked={form.isDefault} onChange={e=>set("isDefault",e.target.checked)} />
        <span>Set as default address</span>
      </label>
      <div className="co-form-actions">
        <button className="co-btn-cancel" onClick={onCancel}>Cancel</button>
        <button className="co-btn-save" onClick={handleSave}>Save Address</button>
      </div>
    </div>
  );
}

// ── Step 1: Address ───────────────────────────────────────────
function StepAddress({ addresses, selected, setSelected, showForm, setShowForm, onSaveAddress, onNext }) {
  const typeIcon = t => t==="home"?"🏠":t==="work"?"🏢":"📍";

  return (
    <div className="co-step-body" id="co-step-1">
      {!showForm ? (
        <>
          <div className="co-addr-list">
            {addresses.map((a,i) => (
              <label key={i} className={`co-addr-card ${selected===i?"selected":""}`}>
                <input type="radio" name="addr" checked={selected===i} onChange={()=>setSelected(i)} className="co-radio" />
                <div className="co-addr-info">
                  <div className="co-addr-type-row">
                    <span className="co-addr-type">{typeIcon(a.type)} {a.type.charAt(0).toUpperCase()+a.type.slice(1)}</span>
                    {a.isDefault && <span className="co-default-badge">Default</span>}
                  </div>
                  <p className="co-addr-line">{a.line}</p>
                  <p className="co-addr-city">{a.city}{a.pincode?`, ${a.pincode}`:""}</p>
                </div>
              </label>
            ))}
          </div>
          <button className="co-add-new-btn" onClick={()=>setShowForm(true)}>+ Add New Address</button>
          <button className="co-next-btn" onClick={onNext} disabled={selected===null}>
            Continue to Payment
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </>
      ) : (
        <AddAddressForm onSave={onSaveAddress} onCancel={()=>addresses.length>0&&setShowForm(false)} />
      )}
    </div>
  );
}

// ── Step 2: Payment ───────────────────────────────────────────
function StepPayment({ payment, setPayment, upiId, setUpiId, cardNum, setCardNum, cardName, setCardName, cardExp, setCardExp, cardCvv, setCardCvv, onBack, onConfirm, total }) {

  const METHODS = [
    { val:"upi",    label:"UPI",                 icon:"📲", sub:"GPay, PhonePe, Paytm" },
    { val:"card",   label:"Credit / Debit Card",  icon:"💳", sub:"Visa, Mastercard, RuPay" },
    { val:"wallet", label:"Wallets",              icon:"👛", sub:"Paytm, Amazon Pay, Mobikwik" },
    { val:"netbank",label:"Net Banking",          icon:"🏦", sub:"All major banks" },
    { val:"cod",    label:"Cash on Delivery",     icon:"💵", sub:"Pay when delivered" },
  ];

  const WALLETS = ["Paytm","Amazon Pay","Mobikwik","Freecharge","Airtel Money"];
  const BANKS   = ["SBI","HDFC","ICICI","Axis","Kotak","PNB","Bank of Baroda","Yes Bank"];
  const [wallet, setWallet] = useState("Paytm");
  const [bank,   setBank]   = useState("SBI");

  return (
    <div className="co-step-body" id="co-step-2">

      {/* ── Two column layout ── */}
      <div className="co-pay-2col">

        {/* LEFT — Payment method list */}
        <div className="co-pay-left">
          <div className="co-pay-list">
            {METHODS.map(m => (
              <label key={m.val} className={`co-pay-row ${payment===m.val?"selected":""}`}>
                <input type="radio" name="pay" checked={payment===m.val} onChange={()=>setPayment(m.val)} className="co-radio" />
                <span className="co-pay-icon-lg">{m.icon}</span>
                <div className="co-pay-text">
                  <span className="co-pay-name">{m.label}</span>
                  <span className="co-pay-sub">{m.sub}</span>
                </div>
                {payment===m.val && <span className="co-pay-check">✓</span>}
              </label>
            ))}
          </div>
        </div>

        {/* Vertical divider */}
        <div className="co-pay-vdivider" />

        {/* RIGHT — Detail panel */}
        <div className="co-pay-right">

          {payment==="upi" && (
            <div className="co-pay-detail">
              <p className="co-detail-label">UPI ID</p>
              <div className="co-upi-wrap">
                <span className="co-upi-icon">📲</span>
                <input className="co-input" placeholder="yourname@upi" value={upiId} onChange={e=>setUpiId(e.target.value)} />
              </div>
              <div className="co-upi-apps">
                {[
                  {name:"GPay",    emoji:"🔵"},
                  {name:"PhonePe", emoji:"🟣"},
                  {name:"Paytm",   emoji:"🔷"},
                  {name:"BHIM",    emoji:"🟠"},
                ].map(a => (
                  <button key={a.name} className="co-upi-app-btn" onClick={()=>setUpiId(`yourname@${a.name.toLowerCase()}`)}>
                    <span>{a.emoji}</span> {a.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {payment==="card" && (
            <div className="co-pay-detail">
              <p className="co-detail-label">Card Details</p>
              <input className="co-input" placeholder="Card Number" maxLength={19}
                value={cardNum}
                onChange={e=>{
                  const v = e.target.value.replace(/\D/g,"").slice(0,16);
                  setCardNum(v.replace(/(.{4})/g,"$1 ").trim());
                }}
              />
              <input className="co-input" placeholder="Cardholder Name" value={cardName} onChange={e=>setCardName(e.target.value)} />
              <div className="co-input-row">
                <input className="co-input" placeholder="MM/YY" maxLength={5}
                  value={cardExp}
                  onChange={e=>{
                    let v=e.target.value.replace(/\D/g,"");
                    if(v.length>=3) v=v.slice(0,2)+"/"+v.slice(2,4);
                    setCardExp(v);
                  }}
                />
                <input className="co-input" placeholder="CVV" maxLength={3} type="password" value={cardCvv} onChange={e=>setCardCvv(e.target.value.replace(/\D/g,"").slice(0,3))} />
              </div>
              <div className="co-card-logos">
                <span>💳 Visa</span><span>💳 MC</span><span>💳 RuPay</span>
              </div>
            </div>
          )}

          {payment==="wallet" && (
            <div className="co-pay-detail">
              <p className="co-detail-label">Select Wallet</p>
              <div className="co-wallet-grid">
                {WALLETS.map(w => (
                  <button key={w} className={`co-wallet-btn ${wallet===w?"active":""}`} onClick={()=>setWallet(w)}>{w}</button>
                ))}
              </div>
            </div>
          )}

          {payment==="netbank" && (
            <div className="co-pay-detail">
              <p className="co-detail-label">Select Bank</p>
              <div className="co-bank-grid">
                {BANKS.map(b => (
                  <button key={b} className={`co-bank-btn ${bank===b?"active":""}`} onClick={()=>setBank(b)}>
                    🏦 {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {payment==="cod" && (
            <div className="co-cod-note">
              <span>💵</span>
              <p>Pay <strong>₹{total}</strong> in cash when your order is delivered.</p>
            </div>
          )}

        </div>
      </div>

      {/* ── Actions ── */}
      <div className="co-pay-actions">
        <button className="co-back-btn" onClick={onBack}>← Back</button>
        <button className="co-confirm-btn" onClick={onConfirm}>
          Place Order — ₹{total}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
}

// ── Checkout Modal (2-step) ───────────────────────────────────
function CheckoutModal({ onClose, onConfirm, total }) {
  const [step,      setStep]      = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [showForm,  setShowForm]  = useState(false);
  const [payment,   setPayment]   = useState("upi");
  const [upiId,     setUpiId]     = useState("");
  const [cardNum,   setCardNum]   = useState("");
  const [cardName,  setCardName]  = useState("");
  const [cardExp,   setCardExp]   = useState("");
  const [cardCvv,   setCardCvv]   = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("addresses") || "[]");
      setAddresses(saved);
      if (saved.length === 0) setShowForm(true);
      else {
        const def = saved.findIndex(a => a.isDefault);
        setSelected(def >= 0 ? def : 0);
      }
    } catch { setShowForm(true); }

    gsap.fromTo(".co-modal",
      { opacity:0, y:30, scale:0.97 },
      { opacity:1, y:0, scale:1, duration:0.35, ease:"power3.out" }
    );
  }, []);

  // Animate step transition
  const goToStep = (n) => {
    gsap.to(".co-step-body", {
      opacity:0, x: n>step ? -30 : 30, duration:0.2, ease:"power2.in",
      onComplete: () => {
        setStep(n);
        gsap.fromTo(".co-step-body",
          { opacity:0, x: n>step ? 30 : -30 },
          { opacity:1, x:0, duration:0.25, ease:"power2.out" }
        );
      }
    });
  };

  const saveNewAddress = (addr) => {
    let updated;
    if (addr.isDefault) updated = [...addresses.map(a=>({...a,isDefault:false})), addr];
    else updated = [...addresses, addr];
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    setSelected(updated.length - 1);
    setShowForm(false);
    toast.success("Address saved ✅");
  };

  const handleNext = () => {
    if (selected === null || !addresses[selected]) {
      toast.error("Please select a delivery address");
      return;
    }
    goToStep(2);
  };

  const handleConfirm = () => {
    if (payment === "upi" && !upiId.trim()) { toast.error("Enter your UPI ID"); return; }
    if (payment === "card") {
      if (cardNum.replace(/\s/g,"").length < 16) { toast.error("Enter valid card number"); return; }
      if (!cardName.trim()) { toast.error("Enter cardholder name"); return; }
      if (cardExp.length < 5) { toast.error("Enter valid expiry date"); return; }
      if (cardCvv.length < 3) { toast.error("Enter valid CVV"); return; }
    }
    onConfirm({ address: addresses[selected], payment });
  };

  const STEP_LABELS = ["Delivery Address", "Payment"];

  return createPortal(
    <div className="co-overlay" onClick={onClose}>
      <div className="co-modal" onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div className="co-modal-header">
          <span className="co-modal-title">🚀 Checkout</span>
          <button className="co-close" onClick={onClose}>✕</button>
        </div>

        {/* Step indicator */}
        <div className="co-stepper">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="co-stepper-item">
              <div className={`co-stepper-circle ${step > i+1 ? "done" : step === i+1 ? "active" : ""}`}>
                {step > i+1 ? "✓" : i+1}
              </div>
              <span className={`co-stepper-label ${step===i+1?"active":""}`}>{label}</span>
              {i < STEP_LABELS.length-1 && (
                <div className={`co-stepper-line ${step > i+1 ? "done" : ""}`} />
              )}
            </div>
          ))}
        </div>

        {/* Section label */}
        <div className="co-section-label">
          <span className="co-step-num">{step}</span>
          {step===1 ? "Delivery Address" : "Payment Method"}
        </div>

        {/* Steps */}
        {step === 1 && (
          <StepAddress
            addresses={addresses}
            selected={selected}
            setSelected={setSelected}
            showForm={showForm}
            setShowForm={setShowForm}
            onSaveAddress={saveNewAddress}
            onNext={handleNext}
          />
        )}
        {step === 2 && (
          <StepPayment
            payment={payment} setPayment={setPayment}
            upiId={upiId} setUpiId={setUpiId}
            cardNum={cardNum} setCardNum={setCardNum}
            cardName={cardName} setCardName={setCardName}
            cardExp={cardExp} setCardExp={setCardExp}
            cardCvv={cardCvv} setCardCvv={setCardCvv}
            onBack={() => goToStep(1)}
            onConfirm={handleConfirm}
            total={total}
          />
        )}

      </div>
    </div>,
    document.body
  );
}

// ── Main Cart Component ───────────────────────────────────────
export default function Cart() {
  const { cartItems, updateQty, removeItem, clearCart } = useCart();
  const [coupon,        setCoupon]        = useState("");
  const [discount,      setDiscount]      = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [showCheckout,  setShowCheckout]  = useState(false);
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.fromTo(".cart-header-content > *",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.2 }
    );
    gsap.fromTo(".cart-row",
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.4 }
    );
    gsap.fromTo(".cart-summary-box",
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", delay: 0.5 }
    );
  }, [cartItems.length]);

  // Animated remove
  const handleRemove = (id) => {
    gsap.to(`#cr-${id}`, {
      opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0,
      duration: 0.3, ease: "power2.in",
      onComplete: () => {
        removeItem(id);
        toast.success("Removed from cart");
      },
    });
  };

  const handleClearAll = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  const applyCoupon = () => {
    if (couponApplied) return;
    const code = coupon.trim().toUpperCase();
    if (code === "HUNGRY10")      { setDiscount(10);  setCouponApplied(true); toast.success("10% off applied! 🎉"); }
    else if (code === "FIRST50")  { setDiscount(50);  setCouponApplied(true); toast.success("₹50 off applied! 🎉"); }
    else toast.error("Invalid coupon code");
  };

  const subtotal    = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = discount > 10 ? discount : Math.round(subtotal * discount / 100);
  const delivery    = subtotal > 299 ? 0 : 49;
  const total       = subtotal - discountAmt + delivery;

  const handleCheckout = () => setShowCheckout(true);

  const handleOrderConfirm = async ({ address, payment }) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login to place order");
        navigate("/login");
        return;
      }

      // Validate cart items have valid IDs
      const invalidItems = cartItems.filter(item => !item._id && !item.id);
      if (invalidItems.length > 0) {
        toast.error("Some items in cart are invalid. Please refresh and try again.");
        console.error("Invalid cart items:", invalidItems);
        return;
      }

      // Prepare order data for backend
      const orderData = {
        items: cartItems.map(item => ({
          menuItemId: item._id || item.id,
          qty: item.qty
        })),
        deliveryAddress: {
          line: address.line,
          city: address.city,
          pincode: address.pincode || ""
        },
        // Map frontend payment methods to backend format
        paymentMethod: payment === "cod" ? "cod" : "online",
        couponCode: couponApplied ? coupon.trim().toUpperCase() : ""
      };

      console.log("Placing order with data:", orderData);
      console.log("Using token:", token ? "Token exists" : "No token");

      // Place order via API
      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Order placed successfully:", response.data);

      // Clear cart and redirect
      clearCart();
      setShowCheckout(false);
      toast.success("Order placed successfully! 🎉");
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      console.error("Error response:", error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "Invalid order data");
      } else {
        toast.error(error.response?.data?.message || "Failed to place order");
      }
    }
  };

  return (
    <div className="cart-page">
      <Navbar />

      {/* Header */}
      <div className="cart-header">
        <div className="cart-header-bg" />
        <div className="cart-header-content">
          <p className="section-tag">My Cart</p>
          <h1 className="cart-page-title">Your <span className="text-orange">Cart</span></h1>
          <p className="cart-page-sub">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} · Est. delivery 30 min
          </p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty-state">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet</p>
          <Link to="/menu" className="cart-browse-btn">Browse Menu →</Link>
        </div>
      ) : (
        <div className="cart-content">

          {/* ── Left — Items ── */}
          <div className="cart-items-col">
            <div className="cart-items-header">
              <h2 className="cart-col-title">
                Order Items <span className="cart-count-badge">{cartItems.length}</span>
              </h2>
              <button className="cart-clear-btn" onClick={handleClearAll}>Clear All</button>
            </div>

            <div className="cart-rows">
              {cartItems.map(item => (
                <div className="cart-row" key={item.id} id={`cr-${item.id}`}>
                  <img src={item.img || item.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&auto=format"} alt={item.name} className="cart-row-img" />
                  <div className="cart-row-info">
                    <span className="cart-row-cat">{item.category}</span>
                    <h3 className="cart-row-name">{item.name}</h3>
                    <p className="cart-row-desc">{item.desc}</p>
                    <div className="cart-row-price-info">
                      {item.discount > 0 ? (
                        <>
                          <span className="cart-row-original">₹{item.originalPrice}</span>
                          <span className="cart-row-unit">₹{item.price} / item</span>
                          <span className="cart-row-discount">{item.discount}% OFF</span>
                        </>
                      ) : (
                        <span className="cart-row-unit">₹{item.price} / item</span>
                      )}
                    </div>
                  </div>
                  <div className="cart-row-right">
                    <div className="cart-qty">
                      <button className="cart-qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                      <span className="cart-qty-num">{item.qty}</span>
                      <button className="cart-qty-btn" onClick={() => updateQty(item.id, +1)}>+</button>
                    </div>
                    <span className="cart-row-total">₹{item.price * item.qty}</span>
                    <button
                      className="cart-del-btn"
                      onClick={() => handleRemove(item.id)}
                      aria-label="Remove"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery info */}
            <div className="cart-delivery-info">
              <span>🚀</span>
              <p>Estimated delivery: <strong>25–35 minutes</strong></p>
            </div>
          </div>

          {/* ── Right — Summary ── */}
          <div className="cart-summary-box">
            <h2 className="cart-col-title">Order Summary</h2>

            {/* Coupon */}
            <div className="cart-coupon">
              <div className="cart-coupon-input-wrap">
                <span>🏷️</span>
                <input
                  type="text"
                  placeholder="Coupon code (try HUNGRY10)"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  disabled={couponApplied}
                  className="cart-coupon-input"
                  onKeyDown={e => e.key === "Enter" && applyCoupon()}
                />
              </div>
              <button
                className={`cart-coupon-btn ${couponApplied ? "applied" : ""}`}
                onClick={applyCoupon}
                disabled={couponApplied}
              >
                {couponApplied ? "✓ Applied" : "Apply"}
              </button>
            </div>

            {/* Breakdown */}
            <div className="cart-breakdown">
              <div className="cart-breakdown-row">
                <span>Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span>₹{subtotal}</span>
              </div>
              {discountAmt > 0 && (
                <div className="cart-breakdown-row green">
                  <span>Discount</span>
                  <span>−₹{discountAmt}</span>
                </div>
              )}
              <div className="cart-breakdown-row">
                <span>Delivery fee</span>
                <span>
                  {delivery === 0
                    ? <span className="free-label">FREE</span>
                    : `₹${delivery}`}
                </span>
              </div>
              {delivery === 0 && (
                <p className="free-note">🎉 You saved ₹49 on delivery!</p>
              )}
              <div className="cart-breakdown-divider" />
              <div className="cart-breakdown-row cart-total-row">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button className="cart-checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <div className="cart-secure-note">
              <span>🔒</span> Secure checkout · 100% safe payment
            </div>

            <Link to="/menu" className="cart-continue-link">← Continue Shopping</Link>
          </div>

        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          total={total}
          onClose={() => setShowCheckout(false)}
          onConfirm={handleOrderConfirm}
        />
      )}
    </div>
  );
}
