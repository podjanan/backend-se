const db = require("../config/db");

exports.create = async (camp) => {
  const sql = `
    INSERT INTO camps (
      organizer_id, title, tagline, description, location,
      event_date, registration_deadline, organizer_name,
      contact_name, contact_email, contact_phone,
      poster_url, headline_image_url, status,
      type, category, event_format,
      max_participants, price, price_type,
      eligibility, application_link
    )
    VALUES (
      $1,$2,$3,$4,$5,
      $6,$7,$8,
      $9,$10,$11,
      $12,$13,$14,
      $15,$16,$17,
      $18,$19,$20,
      $21,$22
    )
    RETURNING id
  `;
  const values = [
    camp.organizer_id,
    camp.title,
    camp.tagline,
    camp.description,
    camp.location,
    camp.event_date,
    camp.registration_deadline || null,
    camp.organizer_name,
    camp.contact_name || camp.organizer_name || null,   // ✅ เพิ่ม
    camp.contact_email,
    camp.contact_phone,
    camp.poster_url,
    camp.headline_image_url,
    camp.status,
    camp.type || null,
    camp.category || null,                              // ✅ เพิ่ม
    camp.event_format || null,                          // ✅ เพิ่ม
    camp.max_participants || null,                      // ✅ เพิ่ม
    camp.price || null,                                 // ✅ เพิ่ม
    camp.price_type || null,                            // ✅ เพิ่ม
    camp.eligibility || null,                           // ✅ เพิ่ม
    camp.application_link || null,
  ];
  const result = await db.query(sql, values);
  return { id: result.rows[0].id };
};

exports.getAll = async () => {
  const result = await db.query(`
    SELECT id, title, tagline, location, event_date, registration_deadline,
           organizer_name, poster_url, headline_image_url,
           status, type, camp_status, created_at
    FROM camps
    WHERE status = 'approved'
    ORDER BY created_at DESC
  `);
  return result.rows;
};

exports.getRecent = async (limit = 4) => {
  const result = await db.query(`
    SELECT c.id, c.title, c.tagline, c.location,
           c.event_date, c.registration_deadline, c.organizer_name,
           c.poster_url, c.headline_image_url,
           c.status, c.camp_status, c.created_at,
           ROUND(AVG(r.rating)::numeric, 1) AS avg_rating,
           COUNT(r.id) AS review_count
    FROM camps c
    LEFT JOIN reviews r ON r.camp_id = c.id
    WHERE c.status = 'approved'
    GROUP BY c.id
    ORDER BY c.created_at DESC
    LIMIT $1
  `, [limit]);
  return result.rows;
};

exports.getPopular = async (limit = 5) => {
  const result = await db.query(`
    SELECT c.id, c.title, c.tagline, c.location,
           c.event_date, c.registration_deadline, c.organizer_name,
           c.poster_url, c.headline_image_url,
           c.status, c.created_at,
           ROUND(AVG(r.rating)::numeric, 1) AS avg_rating,
           COUNT(r.id) AS review_count
    FROM camps c
    LEFT JOIN reviews r ON r.camp_id = c.id
    WHERE c.status = 'approved'
    GROUP BY c.id
    ORDER BY COUNT(r.id) DESC, c.created_at ASC
    LIMIT $1
  `, [limit]);
  return result.rows;
};

exports.getById = async (id) => {
  const result = await db.query(`
    SELECT c.*, co.prize AS prizes, c.application_link
    FROM camps c
    LEFT JOIN competitions co ON co.camp_id = c.id
    WHERE c.id = $1
  `, [id]);
  return result.rows[0] || null;
};

exports.getStats = async () => {
  const result = await db.query(`
    SELECT
      COUNT(*) FILTER (WHERE status = 'approved') AS total,
      COUNT(*) FILTER (WHERE status = 'approved' AND event_date >= NOW()) AS open,
      COUNT(*) FILTER (WHERE status = 'approved' AND event_date < NOW()) AS ended
    FROM camps
  `);
  return result.rows[0];
};

exports.getCountByType = async () => {
  const result = await db.query(`
    SELECT type, COUNT(*) AS count
    FROM camps
    WHERE status = 'approved' AND type IS NOT NULL
    GROUP BY type
  `);
  const map = {};
  result.rows.forEach((r) => { map[r.type] = parseInt(r.count); });
  return map;
};