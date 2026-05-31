# ⚙️ Settings Page - Admin Panel

## Overview
Comprehensive settings page for managing restaurant configuration, business hours, notifications, payments, and security.

## Features Implemented

### 📑 Tab Navigation
- **5 Main Sections**: General, Business Hours, Notifications, Payment, Security
- Sticky sidebar navigation with smooth animations
- Active tab indicator with pulse animation
- Hover effects with slide and color transitions

### ⚙️ General Settings
- Restaurant name, email, phone, address
- Currency selection (INR, USD, EUR, GBP)
- Timezone configuration
- Language preferences
- Form validation ready

### 🕐 Business Hours
- Configure hours for each day of the week
- Open/Close time pickers
- "Closed" toggle for holidays
- Visual feedback for closed days
- Easy-to-use time inputs

### 🔔 Notification Preferences
- **Notification Channels**:
  - Email Notifications
  - SMS Notifications
  - Push Notifications
- **Alert Types**:
  - Order Alerts
  - Low Stock Alerts
  - Customer Reviews
  - Daily Reports
- Beautiful toggle switches with smooth animations

### 💳 Payment Settings
- **Payment Methods** (Click to enable/disable):
  - Cash on Delivery 💵
  - Online Payment 🌐
  - UPI Payment 📱
  - Card Payment 💳
  - Wallet Payment 👛
- **Pricing Configuration**:
  - Tax Rate (GST/VAT %)
  - Delivery Charge (₹)
- Visual card selection with checkmarks

### 🔒 Security Settings
- **Authentication**:
  - Two-Factor Authentication toggle
  - Login Alerts toggle
- **Session Management**:
  - Session Timeout (15min - 2hrs)
  - Password Expiry (30-90 days or never)
- Change Password button
- Security-focused UI

## Design Features

### 🎨 Animations
- Page load animation with scale effect
- Staggered tab entrance animations
- Content fade-in on tab switch
- Smooth hover transitions
- Toggle switch animations
- Payment card selection animations
- Button ripple effects

### 🎯 UI/UX
- Clean, modern interface
- Consistent spacing and typography
- Color-coded sections
- Intuitive form layouts
- Responsive grid system
- Focus states with glow effects
- Toast notifications for save actions

### 📱 Responsive Design
- Desktop: Sidebar + Content layout
- Tablet: Reduced sidebar width
- Mobile: Horizontal scrolling tabs
- Adaptive form layouts
- Touch-friendly controls

## Color Scheme
- Primary: Orange (#ff6b00)
- Background: Dark (#1a1a1a)
- Text: White/Gray
- Borders: Subtle rgba overlays
- Accents: Gradient buttons

## File Structure
```
admin/
├── src/
│   ├── pages/
│   │   └── Settings.jsx          # Main settings page
│   └── styles/
│       └── settings.css           # Settings styles
```

## Usage

### Navigation
Click on any tab in the sidebar to switch between settings sections.

### Saving Changes
Each section has its own "Save" button that triggers a toast notification.

### Form Interactions
- All inputs have focus states
- Toggle switches are animated
- Payment cards are clickable
- Time pickers for business hours
- Dropdowns for selections

## Future Enhancements
- Backend integration for saving settings
- Profile picture upload
- Email template customization
- Advanced security options (IP whitelist, etc.)
- Backup/Restore settings
- Activity logs
- Multi-language support
- Dark/Light theme toggle

## Technical Details
- Built with React + GSAP animations
- React Hot Toast for notifications
- React Router for navigation
- CSS Grid & Flexbox layouts
- Custom toggle switches
- Responsive breakpoints: 1024px, 768px, 480px

---

**Status**: ✅ Complete and Ready to Use
**Last Updated**: 2026-04-29
