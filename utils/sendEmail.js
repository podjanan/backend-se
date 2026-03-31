const nodemailer = require('nodemailer')

module.exports = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4, // 🔥 แก้ ENETUNREACH ตรงนี้
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