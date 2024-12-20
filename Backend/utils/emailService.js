const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="color: #e53e3e; font-size: 32px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };
