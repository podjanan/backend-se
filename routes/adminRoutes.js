const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/authMiddleware");

router.get("/camps",                  auth, adminController.getAllCampsAdmin);
router.get("/users",                  auth, adminController.getAllUsers);
router.put("/approve/:id",            auth, adminController.approveCamp);
router.put("/reject/:id",             auth, adminController.rejectCamp);
router.put("/users/:id/status",       auth, adminController.updateUserStatus);
router.delete("/camps/:id",           auth, adminController.deleteCamp);
router.delete("/users/:id",           auth, adminController.deleteUser);
router.delete("/reviews/:id",         auth, adminController.deleteReview);

module.exports = router;