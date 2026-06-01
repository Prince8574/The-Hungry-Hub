const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ── Status config ─────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    emoji: "🔔", color: "#ffc107", title: "Order Received!",
    message: "We've received your order and it's being reviewed.",
    subtext: "You'll get another update when it's confirmed.",
  },
  confirmed: {
    emoji: "✅", color: "#2196f3", title: "Order Confirmed!",
    message: "Great news! Your order has been confirmed.",
    subtext: "Our kitchen will start preparing it shortly.",
  },
  preparing: {
    emoji: "👨‍🍳", color: "#ff9800", title: "Being Prepared!",
    message: "Our chefs are preparing your delicious food right now.",
    subtext: "Sit tight — it'll be ready soon!",
  },
  out_for_delivery: {
    emoji: "🚚", color: "#9c27b0", title: "Out for Delivery!",
    message: "Your order is on its way to you!",
    subtext: "Our delivery partner is heading to your location.",
  },
  delivered: {
    emoji: "🎉", color: "#4caf50", title: "Order Delivered!",
    message: "Your order has been delivered successfully.",
    subtext: "Enjoy your meal! Thank you for ordering from The Hungry Hub.",
  },
  cancelled: {
    emoji: "❌", color: "#f44336", title: "Order Cancelled",
    message: "Your order has been cancelled.",
    subtext: "If you have any questions, please contact our support.",
  },
};

