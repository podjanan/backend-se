const nodemailer = require('nodemailer')

module.exports = async(email,otp)=>{
    const transporter = nodemailer.createTransport({service:"gmail",auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}})

    await transporter.sendMail({
        to:email,
        subject:"YourCamp : OTP Verification",
        text:`Your OTP is ${otp}`
})
}