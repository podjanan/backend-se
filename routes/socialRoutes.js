const express = require("express");
const router = express.Router();
const socialController = require("../controllers/socialController");

router.post("/", socialController.createSocial);
router.get("/:camp_id", socialController.getSocialByCampId);

module.exports = router;