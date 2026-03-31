const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * อัปโหลดไฟล์ขึ้น Supabase Storage แล้วคืน public URL
 * @param {Express.Multer.File} file - ไฟล์จาก multer (ต้องใช้ memoryStorage)
 * @param {string} folder - โฟลเดอร์ใน bucket เช่น "camps/posters", "avatars"
 * @returns {Promise<string>} public URL
 */
async function uploadToSupabase(file, folder = "camps") {
  if (!file || !file.buffer) {
    throw new Error("ไม่พบ file.buffer — ตรวจสอบว่า multer ใช้ memoryStorage()");
  }

  const ext = file.originalname.split(".").pop();
  const filename = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("camps") // ชื่อ bucket ใน Supabase
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw new Error(`Supabase upload error: ${error.message}`);

  const { data } = supabase.storage.from("camps").getPublicUrl(filename);
  return data.publicUrl;
}

module.exports = { supabase, uploadToSupabase };