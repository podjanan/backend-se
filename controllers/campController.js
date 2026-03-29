const campModel = require("../models/campModel");
const competitionModel = require("../models/competitionModel");
const socialModel = require("../models/socialModel");

exports.createCamp = async (req, res) => {
  try {
    const data = req.body;
    const poster = req.files?.poster?.[0]?.filename || null;
    const headline = req.files?.headline?.[0]?.filename || null;
    const organizer_id = req.user?.id || req.user?.userId || req.user?.user_id || null;

    const camp = {
      organizer_id,
      title: data.title,
      tagline: data.tagline,
      description: data.description,
      location: data.location,
      event_date: data.event_date,
      registration_deadline: data.registration_deadline || null,
      organizer_name: data.organizer_name,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      poster_url: poster,
      headline_image_url: headline,
      status: "pending",
      type: data.activity_types || data.type || null,
    };

    const result = await campModel.create(camp);
    const camp_id = result.id;

    if (data.camp_type === "competition") {
      await competitionModel.create({
        camp_id,
        competition_format: data.competition_format,
        registration_type: data.registration_type,
        team_size: data.team_size,
        prize: data.prize,
      });
    }

    const hasSocial = [
      data.facebook, data.instagram, data.twitter,
      data.website, data.youtube, data.discord, data.tiktok,
    ].some(Boolean);

    if (hasSocial) {
      await socialModel.create({
        camp_id,
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter,
        website: data.website,
        youtube: data.youtube,
        discord: data.discord,
        tiktok: data.tiktok,
      });
    }

    res.status(201).json({ message: "Camp created successfully", camp_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCamps = async (req, res) => {
  try {
    const camps = await campModel.getAll();
    res.status(200).json(camps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecentCamps = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const camps = await campModel.getRecent(limit);
    res.status(200).json(camps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPopularCamps = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const camps = await campModel.getPopular(limit);
    res.status(200).json(camps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCampById = async (req, res) => {
  try {
    const camp = await campModel.getById(req.params.id);
    if (!camp) return res.status(404).json({ message: "Camp not found" });
    res.status(200).json(camp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCampStats = async (req, res) => {
  try {
    const stats = await campModel.getStats();
    res.status(200).json({
      total: parseInt(stats.total),
      open: parseInt(stats.open),
      ended: parseInt(stats.ended),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCampCountByType = async (req, res) => {
  try {
    const counts = await campModel.getCountByType();
    res.status(200).json(counts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/camps/:id/close — ปิดรับสมัคร
exports.closeCamp = async (req, res) => {
  try {
    const db = require("../config/db");
    await db.query(
      `UPDATE camps SET camp_status = 'closed' WHERE id = $1`,
      [req.params.id]
    );
    res.json({ message: "ปิดรับสมัครแล้ว" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/camps/my — ค่ายของ user ที่ login อยู่
exports.getMyCamps = async (req, res) => {
  try {
    const db = require("../config/db");
    const organizer_id = req.user?.id || req.user?.userId || req.user?.user_id;
    const result = await db.query(
      `SELECT id, title, event_date, status, camp_status,
              registration_deadline, poster_url, headline_image_url, organizer_name
       FROM camps
       WHERE organizer_id = $1
       ORDER BY created_at DESC`,
      [organizer_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search
exports.searchCamps = async (req, res) => {
  try {
    const db = require("../config/db");
    const q = req.query.q || "";
    const result = await db.query(`
      SELECT id, title, tagline, location, event_date,
             registration_deadline, organizer_name,
             poster_url, headline_image_url, camp_status
      FROM camps
      WHERE status = 'approved'
        AND (title ILIKE $1 OR tagline ILIKE $1)
      ORDER BY created_at DESC
      LIMIT 20
    `, [`%${q}%`]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/camps/:id
exports.deleteCamp = async (req, res) => {
  try {
    const db = require("../config/db");
    const organizer_id = req.user?.id || req.user?.userId || req.user?.user_id;
    // ตรวจสอบว่าเป็นเจ้าของค่าย
    const check = await db.query(
      `SELECT id FROM camps WHERE id = $1 AND organizer_id = $2`,
      [req.params.id, organizer_id]
    );
    if (!check.rows[0]) return res.status(403).json({ message: "ไม่มีสิทธิ์ลบค่ายนี้" });
    await db.query(`DELETE FROM camps WHERE id = $1`, [req.params.id]);
    res.json({ message: "ลบค่ายสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/camps/:id/edit — แก้ไขค่าย แล้วเปลี่ยนสถานะกลับเป็น pending
exports.editCamp = async (req, res) => {
  try {
    const db = require("../config/db");
    const organizer_id = req.user?.id || req.user?.userId || req.user?.user_id;
    const data = req.body;
    const poster = req.files?.poster?.[0]?.filename || null;
    const headline = req.files?.headline?.[0]?.filename || null;

    const check = await db.query(
      `SELECT id FROM camps WHERE id = $1 AND organizer_id = $2`,
      [req.params.id, organizer_id]
    );
    if (!check.rows[0]) return res.status(403).json({ message: "ไม่มีสิทธิ์แก้ไขค่ายนี้" });

    await db.query(`
      UPDATE camps SET
        title = COALESCE($1, title),
        tagline = COALESCE($2, tagline),
        description = COALESCE($3, description),
        location = COALESCE($4, location),
        event_date = COALESCE($5, event_date),
        registration_deadline = COALESCE($6, registration_deadline),
        organizer_name = COALESCE($7, organizer_name),
        contact_email = COALESCE($8, contact_email),
        contact_phone = COALESCE($9, contact_phone),
        poster_url = COALESCE($10, poster_url),
        headline_image_url = COALESCE($11, headline_image_url),
        status = 'pending'
      WHERE id = $12
    `, [
      data.title || null, data.tagline || null, data.description || null,
      data.location || null, data.event_date || null, data.registration_deadline || null,
      data.organizer_name || null, data.contact_email || null, data.contact_phone || null,
      poster, headline, req.params.id
    ]);

    res.json({ message: "แก้ไขค่ายสำเร็จ รอแอดมินอนุมัติใหม่" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};