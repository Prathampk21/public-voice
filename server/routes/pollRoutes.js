const express = require("express");

const {
  createPoll,
  getPolls,
  getPollById,
  votePoll,
  updatePoll,
  deletePoll
} = require("../controllers/pollController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
  .get(getPolls)
  .post(protect, createPoll);

router.route("/:id")
  .get(getPollById)
  .put(protect, updatePoll)
  .delete(protect, deletePoll);

router.post("/:id/vote", protect, votePoll);

module.exports = router;