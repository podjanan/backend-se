const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middlewares/authMiddleware");

router.get("/", reviewController.getReviews);          // public
router.post("/", auth, reviewController.createReview); // ต้อง login

module.exports = router;