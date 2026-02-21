const router = require('express').Router()
const campController = require('../controllers/campController')
const auth = require('../middlewares/authMiddleware')
const authorize = require('../middlewares/roleMiddleware')



router.post('/',auth,authorize("organizer"),campController.createCamp)

module.exports = router
