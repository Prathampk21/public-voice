const express = require("express");

const {
  getAdminStats,
  getUsers,
  toggleUserRole,
  deleteUser,
  getModerationContent
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/stats", protect, adminOnly, getAdminStats);

router.get("/users", protect, adminOnly, getUsers);

router.put("/users/:id/toggle-role", protect, adminOnly, toggleUserRole);

router.delete("/users/:id", protect, adminOnly, deleteUser);

router.get("/content", protect, adminOnly, getModerationContent);

module.exports = router;