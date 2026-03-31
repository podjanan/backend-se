const campModel = require("../models/campModel");
const competitionModel = require("../models/competitionModel");
const socialModel = require("../models/socialModel");

exports.createCamp = async (req, res) => {
  try {
    const data = req.body;
    const poster = req.files?.poster?.[0]?.filename || null;
    const headline = req.files?.headline?.[0]?.filename || null;
    const organizer_id = req.user?.id || req.user?.userId || req.user?.user_id || null;

    console.log("📥 req.body:", data);
    console.log("📁 req.files:", req.files);
    console.log("👤 organizer_id:", organizer_id);

    const camp = {
      organizer_id,
      title: data.title,
      tagline: data.tagline,
      description: data.description,
      location: data.location,
      event_date: data.event_date,
      registration_deadline: data.registration_deadline || null,
      organizer_name: data.organizer_name,
      contact_name: data.contact_name || data.organizer_name || null,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      poster_url: poster,
      headline_image_url: headline,
      status: "pending",
      type: data.type || null,
      category: data.category || null,
      event_format: data.event_format || null,
      max_participants: data.max_participants || null,
      price: data.price || null,
      price_type: data.price_type || null,
      eligibility: data.eligibility || null,
      application_link: data.application_link || null,
    };

    console.log("🏕️ camp object to insert:", camp);

    const result = await campModel.create(camp);
    const camp_id = result.id;

    console.log("✅ camp created, id:", camp_id);

    if (data.type === "competition") {
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
    console.error("❌ ERROR OBJECT:", err);
    console.error("❌ ERROR MESSAGE:", err?.message);
    console.error("❌ ERROR STACK:", err?.stack);
    res.status(500).json({ message: err?.message ?? JSON.stringify(err) });
  }
};

exports.getAllCamps = async (req, res) => {
  try {
    const camps = await campModel.getAll();
    res.status(200).json(camps);
  } catch (err) {
    console.error("❌ getAllCamps:", err?.message);
    res.status(500).json({ message: err?.message ?? JSON.stringify(err) });
  }
};

exports.getRecentCamps = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const camps = await campModel.getRecent(limit);
    res.status(200).json(camps);
  } catch (err) {
    console.error("❌ getRecentCamps:", err?.message);
    res.status(500).json({ message: err?.message ?? JSON.stringify(err) });
  }
};

exports.getPopularCamps = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const camps = await campModel.getPopular(limit);
    res.status(200).json(camps);
  } catch (err) {
    console.error("❌ getPopularCamps:", err?.message);
    res.status(500).json({ message: err?.message ?? JSON.stringify(err) });
  }
};

exports.getCampById = async (req, res) => {
  try {
    const camp = await campModel.getById(req.params.id);
    if (!camp) return res.status(404).json({ message: "Camp not found" });
    res.status(200).json(camp);
  } catch (err) {
    console.error("❌ getCampById:", err?.message);
    res.status(500).json({ message: err?.message ?? JSON.stringify(err) });
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
    console.error("❌ getCampStats:", err?.message);
    res.status(500).json({ message: err?.message ?? JSON.stringify(err) });
  }
};

exports.getCampCountByType = async (req, res) => {
  try {
    const counts = await campModel.getCountByType();
    res.status(200).json(counts);
  } catch (err) {
    console.error("❌ getCampCountByType:", err?.message);
    res.status(500).json({ message: err?.message ?? JSON.stringify(err) });
  }
};

exports.closeCamp = async (req, res) => {
  try {
    const db = require("../config/db");
    await db.query(`UPDATE camps SET camp_status = 'closed' WHERE id = $1`, [req.params.id]);
    res.json({ message: "ปิดรับสมัครแล้ว" });
  } catch (err) {
    console.error("❌ closeCamp:", err?.message);
    res.status(500).json({ message: err?.message ?? JSON.stringify(err) });
  }
};

exports.getMyCamps = async (req, res) => {
  try {
    const db = require("../config/db");
    const organizer_id = req.user?.id || req.user?.userId || req.user?.user_id;
    const result = await db.query(
      `SELECT id, title, tagline, description, location,
              event_date, registration_deadline, status, camp_status,
              poster_url, headline_image_url, organizer_name,
              contact_email, contact_phone
       FROM camps WHERE organizer_id = $1 ORDER BY created_at DESC`,
      [organizer_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ getMyCamps:", err?.message);
    res.status(500).json({ message: err?.message ?? JSON.stringify(err) });
  }
};

exports.searchCamps = async (req, res) => {
  try {
    const db = require("../config/db");
    const q = req.query.q || "";
    const result = await db.query(`
      SELECT id, title, tagline, poster_url, headline_image_url
      FROM camps
      WHERE status = 'approved'
        AND (title ILIKE $1 OR tagline ILIKE $1)
      ORDER BY created_at DESC LIMIT 6
    `, [`%${q}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ searchCamps:", err?.message);
    res.status(500).json({ message: err?.message ?? JSON.stringify(err) });
  }
};

exports.deleteCamp = async (req, res) => {
  try {
    const db = require("../config/db");
    const organizer_id = req.user?.id || req.user?.userId || req.user?.user_id;
    const check = await db.query(
      `SELECT id FROM camps WHERE id = $1 AND organizer_id = $2`,
      [req.params.id, organizer_id]
    );
    if (!check.rows[0]) return res.status(403).json({ message: "ไม่มีสิทธิ์ลบค่ายนี้" });
    await db.query(`DELETE FROM camps WHERE id = $1`, [req.params.id]);
    res.json({ message: "ลบค่ายสำเร็จ" });
  } catch (err) {
    console.error("❌ deleteCamp:", err?.message);
    res.status(500).json({ message: err?.message ?? JSON.stringify(err) });
  }
};

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
        contact_name = COALESCE($8, contact_name),
        contact_email = COALESCE($9, contact_email),
        contact_phone = COALESCE($10, contact_phone),
        poster_url = COALESCE($11, poster_url),
        headline_image_url = COALESCE($12, headline_image_url),
        category = COALESCE($13, category),
        event_format = COALESCE($14, event_format),
        max_participants = COALESCE($15, max_participants),
        price = COALESCE($16, price),
        price_type = COALESCE($17, price_type),
        eligibility = COALESCE($18, eligibility),
        status = 'pending'
      WHERE id = $19
    `, [
      data.title || null,
      data.tagline || null,
      data.description || null,
      data.location || null,
      data.event_date || null,
      data.registration_deadline || null,
      data.organizer_name || null,
      data.contact_name || data.organizer_name || null,
      data.contact_email || null,
      data.contact_phone || null,
      poster,
      headline,
      data.category || null,
      data.event_format || null,
      data.max_participants || null,
      data.price || null,
      data.price_type || null,
      data.eligibility || null,
      req.params.id,
    ]);

    res.json({ message: "แก้ไขค่ายสำเร็จ รอแอดมินอนุมัติใหม่" });
  } catch (err) {
    console.error("❌ editCamp:", err?.message);
    res.status(500).json({ message: err?.message ?? JSON.stringify(err) });
  }
};