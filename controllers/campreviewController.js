const db = require("../config/db");

// ── Review Controller ─────────────────────────────────────────────────────────

exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const camp_id = req.params.camp_id;
    const user_id = req.user?.id || null;
    await exports.create({ camp_id, user_id, rating, comment });
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await exports.getByCampId(req.params.camp_id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Review Model ──────────────────────────────────────────────────────────────

exports.create = async ({ camp_id, user_id, rating, comment }) => {
  const result = await db.query(
    `INSERT INTO reviews (camp_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING id`,
    [camp_id, user_id || null, rating, comment]
  );
  return result.rows[0];
};

exports.getByCampId = async (camp_id) => {
  const result = await db.query(
    `SELECT r.id, r.rating, r.comment,
            u.full_name AS name,
            u.avatar_url AS avatar_url   -- ✅ เพิ่ม
     FROM reviews r
     LEFT JOIN users u ON u.id = r.user_id
     WHERE r.camp_id = $1
     ORDER BY r.id DESC`,
    [camp_id]
  );
  return result.rows;
};