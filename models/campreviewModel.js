const db = require("../config/db");

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
            u.full_name AS name
     FROM reviews r
     LEFT JOIN users u ON u.id = r.user_id
     WHERE r.camp_id = $1
     ORDER BY r.id DESC`,
    [camp_id]
  );
  return result.rows;
};