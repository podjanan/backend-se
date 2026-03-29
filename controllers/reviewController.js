const reviewModel = require("../models/reviewModel");

// POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment?.trim()) return res.status(400).json({ message: "กรุณากรอกความคิดเห็น" });

    const review = await reviewModel.create({
      user_id: req.user.id,
      comment: comment.trim(),
    });
    res.status(201).json({ message: "บันทึกรีวิวแล้ว", id: review.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.getAll();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};