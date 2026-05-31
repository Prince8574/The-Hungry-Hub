import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import "../styles/profile.css";

// ── Three.js background ──────────────────────────────────────
function ProfileBg() {
  const mountRef = useRef(null);
  useEffect(() => {
    const mount = mountRef.current;
    const w = mount.clientWidth, h = mount.clientHeight;
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const count = 80;
    const geo   = new THREE.BufferGeometry();
    const pos   = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*14;
      pos[i*3+1] = (Math.random()-0.5)*10;
      pos[i*3+2] = (Math.random()-0.5)*6;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xff6b00, size: 0.05, transparent: true, opacity: 0.4 });
    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(3, 0.012, 8, 80),
      new THREE.MeshBasicMaterial({ color: 0xff6b00, transparent: true, opacity: 0.08 })
    );
    torus.rotation.x = Math.PI / 4;
    scene.add(torus);

    const onResize = () => {
      const nw = mount.clientWidth, nh = mount.clientHeight;
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    let id;
    const clock = new THREE.Clock();
    const animate = () => {
      id = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      particles.rotation.y = t * 0.03;
      torus.rotation.z     = t * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={mountRef} className="p-bg-canvas" />;
}

// ── Crop Modal ───────────────────────────────────────────────
function CropModal({ src, onDone, onClose }) {
  const canvasRef  = useRef(null);
  const imgRef     = useRef(null);
  const [drag, setDrag]   = useState(false);
  const [pos,  setPos]    = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const startRef = useRef(null);
  const posRef   = useRef({ x: 0, y: 0 });

  // keep posRef in sync
  useEffect(() => { posRef.current = pos; }, [pos]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;
    const SIZE = 260;
    canvas.width  = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, SIZE, SIZE);

    // clip circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE/2, SIZE/2, SIZE/2, 0, Math.PI*2);
    ctx.clip();

    const iw = img.naturalWidth  * scale;
    const ih = img.naturalHeight * scale;
    const dx = (SIZE - iw) / 2 + posRef.current.x;
    const dy = (SIZE - ih) / 2 + posRef.current.y;
    ctx.drawImage(img, dx, dy, iw, ih);
    ctx.restore();
  }, [scale]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => { imgRef.current = img; draw(); };
    img.src = src;
  }, [src, draw]);

  useEffect(() => { draw(); }, [pos, scale, draw]);

  const onMouseDown = (e) => {
    setDrag(true);
    startRef.current = { mx: e.clientX, my: e.clientY, px: posRef.current.x, py: posRef.current.y };
  };
  const onMouseMove = (e) => {
    if (!drag || !startRef.current) return;
    const dx = e.clientX - startRef.current.mx;
    const dy = e.clientY - startRef.current.my;
    setPos({ x: startRef.current.px + dx, y: startRef.current.py + dy });
  };
  const onMouseUp = () => setDrag(false);

  // touch
  const onTouchStart = (e) => {
    const t = e.touches[0];
    setDrag(true);
    startRef.current = { mx: t.clientX, my: t.clientY, px: posRef.current.x, py: posRef.current.y };
  };
  const onTouchMove = (e) => {
    if (!drag || !startRef.current) return;
    const t = e.touches[0];
    setPos({ x: startRef.current.px + (t.clientX - startRef.current.mx), y: startRef.current.py + (t.clientY - startRef.current.my) });
  };

  const confirm = () => {
    const canvas = canvasRef.current;
    onDone(canvas.toDataURL("image/png"));
  };

  return (
    <div className="crop-overlay" onClick={onClose}>
      <div className="crop-modal" onClick={e => e.stopPropagation()}>
        <div className="crop-header">
          <span>Crop Avatar</span>
          <button className="crop-close" onClick={onClose}>✕</button>
        </div>

        <div
          className="crop-stage"
          onMouseDown={onMouseDown} onMouseMove={onMouseMove}
          onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onMouseUp}
          style={{ cursor: drag ? "grabbing" : "grab" }}
        >
          <canvas ref={canvasRef} className="crop-canvas" />
          <div className="crop-circle-guide" />
        </div>

        <div className="crop-zoom">
          <span className="crop-zoom-label">🔍 Zoom</span>
          <input
            type="range" min="0.5" max="3" step="0.01"
            value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
            className="crop-slider"
          />
        </div>

        <div className="crop-actions">
          <button className="p-btn-c" onClick={onClose}>Cancel</button>
          <button className="p-btn-s" onClick={confirm}>Apply</button>
        </div>
      </div>
    </div>
  );
}

