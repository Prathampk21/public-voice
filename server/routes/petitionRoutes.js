const express = require("express");

const {
  createPetition,
  getPetitions,
  getPetitionById,
  signPetition,
  updatePetition,
  deletePetition
} = require("../controllers/petitionController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getPetitions)
  .post(protect, createPetition);

router
  .route("/:id")
  .get(getPetitionById)
  .put(protect, updatePetition)
  .delete(protect, deletePetition);

router.post("/:id/sign", protect, signPetition);

module.exports = router;