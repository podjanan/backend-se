const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { uploadToSupabase } = require("../config/supabase");

exports.getUser = async (req, res) => {
  try {
    const user = await userModel.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { full_name } = req.body;

    // ── อัปโหลด avatar ขึ้น Supabase ────────────────────────────────────────
    let avatar_url = null;
    if (req.file) {
      avatar_url = await uploadToSupabase(req.file, "avatars");
    }

    const updated = await userModel.updateProfile(req.params.id, { full_name, avatar_url });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: "กรอกข้อมูลให้ครบ" });

    const user = await userModel.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: "รหัสผ่านเดิมไม่ถูกต้อง" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await userModel.updatePassword(user.email, hashed);
    res.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};