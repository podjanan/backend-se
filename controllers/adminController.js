const db = require("../config/db");

exports.approveCamp = async (req, res) => {
  try {
    await db.query("UPDATE camps SET status = 'approved' WHERE id = $1", [req.params.id]);
    res.json({ message: "approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectCamp = async (req, res) => {
  try {
    await db.query("UPDATE camps SET status = 'rejected' WHERE id = $1", [req.params.id]);
    res.json({ message: "rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCampsAdmin = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, title, tagline, description, organizer_name,
             contact_email, contact_phone, location, status, type,
             event_date, registration_deadline, created_at,
             poster_url, headline_image_url
      FROM camps
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, full_name, email, role, status, created_at
      FROM users
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCamp = async (req, res) => {
  try {
    await db.query("DELETE FROM camps WHERE id = $1", [req.params.id]);
    res.json({ message: "ลบค่ายสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "ลบผู้ใช้สำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await db.query("DELETE FROM review_web WHERE id = $1", [req.params.id]);
    res.json({ message: "ลบรีวิวสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};