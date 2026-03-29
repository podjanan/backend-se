const db = require('../config/db')

// บันทึก OTP ใหม่
exports.createOtp = (email, otp, expiresAt) => {
    return db.query(
        `INSERT INTO otp_codes(email, otp, expires_at) VALUES($1, $2, $3)`,
        [email, otp, expiresAt]
    )
}

// หา OTP ล่าสุดที่ยังไม่หมดอายุ
exports.findValidOtp = (email, otp) => {
    return db.query(
        `SELECT * FROM otp_codes
        WHERE email=$1
        AND otp=$2
        AND expires_at > NOW()
        ORDER BY created_at DESC LIMIT 1`,
        [email, otp]
    )
}

// ลบ OTP ของ email นั้นทั้งหมด (เรียกหลัง verify สำเร็จ)
exports.deleteOtpByEmail = (email) => {
    return db.query(
        `DELETE FROM otp_codes WHERE email=$1`,
        [email]
    )
}