import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast from "react-hot-toast";
import "../styles/settings.css";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const contentRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    restaurantName: "Hungry Restaurant",
    email: "admin@hungry.com",
    phone: "+91 98765 43210",
    address: "123 Food Street, Mumbai, India",
    currency: "INR",
    timezone: "Asia/Kolkata",
    language: "en",
    logo: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop"
  });

  // Business Hours
  const [businessHours, setBusinessHours] = useState({
    monday: { open: "09:00", close: "22:00", closed: false },
    tuesday: { open: "09:00", close: "22:00", closed: false },
    wednesday: { open: "09:00", close: "22:00", closed: false },
    thursday: { open: "09:00", close: "22:00", closed: false },
    friday: { open: "09:00", close: "23:00", closed: false },
    saturday: { open: "09:00", close: "23:00", closed: false },
    sunday: { open: "10:00", close: "22:00", closed: false }
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    customerReviews: true,
    dailyReports: false
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    cashOnDelivery: true,
    onlinePayment: true,
    upiPayment: true,
    cardPayment: true,
    walletPayment: false,
    taxRate: "18",
    deliveryCharge: "50"
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAlerts: true
  });

  useGSAP(() => {
    gsap.fromTo(".settings-header", 
      { opacity: 0, y: -30 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
    gsap.fromTo(".settings-tabs", 
      { opacity: 0, x: -30 }, 
      { opacity: 1, x: 0, duration: 0.6, delay: 0.1, ease: "power3.out" }
    );
    gsap.fromTo(".settings-content", 
      { opacity: 0, x: 30 }, 
      { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: "power3.out" }
    );
  }, []);

  useGSAP(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleGeneralSave = () => {
    setHasUnsavedChanges(false);
    toast.success("General settings saved successfully! ✓", {
      icon: "⚙️",
      style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ff6b00' },
      duration: 3000
    });
  };

  const handleBusinessHoursSave = () => {
    setHasUnsavedChanges(false);
    toast.success("Business hours updated successfully! ✓", {
      icon: "🕐",
      style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ff6b00' },
      duration: 3000
    });
  };

  const handleNotificationsSave = () => {
    setHasUnsavedChanges(false);
    toast.success("Notification preferences saved! ✓", {
      icon: "🔔",
      style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ff6b00' },
      duration: 3000
    });
  };

  const handlePaymentSave = () => {
    setHasUnsavedChanges(false);
    toast.success("Payment settings updated! ✓", {
      icon: "💳",
      style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ff6b00' },
      duration: 3000
    });
  };

  const handleSecuritySave = () => {
    setHasUnsavedChanges(false);
    toast.success("Security settings updated! ✓", {
      icon: "🔒",
      style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ff6b00' },
      duration: 3000
    });
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all settings to default values?")) {
      toast.success("Settings reset to defaults!", {
        icon: "🔄",
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ff6b00' }
      });
    }
  };

  const handleExportSettings = () => {
    const settings = { generalSettings, businessHours, notifications, paymentSettings, securitySettings };
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'restaurant-settings.json';
    link.click();
    toast.success("Settings exported successfully!", {
      icon: "📥",
      style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ff6b00' }
    });
  };

  const tabs = [
    { id: "general", icon: "⚙️", label: "General" },
    { id: "hours", icon: "🕐", label: "Business Hours" },
    { id: "notifications", icon: "🔔", label: "Notifications" },
    { id: "payment", icon: "💳", label: "Payment" },
    { id: "security", icon: "🔒", label: "Security" }
  ];

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <div className="header-left">
          <h1>⚙️ Settings</h1>
          <p>Manage your restaurant settings and preferences</p>
        </div>
        <div className="header-right">
          <div className="search-box-settings">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search settings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="header-actions">
            <button className="btn-icon-header" onClick={handleExportSettings} title="Export Settings">
              📥
            </button>
            <button className="btn-icon-header" onClick={handleResetToDefaults} title="Reset to Defaults">
              🔄
            </button>
          </div>
        </div>
      </div>

      <div className="settings-container">
        {/* Sidebar Tabs */}
        <div className="settings-tabs">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {activeTab === tab.id && <span className="tab-indicator" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="settings-content" ref={contentRef}>
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="settings-section">
              <div className="section-header-flat">
                <div className="section-title-group">
                  <h2>⚙️ General Settings</h2>
                  <p>Basic information about your restaurant</p>
                </div>
                <div className="section-badge-flat">
                  <span className="badge-dot"></span>
                  <span>Active</span>
                </div>
              </div>

              <div className="settings-form-flat">
                {/* Logo + Basic Information Combined */}
                <div className="form-section-flat">
                  <div className="section-label-flat">
                    <span className="label-icon">🖼️</span>
                    <span>Restaurant Logo</span>
                  </div>
                  
                  <div className="logo-with-basic-info">
                    {/* Logo Upload */}
                    <div className="logo-preview-modern" onClick={() => setHasUnsavedChanges(true)}>
                      {generalSettings.logo ? (
                        <>
                          <img src={generalSettings.logo} alt="Restaurant Logo" />
                          <div className="logo-overlay">
                            <button className="btn-change-logo">
                              <span>📷</span> Change Logo
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="logo-upload-area">
                          <span className="upload-icon">📤</span>
                          <p className="upload-text">Click to upload logo</p>
                          <p className="upload-hint">PNG or JPG • Max 2MB • 200x200px</p>
                        </div>
                      )}
                    </div>

                    {/* Basic Information - Right Side */}
                    <div className="basic-info-right">
                      <div className="section-label-inline">
                        <span className="label-icon">📝</span>
                        <span>Basic Information</span>
                      </div>

                      <div className="form-field-inline">
                        <label>Restaurant Name</label>
                        <input
                          type="text"
                          value={generalSettings.restaurantName}
                          onChange={(e) => {
                            setGeneralSettings({...generalSettings, restaurantName: e.target.value});
                            setHasUnsavedChanges(true);
                          }}
                          placeholder="Enter restaurant name"
                        />
                      </div>

                      <div className="form-row-inline">
                        <div className="form-field-inline">
                          <label>Email Address</label>
                          <input
                            type="email"
                            value={generalSettings.email}
                            onChange={(e) => {
                              setGeneralSettings({...generalSettings, email: e.target.value});
                              setHasUnsavedChanges(true);
                            }}
                            placeholder="admin@restaurant.com"
                          />
                        </div>

                        <div className="form-field-inline">
                          <label>Phone Number</label>
                          <input
                            type="tel"
                            value={generalSettings.phone}
                            onChange={(e) => {
                              setGeneralSettings({...generalSettings, phone: e.target.value});
                              setHasUnsavedChanges(true);
                            }}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address - Separate Full Width */}
                <div className="form-section-flat">
                  <div className="form-field-flat full-width">
                    <label>Address</label>
                    <textarea
                      value={generalSettings.address}
                      onChange={(e) => {
                        setGeneralSettings({...generalSettings, address: e.target.value});
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Enter full address"
                      rows="2"
                    />
                  </div>
                </div>

                {/* Regional Settings */}
                <div className="form-section-flat">
                  <div className="section-label-flat">
                    <span className="label-icon">🌍</span>
                    <span>Regional Settings</span>
                  </div>

                  <div className="form-grid-flat">
                    <div className="form-field-flat">
                      <label>Currency</label>
                      <select
                        value={generalSettings.currency}
                        onChange={(e) => {
                          setGeneralSettings({...generalSettings, currency: e.target.value});
                          setHasUnsavedChanges(true);
                        }}
                      >
                        <option value="INR">₹ INR - Indian Rupee</option>
                        <option value="USD">$ USD - US Dollar</option>
                        <option value="EUR">€ EUR - Euro</option>
                        <option value="GBP">£ GBP - British Pound</option>
                      </select>
                    </div>

                    <div className="form-field-flat">
                      <label>Timezone</label>
                      <select
                        value={generalSettings.timezone}
                        onChange={(e) => {
                          setGeneralSettings({...generalSettings, timezone: e.target.value});
                          setHasUnsavedChanges(true);
                        }}
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="America/New_York">America/New York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                      </select>
                    </div>

                    <div className="form-field-flat">
                      <label>Language</label>
                      <select
                        value={generalSettings.language}
                        onChange={(e) => {
                          setGeneralSettings({...generalSettings, language: e.target.value});
                          setHasUnsavedChanges(true);
                        }}
                      >
                        <option value="en">English</option>
                        <option value="hi">हिन्दी (Hindi)</option>
                        <option value="es">Español (Spanish)</option>
                        <option value="fr">Français (French)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Save Actions */}
                <div className="form-actions-flat">
                  {hasUnsavedChanges && (
                    <div className="unsaved-indicator-flat">
                      <span className="indicator-dot"></span>
                      <span>You have unsaved changes</span>
                    </div>
                  )}
                  <div className="action-buttons-flat">
                    <button className="btn-text-action" onClick={() => setHasUnsavedChanges(false)}>
                      Cancel
                    </button>
                    <button className="btn-save-flat" onClick={handleGeneralSave}>
                      <span>💾</span> Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Hours */}
          {activeTab === "hours" && (
            <div className="settings-section">
              <div className="section-header">
                <div className="section-title-group">
                  <h2>🕐 Business Hours</h2>
                  <p>Set your restaurant operating hours</p>
                </div>
                <button className="btn-quick-action" onClick={() => {
                  const allOpen = { open: "09:00", close: "22:00", closed: false };
                  setBusinessHours({
                    monday: allOpen, tuesday: allOpen, wednesday: allOpen,
                    thursday: allOpen, friday: allOpen, saturday: allOpen, sunday: allOpen
                  });
                  setHasUnsavedChanges(true);
                }}>
                  <span>⚡</span> Set All Days
                </button>
              </div>

              <div className="business-hours-list">
                {Object.entries(businessHours).map(([day, hours]) => (
                  <div key={day} className="hours-row">
                    <div className="day-info">
                      <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                      <label className="closed-toggle">
                        <input
                          type="checkbox"
                          checked={hours.closed}
                          onChange={(e) => setBusinessHours({
                            ...businessHours,
                            [day]: { ...hours, closed: e.target.checked }
                          })}
                        />
                        <span className="toggle-text">Closed</span>
                      </label>
                    </div>
                    {!hours.closed && (
                      <div className="time-inputs">
                        <div className="time-group">
                          <label>Open</label>
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => setBusinessHours({
                              ...businessHours,
                              [day]: { ...hours, open: e.target.value }
                            })}
                          />
                        </div>
                        <span className="time-separator">—</span>
                        <div className="time-group">
                          <label>Close</label>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => setBusinessHours({
                              ...businessHours,
                              [day]: { ...hours, close: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    )}
                    {hours.closed && (
                      <div className="closed-badge">Closed</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button className="btn-save" onClick={handleBusinessHoursSave}>
                  <span>💾</span> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>🔔 Notification Preferences</h2>
                <p>Choose how you want to receive notifications</p>
              </div>

              <div className="notification-groups">
                <div className="notification-group">
                  <h3>📢 Notification Channels</h3>
                  <div className="toggle-list">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <span className="toggle-label">Email Notifications</span>
                        <span className="toggle-desc">Receive notifications via email</span>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={notifications.emailNotifications}
                          onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <span className="toggle-label">SMS Notifications</span>
                        <span className="toggle-desc">Receive notifications via SMS</span>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={notifications.smsNotifications}
                          onChange={(e) => setNotifications({...notifications, smsNotifications: e.target.checked})}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <span className="toggle-label">Push Notifications</span>
                        <span className="toggle-desc">Receive browser push notifications</span>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={notifications.pushNotifications}
                          onChange={(e) => setNotifications({...notifications, pushNotifications: e.target.checked})}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="notification-group">
                  <h3>🎯 Alert Types</h3>
                  <div className="toggle-list">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <span className="toggle-label">Order Alerts</span>
                        <span className="toggle-desc">Get notified for new orders</span>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={notifications.orderAlerts}
                          onChange={(e) => setNotifications({...notifications, orderAlerts: e.target.checked})}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <span className="toggle-label">Low Stock Alerts</span>
                        <span className="toggle-desc">Get notified when items are low in stock</span>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={notifications.lowStockAlerts}
                          onChange={(e) => setNotifications({...notifications, lowStockAlerts: e.target.checked})}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <span className="toggle-label">Customer Reviews</span>
                        <span className="toggle-desc">Get notified for new customer reviews</span>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={notifications.customerReviews}
                          onChange={(e) => setNotifications({...notifications, customerReviews: e.target.checked})}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <span className="toggle-label">Daily Reports</span>
                        <span className="toggle-desc">Receive daily sales and performance reports</span>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={notifications.dailyReports}
                          onChange={(e) => setNotifications({...notifications, dailyReports: e.target.checked})}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-save" onClick={handleNotificationsSave}>
                  <span>💾</span> Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === "payment" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>💳 Payment Settings</h2>
                <p>Configure payment methods and pricing</p>
              </div>

              <div className="payment-section">
                <h3>💰 Payment Methods</h3>
                <div className="payment-methods-grid">
                  <div className={`payment-card ${paymentSettings.cashOnDelivery ? 'active' : ''}`}
                       onClick={() => setPaymentSettings({...paymentSettings, cashOnDelivery: !paymentSettings.cashOnDelivery})}>
                    <span className="payment-icon">💵</span>
                    <span className="payment-name">Cash on Delivery</span>
                    {paymentSettings.cashOnDelivery && <span className="check-icon">✓</span>}
                  </div>
                  <div className={`payment-card ${paymentSettings.onlinePayment ? 'active' : ''}`}
                       onClick={() => setPaymentSettings({...paymentSettings, onlinePayment: !paymentSettings.onlinePayment})}>
                    <span className="payment-icon">🌐</span>
                    <span className="payment-name">Online Payment</span>
                    {paymentSettings.onlinePayment && <span className="check-icon">✓</span>}
                  </div>
                  <div className={`payment-card ${paymentSettings.upiPayment ? 'active' : ''}`}
                       onClick={() => setPaymentSettings({...paymentSettings, upiPayment: !paymentSettings.upiPayment})}>
                    <span className="payment-icon">📱</span>
                    <span className="payment-name">UPI Payment</span>
                    {paymentSettings.upiPayment && <span className="check-icon">✓</span>}
                  </div>
                  <div className={`payment-card ${paymentSettings.cardPayment ? 'active' : ''}`}
                       onClick={() => setPaymentSettings({...paymentSettings, cardPayment: !paymentSettings.cardPayment})}>
                    <span className="payment-icon">💳</span>
                    <span className="payment-name">Card Payment</span>
                    {paymentSettings.cardPayment && <span className="check-icon">✓</span>}
                  </div>
                  <div className={`payment-card ${paymentSettings.walletPayment ? 'active' : ''}`}
                       onClick={() => setPaymentSettings({...paymentSettings, walletPayment: !paymentSettings.walletPayment})}>
                    <span className="payment-icon">👛</span>
                    <span className="payment-name">Wallet Payment</span>
                    {paymentSettings.walletPayment && <span className="check-icon">✓</span>}
                  </div>
                </div>
              </div>

              <div className="payment-section">
                <h3>💲 Pricing Configuration</h3>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Tax Rate (%)</label>
                    <input
                      type="number"
                      value={paymentSettings.taxRate}
                      onChange={(e) => setPaymentSettings({...paymentSettings, taxRate: e.target.value})}
                      placeholder="18"
                      min="0"
                      max="100"
                    />
                    <span className="input-hint">GST/VAT percentage</span>
                  </div>
                  <div className="form-group">
                    <label>Delivery Charge (₹)</label>
                    <input
                      type="number"
                      value={paymentSettings.deliveryCharge}
                      onChange={(e) => setPaymentSettings({...paymentSettings, deliveryCharge: e.target.value})}
                      placeholder="50"
                      min="0"
                    />
                    <span className="input-hint">Standard delivery fee</span>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-save" onClick={handlePaymentSave}>
                  <span>💾</span> Save Settings
                </button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>🔒 Security Settings</h2>
                <p>Manage your account security and privacy</p>
              </div>

              <div className="security-section">
                <h3>🛡️ Authentication</h3>
                <div className="toggle-list">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">Two-Factor Authentication</span>
                      <span className="toggle-desc">Add an extra layer of security to your account</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">Login Alerts</span>
                      <span className="toggle-desc">Get notified when someone logs into your account</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={securitySettings.loginAlerts}
                        onChange={(e) => setSecuritySettings({...securitySettings, loginAlerts: e.target.checked})}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="security-section">
                <h3>⏱️ Session Management</h3>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Session Timeout (minutes)</label>
                    <select
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                    <span className="input-hint">Auto logout after inactivity</span>
                  </div>
                  <div className="form-group">
                    <label>Password Expiry (days)</label>
                    <select
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: e.target.value})}
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="never">Never</option>
                    </select>
                    <span className="input-hint">Force password change after</span>
                  </div>
                </div>
              </div>

              <div className="security-section">
                <h3>🔑 Password Management</h3>
                <button className="btn-secondary">
                  <span>🔄</span> Change Password
                </button>
              </div>

              <div className="form-actions">
                <button className="btn-save" onClick={handleSecuritySave}>
                  <span>💾</span> Save Security Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