// ── Send order status notification ───────────────────────────
const sendOrderNotification = async (order, customerEmail, customerName) => {
  if (!customerEmail) return;
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "your_email@gmail.com") {
    console.log(`📧 [DEV] Order notification: ${order.status} → ${customerEmail}`);
    return;
  }

  const cfg      = STATUS_CONFIG[order.status];
  if (!cfg) return;

  const shortId  = order._id.toString().slice(-6).toUpperCase();
  const date     = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  const itemsHtml = (order.items || []).map(item => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;">${item.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#666;text-align:center;">× ${item.qty}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;text-align:right;font-weight:600;">₹${(item.price * item.qty).toLocaleString()}</td>
    </tr>`).join("");

  // Progress bar steps
  const steps = ["pending","confirmed","preparing","out_for_delivery","delivered"];
  const currentIdx = steps.indexOf(order.status);

  const stepLabels = {
    pending: "Received", confirmed: "Confirmed",
    preparing: "Preparing", out_for_delivery: "Out for Delivery", delivered: "Delivered"
  };

  const stepsHtml = order.status !== "cancelled" ? `
  <tr>
    <td style="background:#fff;padding:20px 32px 28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${steps.map((s, i) => {
            const done    = i <= currentIdx;
            const current = i === currentIdx;
            const sc      = STATUS_CONFIG[s];
            const isLast  = i === steps.length - 1;
            return `
              <td style="text-align:center;vertical-align:top;position:relative;">
                <!-- Circle -->
                <div style="
                  width:52px;height:52px;border-radius:50%;
                  margin:0 auto 8px;
                  background:${done ? cfg.color : "#f0f0f0"};
                  display:flex;align-items:center;justify-content:center;
                  font-size:22px;line-height:52px;
                  border:3px solid ${current ? cfg.color : done ? cfg.color : "#e0e0e0"};
                  box-shadow:${current ? `0 0 0 4px ${cfg.color}30` : "none"};
                  position:relative;z-index:2;
                ">${sc.emoji}</div>
                <!-- Label -->
                <div style="
                  font-size:11px;
                  color:${done ? "#333" : "#aaa"};
                  font-weight:${current ? "800" : done ? "600" : "400"};
                  white-space:nowrap;
                ">${stepLabels[s]}</div>
                ${current ? `<div style="font-size:9px;color:${cfg.color};font-weight:700;margin-top:2px;">● Now</div>` : ""}
              </td>
              ${!isLast ? `
              <td style="vertical-align:top;padding-top:24px;">
                <div style="height:3px;background:${i < currentIdx ? cfg.color : "#e0e0e0"};border-radius:2px;margin:0 -4px;"></div>
              </td>` : ""}
            `;
          }).join("")}
        </tr>
      </table>
    </td>
  </tr>` : "";

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

  <!-- Top strip -->
  <tr><td style="background:linear-gradient(90deg,#ff6b00,#ff9500,#ff6b00);height:4px;border-radius:4px 4px 0 0;"></td></tr>

  <!-- Header -->
  <tr>
    <td style="background:#1a1a1a;padding:32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">${cfg.emoji}</div>
      <h1 style="margin:0 0 6px;color:#fff;font-size:24px;font-weight:800;">${cfg.title}</h1>
      <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;letter-spacing:2px;text-transform:uppercase;">
        Order #${shortId}
      </p>
    </td>
  </tr>

  <!-- Status badge -->
  <tr>
    <td style="background:#fff;padding:24px 32px 0;text-align:center;">
      <span style="display:inline-block;background:${cfg.color};color:#fff;
                   padding:8px 24px;border-radius:50px;font-size:14px;font-weight:700;">
        ${cfg.emoji} ${cfg.title.replace("!", "")}
      </span>
    </td>
  </tr>

  <!-- Progress tracker (only for non-cancelled) -->
  ${order.status !== "cancelled" ? stepsHtml : ""}

  <!-- Message -->
  <tr>
    <td style="background:#fff;padding:24px 32px;">
      <p style="margin:0 0 6px;font-size:16px;color:#1a1a1a;">Hi <strong>${customerName}</strong>! 👋</p>
      <p style="margin:0 0 4px;color:#333;font-size:15px;font-weight:600;">${cfg.message}</p>
      <p style="margin:0;color:#888;font-size:13px;">${cfg.subtext}</p>
    </td>
  </tr>

  <!-- Order details -->
  <tr>
    <td style="background:#fff;padding:0 32px 24px;">
      <div style="background:#f9f9f9;border:1px solid #eee;border-radius:12px;padding:20px;">
        <p style="margin:0 0 12px;color:#999;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">
          📦 Order Summary
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:10px 0 0;font-size:14px;font-weight:700;color:#1a1a1a;">Total</td>
              <td style="padding:10px 0 0;font-size:16px;font-weight:800;color:#ff6b00;text-align:right;">
                ₹${order.totalAmount?.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </td>
  </tr>

  <!-- Delivery address -->
  <tr>
    <td style="background:#fff;padding:0 32px 24px;">
      <div style="background:#f9f9f9;border:1px solid #eee;border-radius:12px;padding:16px 20px;">
        <p style="margin:0 0 6px;color:#999;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">
          📍 Delivery Address
        </p>
        <p style="margin:0;color:#333;font-size:13px;line-height:1.6;">
          ${order.deliveryAddress?.line || ""}, ${order.deliveryAddress?.city || ""}
          ${order.deliveryAddress?.pincode ? ` - ${order.deliveryAddress.pincode}` : ""}
        </p>
      </div>
    </td>
  </tr>

  <!-- Payment info -->
  <tr>
    <td style="background:#fff;padding:0 32px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="48%" style="padding-right:8px;">
            <div style="background:#f9f9f9;border:1px solid #eee;border-radius:10px;padding:12px 16px;">
              <p style="margin:0 0 3px;color:#999;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Payment</p>
              <p style="margin:0;color:#333;font-size:13px;font-weight:600;">
                ${order.paymentMethod === "cod" ? "💵 Cash on Delivery" : "💳 Online Paid"}
              </p>
            </div>
          </td>
          <td width="4%"></td>
          <td width="48%" style="padding-left:8px;">
            <div style="background:#f9f9f9;border:1px solid #eee;border-radius:10px;padding:12px 16px;">
              <p style="margin:0 0 3px;color:#999;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Updated</p>
              <p style="margin:0;color:#333;font-size:13px;font-weight:600;">${date}</p>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#1a1a1a;padding:24px 32px;text-align:center;border-radius:0 0 16px 16px;">
      <p style="margin:0 0 4px;color:#ff6b00;font-size:15px;font-weight:800;">🍔 The Hungry Hub</p>
      <p style="margin:0 0 12px;color:#555;font-size:11px;letter-spacing:1px;">FRESH FOOD · FAST DELIVERY · HAPPY CUSTOMERS</p>
      <p style="margin:0;color:#444;font-size:10px;">
        This is an automated notification. Please do not reply to this email.
      </p>
    </td>
  </tr>

  <!-- Bottom strip -->
  <tr><td style="background:linear-gradient(90deg,#ff6b00,#ff9500,#ff6b00);height:4px;border-radius:0 0 4px 4px;"></td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"The Hungry Hub 🍔" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `${cfg.emoji} Order #${shortId} — ${cfg.title}`,
    html,
  });

  console.log(`✅ Order notification [${order.status}] sent to ${customerEmail}`);
};

module.exports = { sendOrderNotification };