// ── Address Card ─────────────────────────────────────────────
function AddressSection({ addresses, onAdd, onEdit, onDelete, onSetDefault }) {
  return (
    <div className="addr-section">
      <div className="p-row-head" style={{ marginBottom: "1rem" }}>
        <span className="p-row-title">📍 Saved Addresses</span>
        <button className="addr-add-btn" onClick={onAdd}>+ Add New</button>
      </div>

      {addresses.length === 0 && (
        <div className="addr-empty">
          <span>🏠</span>
          <p>No addresses saved yet</p>
          <button className="addr-add-btn" onClick={onAdd}>Add your first address</button>
        </div>
      )}

      <div className="addr-list">
        {addresses.map((a, i) => (
          <div className={`addr-card ${a.isDefault ? "addr-default" : ""}`} key={i}>
            {a.isDefault && <span className="addr-badge">Default</span>}
            <div className="addr-type">{a.type === "home" ? "🏠 Home" : a.type === "work" ? "🏢 Work" : "📍 Other"}</div>
            <p className="addr-text">{a.line}</p>
            <p className="addr-city">{a.city}{a.pincode ? `, ${a.pincode}` : ""}</p>
            <div className="addr-actions">
              {!a.isDefault && (
                <button className="addr-act-btn" onClick={() => onSetDefault(i)}>Set Default</button>
              )}
              <button className="addr-act-btn" onClick={() => onEdit(i)}>Edit</button>
              <button className="addr-act-btn addr-del" onClick={() => onDelete(i)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Address Form Modal ────────────────────────────────────────
function AddressModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { type: "home", line: "", city: "", pincode: "", isDefault: false }
  );
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="crop-overlay" onClick={onClose}>
      <div className="addr-modal" onClick={e => e.stopPropagation()}>
        <div className="crop-header">
          <span>{initial ? "Edit Address" : "Add New Address"}</span>
          <button className="crop-close" onClick={onClose}>✕</button>
        </div>

        <div className="addr-type-row">
          {["home","work","other"].map(t => (
            <button
              key={t}
              className={`addr-type-btn ${form.type === t ? "active" : ""}`}
              onClick={() => set("type", t)}
            >
              {t === "home" ? "🏠 Home" : t === "work" ? "🏢 Work" : "📍 Other"}
            </button>
          ))}
        </div>

        <div className="addr-form">
          <label className="addr-label">Street / Flat / Area</label>
          <input className="p-fi" placeholder="e.g. 42, MG Road, Sector 5" value={form.line} onChange={e => set("line", e.target.value)} />

          <label className="addr-label">City</label>
          <input className="p-fi" placeholder="e.g. Jalandhar" value={form.city} onChange={e => set("city", e.target.value)} />

          <label className="addr-label">Pincode</label>
          <input className="p-fi" placeholder="e.g. 144001" value={form.pincode} onChange={e => set("pincode", e.target.value)} />

          <label className="addr-default-row">
            <input type="checkbox" checked={form.isDefault} onChange={e => set("isDefault", e.target.checked)} />
            <span>Set as default address</span>
          </label>
        </div>

        <div className="crop-actions">
          <button className="p-btn-c" onClick={onClose}>Cancel</button>
          <button className="p-btn-s" onClick={() => { if (form.line && form.city) onSave(form); else toast.error("Fill required fields"); }}>
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function Profile() {
  const [user, setUser]         = useState({ name: "", email: "", phone: "" });
  const [editing, setEditing]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [form, setForm]         = useState({});
  const [tab, setTab]           = useState("info");
  const [avatar, setAvatar]     = useState(null);
  const [cropSrc, setCropSrc]   = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [addrModal, setAddrModal] = useState(null); // null | "new" | index
  const fileRef = useRef(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(u); setForm(u);
      const saved = JSON.parse(localStorage.getItem("addresses") || "[]");
      setAddresses(saved);
      const av = localStorage.getItem("avatar");
      if (av) setAvatar(av);
    } catch {}
  }, []);

  useGSAP(() => {
    gsap.fromTo(".p-avatar-wrap", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)", delay: 0.2 });
    gsap.fromTo(".p-content", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.4 });
  }, []);

  const initials = (n) => n ? n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) : "U";

  const save = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const u = { ...user, ...form };
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u); setEditing(false);
    toast.success("Profile updated ✅");
    setLoading(false);
  };

  // ── Avatar handlers ──
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCropSrc(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onCropDone = (dataUrl) => {
    setAvatar(dataUrl);
    localStorage.setItem("avatar", dataUrl);
    setCropSrc(null);
    toast.success("Avatar updated 🎉");
  };

  // ── Address handlers ──
  const saveAddress = (addr) => {
    let updated;
    if (addrModal === "new") {
      if (addr.isDefault) updated = [...addresses.map(a => ({ ...a, isDefault: false })), addr];
      else updated = [...addresses, addr];
    } else {
      updated = addresses.map((a, i) => {
        if (addr.isDefault) return i === addrModal ? addr : { ...a, isDefault: false };
        return i === addrModal ? addr : a;
      });
    }
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    setAddrModal(null);
    toast.success(addrModal === "new" ? "Address added ✅" : "Address updated ✅");
  };

  const deleteAddress = (i) => {
    const updated = addresses.filter((_, idx) => idx !== i);
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    toast.success("Address removed");
  };

  const setDefault = (i) => {
    const updated = addresses.map((a, idx) => ({ ...a, isDefault: idx === i }));
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    toast.success("Default address updated");
  };

  const STATS = [
    { icon: "📦", val: "12", label: "Orders",   to: "/orders"   },
    { icon: "❤️", val: "8",  label: "Wishlist", to: "/wishlist" },
    { icon: "🛒", val: "3",  label: "Cart",     to: "/cart"     },
    { icon: "⭐", val: "5",  label: "Reviews",  to: "#"         },
  ];

  const FIELDS = [
    { key: "name",  label: "Full Name", icon: "👤", type: "text",  ph: "Your name"       },
    { key: "email", label: "Email",     icon: "✉️", type: "email", ph: "your@email.com"  },
    { key: "phone", label: "Phone",     icon: "📞", type: "text",  ph: "+91 98765 43210" },
  ];

  const TOGGLES = [
    { label: "Email Notifications", desc: "Order updates via email",   def: true  },
    { label: "SMS Alerts",          desc: "Delivery updates on phone", def: true  },
    { label: "Promotional Offers",  desc: "Deals and discounts",       def: false },
  ];

  return (
    <div className="pp">
      <Navbar />
      <ProfileBg />
      <div className="p-glow" />

      <div className="p-layout">

        {/* ── LEFT COLUMN ── */}
        <aside className="p-sidebar">
          {/* Avatar */}
          <div className="p-avatar-wrap">
            <div className="p-avatar" onClick={() => fileRef.current.click()}>
              {avatar
                ? <img src={avatar} alt="avatar" className="p-avatar-img" />
                : <span>{initials(user.name)}</span>
              }
              <div className="p-avatar-edit-overlay">
                <span className="p-avatar-cam">📷</span>
              </div>
            </div>
            <div className="p-avatar-ring" />
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={onFileChange} />
          </div>

          <h1 className="p-name">{user.name || "Your Name"}</h1>
          <div className="p-tags">
            {user.email && <span className="p-tag">✉️ {user.email}</span>}
            {user.phone && <span className="p-tag">📞 {user.phone}</span>}
            <span className="p-tag p-tag-o">🍔 Food Lover</span>
          </div>

          {/* Stats */}
          <div className="p-stats">
            {STATS.map((s, i) => (
              <Link to={s.to} className="p-stat" key={i}>
                <span className="p-si">{s.icon}</span>
                <span className="p-sv">{s.val}</span>
                <span className="p-sl">{s.label}</span>
              </Link>
            ))}
          </div>

          {/* Sidebar nav */}
          <nav className="p-sidenav">
            {["info","address","settings"].map(t => (
              <button key={t} className={`p-sidenav-btn ${tab===t?"active":""}`} onClick={() => {
                setTab(t);
                gsap.fromTo(".p-content", { opacity:0, y:10 }, { opacity:1, y:0, duration:0.3 });
              }}>
                <span>{t === "info" ? "👤" : t === "address" ? "📍" : "⚙️"}</span>
                {t === "info" ? "Personal Info" : t === "address" ? "Addresses" : "Settings"}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── RIGHT COLUMN ── */}
        <main className="p-main">
          <div className="p-content">

            {/* Personal Info Tab */}
            {tab === "info" && (
              <>
                <div className="p-row-head">
                  <span className="p-row-title">Personal Information</span>
                  {!editing
                    ? <button className="p-btn-e" onClick={() => setEditing(true)}>Edit</button>
                    : <div className="p-btn-group">
                        <button className="p-btn-c" onClick={() => { setEditing(false); setForm(user); }}>Cancel</button>
                        <button className="p-btn-s" onClick={save} disabled={loading}>
                          {loading ? <span className="p-spin"/> : "Save"}
                        </button>
                      </div>
                  }
                </div>
                {FIELDS.map(f => (
                  <div className="p-field" key={f.key}>
                    <span className="p-fl">{f.icon} {f.label}</span>
                    {editing
                      ? <input className="p-fi" type={f.type} value={form[f.key]||""} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.ph}/>
                      : <span className="p-fv">{user[f.key] || <em className="p-empty">Not set</em>}</span>
                    }
                  </div>
                ))}
              </>
            )}

            {/* Address Tab */}
            {tab === "address" && (
              <AddressSection
                addresses={addresses}
                onAdd={() => setAddrModal("new")}
                onEdit={(i) => setAddrModal(i)}
                onDelete={deleteAddress}
                onSetDefault={setDefault}
              />
            )}

            {/* Settings Tab */}
            {tab === "settings" && (
              <>
                <p className="p-row-title" style={{marginBottom:"0.5rem"}}>Notifications</p>
                {TOGGLES.map((t,i) => (
                  <div className="p-field" key={i}>
                    <div>
                      <p className="p-tl">{t.label}</p>
                      <p className="p-td">{t.desc}</p>
                    </div>
                    <label className="p-toggle">
                      <input type="checkbox" defaultChecked={t.def}/>
                      <span className="p-track"><span className="p-thumb"/></span>
                    </label>
                  </div>
                ))}
                <p className="p-row-title" style={{margin:"1.2rem 0 0.5rem"}}>Security</p>
                {[
                  { icon:"🔒", label:"Change Password", desc:"Update your account password", danger:false },
                  { icon:"🗑️", label:"Delete Account",  desc:"Permanently remove your account", danger:true  },
                ].map((a,i) => (
                  <button className={`p-action ${a.danger?"p-action-d":""}`} key={i}>
                    <span>{a.icon}</span>
                    <div><p>{a.label}</p><span>{a.desc}</span></div>
                    <span className="p-chev">›</span>
                  </button>
                ))}
              </>
            )}

          </div>
        </main>
      </div>

      {/* Crop Modal */}
      {cropSrc && createPortal(
        <CropModal src={cropSrc} onDone={onCropDone} onClose={() => setCropSrc(null)} />,
        document.body
      )}

      {/* Address Modal */}
      {addrModal !== null && createPortal(
        <AddressModal
          initial={addrModal !== "new" ? addresses[addrModal] : null}
          onSave={saveAddress}
          onClose={() => setAddrModal(null)}
        />,
        document.body
      )}
    </div>
  );
}
