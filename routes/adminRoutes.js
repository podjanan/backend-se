const router = require('express').Router()
const controller = require('../controllers/adminController')
const auth = require('../middlewares/authMiddleware')
const admin = require('../middlewares/adminMiddleware')

router.put('/camp/:id/approve',auth,admin,controller.approveCamp)
router.put('/camp/:id/reject',auth,admin,controller.rejectCamp)
router.put('/camp/:id/status',auth,admin,controller.updateCampStatus)
router.get('/camps',auth,admin,controller.getAllCamps)

module.exports = router
