const competitionModel = require("../models/competitionModel");

exports.createCompetition = async (req, res) => {
  try {
    const data = req.body;

    await competitionModel.create({
      camp_id: data.camp_id,
      competition_format: data.competition_format,
      registration_type: data.registration_type,
      team_size: data.team_size,
      prize: data.prize
    });

    res.status(201).json({
      message: "Competition created"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};