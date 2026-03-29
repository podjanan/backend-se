const db = require("../config/db");

exports.create = async (data) => {
  const sql = `
    INSERT INTO social_links (
      camp_id, facebook, instagram, twitter,
      website, youtube, discord, tiktok
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
  `;

  const values = [
    data.camp_id,
    data.facebook || null,
    data.instagram || null,
    data.twitter || null,
    data.website || null,
    data.youtube || null,
    data.discord || null,
    data.tiktok || null,
  ];

  const result = await db.query(sql, values);
  return { id: result.rows[0].id };
};

exports.getByCampId = async (camp_id) => {
  const db = require("../config/db");
  const result = await db.query(
    `SELECT * FROM social_links WHERE camp_id = $1 LIMIT 1`,
    [camp_id]
  );
  return result.rows[0] || null;
};