const router = require('express').Router()
const auth = require('../controllers/authController')

router.post('/register', auth.register)
router.post('/verify-otp', auth.verifyOtp)
router.post('/login', auth.login)

// Reset password flow
router.post('/forgot-password', auth.forgotPassword)
router.post('/verify-reset-otp', auth.verifyResetOtp)
router.post('/reset-password', auth.resetPassword)

module.exports = router