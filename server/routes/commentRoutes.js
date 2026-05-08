const express = require("express");

const {
  createComment,
  getComments,
  upvoteComment,
  deleteComment,
  toggleHideComment
} = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getComments)
  .post(protect, createComment);

router.post("/:id/upvote", protect, upvoteComment);

router.delete("/:id", protect, deleteComment);

router.put("/:id/toggle-hide", protect, adminOnly, toggleHideComment);

module.exports = router;