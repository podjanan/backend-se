const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const otpModel = require('../models/otpModel')
const generateOtp = require('../utils/generateOtp')
const sendEmail = require('../utils/sendEmail')

exports.register = async(req,res)=>{
    try{
        const allowedRoles = ["student","organizer"]
        const {fullName,email,password,role} = req.body
        if(!allowedRoles.includes(role)){
            return res.status(400).json("Invalid role")
        }else{
            const hash = await bcrypt.hash(password,10)
            await userModel.createUser({fullName,email,password:hash,role})
            const otp = generateOtp()
            const expires = new Date(Date.now()+300000)
            await otpModel.createOtp(email, otp, expires)
            await sendEmail(email,otp)
            res.json({message:"Register success"})
        }
    }catch(err){
        res.status(500).json(err.message)
    }
}

exports.verifyOtp = async(req,res)=>{
    const {email,otp} = req.body
    const result = await otpModel.findValidOtp(email, otp)
    if(result.rows.length==0)
        return res.status(400).json("Invalid OTP")
    await userModel.activateUser(email)
    await otpModel.deleteOtpByEmail(email)
    res.json("Verified")
}

exports.login = async(req,res)=>{
    const {email,password} = req.body
    const result = await userModel.findByEmail(email)
    const user = result.rows[0]
    
    if(!user)
        return res.status(404).json("User not found")
    if(user.status!='active')
        return res.status(401).json("Verify OTP first")
    
    const match = await bcrypt.compare(password,user.password)
    if(!match)
        return res.status(401).json("Wrong password")
    
    const token = jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:"1d"})
    res.json({token,role:user.role})
}

// ─── Reset Password Flow ──────────────────────────────────────────────────────

// Step 1: รับ email แล้วส่ง OTP ไปให้
exports.forgotPassword = async(req,res)=>{
    try{
        const {email} = req.body
        if(!email)
            return res.status(400).json("Email is required")

        // เช็คว่า user มีอยู่จริงไหม
        const result = await userModel.findByEmail(email)
        const user = result.rows[0]
        if(!user)
            return res.status(404).json("User not found")

        // สร้าง OTP แล้วเซฟลง otp_codes (ใช้ table เดิม)
        const otp = generateOtp()
        const expires = new Date(Date.now() + 300000) // หมดอายุ 5 นาที
        await otpModel.createOtp(email, otp, expires)
        await sendEmail(email, otp)

        res.json({message:"OTP sent to email"})
    }catch(err){
        res.status(500).json(err.message)
    }
}

// Step 2: ตรวจสอบ OTP แล้วคืน reset_token
exports.verifyResetOtp = async(req,res)=>{
    try{
        const {email,otp} = req.body
        if(!email || !otp)
            return res.status(400).json("Email and OTP are required")

        const result = await otpModel.findValidOtp(email, otp)
        if(result.rows.length === 0)
            return res.status(400).json("Invalid or expired OTP")

        await otpModel.deleteOtpByEmail(email)

        // สร้าง reset_token อายุ 10 นาที สำหรับ step 3
        const resetToken = jwt.sign(
            {email, purpose:"reset_password"},
            process.env.JWT_SECRET,
            {expiresIn:"10m"}
        )

        res.json({reset_token: resetToken})
    }catch(err){
        res.status(500).json(err.message)
    }
}

// Step 3: รับ reset_token + new_password แล้วอัปเดตรหัส
exports.resetPassword = async(req,res)=>{
    try{
        const {reset_token, new_password} = req.body
        if(!reset_token || !new_password)
            return res.status(400).json("reset_token and new_password are required")

        // verify token ที่ได้จาก step 2
        let payload
        try{
            payload = jwt.verify(reset_token, process.env.JWT_SECRET)
        }catch(e){
            return res.status(401).json("Invalid or expired reset token")
        }

        if(payload.purpose !== "reset_password")
            return res.status(401).json("Invalid token purpose")

        // hash แล้วบันทึกรหัสใหม่
        const hash = await bcrypt.hash(new_password, 10)
        await userModel.updatePassword(payload.email, hash)

        res.json({message:"Password reset successful"})
    }catch(err){
        res.status(500).json(err.message)
    }
}