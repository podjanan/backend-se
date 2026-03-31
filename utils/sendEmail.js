const nodemailer = require('nodemailer')

console.log("USING IPV4 SMTP CONFIG")

module.exports = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4, // 🔥 ตัวแก้ปัญหาจริง
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "YourCamp : OTP Verification",
    text: `Your OTP is ${otp}`,
  })
}
