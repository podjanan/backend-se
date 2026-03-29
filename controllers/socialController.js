const socialModel = require("../models/socialModel");

exports.createSocial = async (req, res) => {
  try {
    await socialModel.create(req.body);
    res.status(201).json({ message: "Social links added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSocialByCampId = async (req, res) => {
  try {
    const result = await socialModel.getByCampId(req.params.camp_id);
    res.json(result || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};