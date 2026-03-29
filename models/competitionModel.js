const db = require("../config/db");

exports.create = async (data) => {
  const sql = `
    INSERT INTO competitions (
      camp_id,
      competition_format,
      registration_type,
      team_size,
      prize
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;

  const values = [
    data.camp_id,
    data.competition_format,
    data.registration_type,
    data.team_size,
    data.prize,
  ];

  const result = await db.query(sql, values);
  return { id: result.rows[0].id };
};