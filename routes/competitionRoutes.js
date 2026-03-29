const express = require("express");
const router = express.Router();
const competitionController = require("../controllers/competitionController");

router.post("/", competitionController.createCompetition);

module.exports = router;