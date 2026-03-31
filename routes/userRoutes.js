const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/userController");

// ✅ ใช้ upload middleware ที่มีอยู่แล้ว
const upload = require("../middlewares/upload");

// routes
router.get("/:id", auth, ctrl.getUser);

// ✅ upload avatar ไป Supabase (มี file.buffer แน่นอน)
router.put("/:id", auth, upload.single("avatar"), ctrl.updateUser);

router.put("/:id/change-password", auth, ctrl.changePassword);

module.exports = router;