const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const db = require('../config/db')
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
            await db.query(`INSERT INTO otp_codes(email,otp,expires_at) VALUES($1,$2,$3)`,[email,otp,expires])
            await sendEmail(email,otp)
            res.json({message:"Register success"})
        }

    }catch(err){
        res.status(500).json(err.message)
    }
}

exports.verifyOtp = async(req,res)=>{
        const {email,otp} = req.body
        const result = await db.query(
        `SELECT * FROM otp_codes
        WHERE email=$1
        AND otp=$2
        AND expires_at > NOW()
        ORDER BY created_at DESC LIMIT 1`
        ,[email,otp])
        if(result.rows.length==0)
            return res.status(400).json("Invalid OTP")
        await userModel.activateUser(email)
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
