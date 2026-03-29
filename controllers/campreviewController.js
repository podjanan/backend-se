const campReviewModel = require("../models/campreviewModel");

exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const camp_id = req.params.camp_id;
    const user_id = req.user?.id || null;
    await campReviewModel.create({ camp_id, user_id, rating, comment });
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await campReviewModel.getByCampId(req.params.camp_id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};