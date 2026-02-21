const router = require('express').Router()
const controller = require('../controllers/competitionController')
const auth = require('../middlewares/authMiddleware')
const authorize = require('../middlewares/roleMiddleware')

router.post('/competition',auth,authorize("organizer"),controller.createCompetition)

module.exports = router
