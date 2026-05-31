const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendOtpEmail = async (email, name, otp) => {
  const mailOptions = {
    from: `"The Hungry Hub 🍔" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for The Hungry Hub",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#111;color:#fff;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#ff6b00,#ff3d00);padding:28px;text-align:center;">
          <h1 style="margin:0;font-size:1.8rem;">🍔 The Hungry Hub</h1>
          <p style="margin:6px 0 0;opacity:0.85;">Email Verification</p>
        </div>
        <div style="padding:32px;">
          <p style="font-size:1rem;margin:0 0 8px;">Hi <strong>${name}</strong>,</p>
          <p style="color:rgba(255,255,255,0.65);margin:0 0 24px;">Use the OTP below to verify your email. It expires in <strong>10 minutes</strong>.</p>
          <div style="background:rgba(255,107,0,0.1);border:2px dashed #ff6b00;border-radius:12px;padding:20px;text-align:center;letter-spacing:12px;font-size:2.2rem;font-weight:700;color:#ff6b00;">
            ${otp}
          </div>
          <p style="color:rgba(255,255,255,0.4);font-size:0.8rem;margin-top:20px;text-align:center;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ OTP sent to ${email}`);
};

module.exports = { generateOtp, sendOtpEmail };
