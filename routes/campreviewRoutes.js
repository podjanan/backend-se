const express = require("express");
const router = express.Router({ mergeParams: true });
const ctrl = require("../controllers/campreviewController");
const auth = require("../middlewares/authMiddleware");

router.get("/", ctrl.getReviews);
router.post("/", auth, ctrl.createReview);

module.exports = router;