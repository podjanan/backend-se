const db = require("../config/db");

// approve
exports.approveCamp = async (req, res) => {
  try {
    await db.execute(
      "UPDATE camps SET status = 'approved' WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// reject
exports.rejectCamp = async (req, res) => {
  try {
    await db.execute(
      "UPDATE camps SET status = 'rejected' WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};