const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/userController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/:id", auth, ctrl.getUser);
router.put("/:id", auth, upload.single("avatar"), ctrl.updateUser);
router.put("/:id/change-password", auth, ctrl.changePassword);

module.exports = router;