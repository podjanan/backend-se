const db = require("../config/db");

exports.create = async ({ user_id, comment }) => {
  const result = await db.query(
    `INSERT INTO review_web (user_id, comment) VALUES ($1, $2) RETURNING id`,
    [user_id, comment]
  );
  return result.rows[0];
};

exports.getAll = async () => {
  const result = await db.query(`
    SELECT r.id, r.comment, r.created_at,
           u.full_name AS name,
           u.avatar_url
    FROM review_web r
    JOIN users u ON u.id = r.user_id
    ORDER BY r.created_at DESC
    LIMIT 20
  `);
  return result.rows;
};