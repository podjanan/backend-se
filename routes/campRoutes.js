const express = require("express");
const router = express.Router();
const campController = require("../controllers/campController");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/authMiddleware");

// Public routes — string คงที่ต้องอยู่ก่อน /:id เสมอ
router.get("/stats",         campController.getCampStats);
router.get("/count-by-type", campController.getCampCountByType);
router.get("/recent",        campController.getRecentCamps);
router.get("/popular",       campController.getPopularCamps);
router.get("/search",        campController.searchCamps);
router.get("/my",            auth, campController.getMyCamps);
router.get("/",              campController.getAllCamps);
router.get("/:id",           campController.getCampById);

// Protected routes
router.post(
  "/",
  auth,
  upload.fields([
    { name: "poster",   maxCount: 1 },
    { name: "headline", maxCount: 1 },
  ]),
  campController.createCamp
);

router.put("/:id/close", auth, campController.closeCamp);
router.put("/:id/edit",  auth, upload.fields([{ name: "poster", maxCount: 1 }, { name: "headline", maxCount: 1 }]), campController.editCamp);
router.delete("/:id",    auth, campController.deleteCamp);

module.exports = router;