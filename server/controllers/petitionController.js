const Petition = require("../models/Petition");
const User = require("../models/User");

// @desc    Create petition
// @route   POST /api/petitions
// @access  Private
const createPetition = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      goal,
      city,
      state,
      country,
      expiresAt,
      isPublic
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required"
      });
    }

    if (!goal || Number(goal) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid petition goal is required"
      });
    }

    const petition = await Petition.create({
      title,
      description,
      category: category || "General",
      goal: Number(goal),
      createdBy: req.user._id,
      targetLocation: {
        city: city || "",
        state: state || "",
        country: country || "India"
      },
      expiresAt: expiresAt || null,
      isPublic: isPublic !== undefined ? isPublic : true
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        "activityCount.petitionsCreated": 1
      }
    });

    res.status(201).json({
      success: true,
      message: "Petition created successfully",
      petition
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create petition",
      error: error.message
    });
  }
};

// @desc    Get all petitions
// @route   GET /api/petitions
// @access  Public
const getPetitions = async (req, res) => {
  try {
    const { category, city, state, status } = req.query;

    const filter = {
      isPublic: true
    };

    if (category) {
      filter.category = category;
    }

    if (city) {
      filter["targetLocation.city"] = city;
    }

    if (state) {
      filter["targetLocation.state"] = state;
    }

    if (status) {
      filter.status = status;
    }

    const petitions = await Petition.find(filter)
      .populate("createdBy", "name email location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: petitions.length,
      petitions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch petitions",
      error: error.message
    });
  }
};

// @desc    Get single petition
// @route   GET /api/petitions/:id
// @access  Public
const getPetitionById = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id)
      .populate("createdBy", "name email location")
      .populate("signatures.user", "name email location");

    if (!petition) {
      return res.status(404).json({
        success: false,
        message: "Petition not found"
      });
    }

    res.status(200).json({
      success: true,
      petition
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch petition",
      error: error.message
    });
  }
};

// @desc    Sign petition
// @route   POST /api/petitions/:id/sign
// @access  Private
const signPetition = async (req, res) => {
  try {
    const { comment, city, state, country } = req.body;

    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      return res.status(404).json({
        success: false,
        message: "Petition not found"
      });
    }

    if (petition.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This petition is not active"
      });
    }

    if (petition.expiresAt && new Date(petition.expiresAt) < new Date()) {
      petition.status = "closed";
      await petition.save();

      return res.status(400).json({
        success: false,
        message: "This petition has expired"
      });
    }

    const alreadySigned = petition.signatures.some(
      (signature) => signature.user.toString() === req.user._id.toString()
    );

    if (alreadySigned) {
      return res.status(400).json({
        success: false,
        message: "You have already signed this petition"
      });
    }

    petition.signatures.push({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      comment: comment || "",
      location: {
        city: city || req.user.location?.city || "",
        state: state || req.user.location?.state || "",
        country: country || req.user.location?.country || "India"
      }
    });

    petition.currentSignatures += 1;

    if (petition.currentSignatures >= petition.goal) {
      petition.status = "under_review";
    }

    await petition.save();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        "activityCount.petitionsSigned": 1
      }
    });

    const io = req.app.get("io");

    if (io) {
      io.emit("petitionUpdated", {
        petitionId: petition._id,
        currentSignatures: petition.currentSignatures,
        goal: petition.goal,
        status: petition.status
      });
    }

    res.status(200).json({
      success: true,
      message: "Petition signed successfully",
      petition
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to sign petition",
      error: error.message
    });
  }
};

// @desc    Update petition
// @route   PUT /api/petitions/:id
// @access  Private
const updatePetition = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      return res.status(404).json({
        success: false,
        message: "Petition not found"
      });
    }

    if (
      petition.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this petition"
      });
    }

    const {
      title,
      description,
      category,
      goal,
      city,
      state,
      country,
      status,
      expiresAt,
      isPublic
    } = req.body;

    petition.title = title || petition.title;
    petition.description =
      description !== undefined ? description : petition.description;
    petition.category = category || petition.category;

    if (goal !== undefined) {
      petition.goal = Number(goal);
    }

    petition.targetLocation.city =
      city !== undefined ? city : petition.targetLocation.city;

    petition.targetLocation.state =
      state !== undefined ? state : petition.targetLocation.state;

    petition.targetLocation.country =
      country !== undefined ? country : petition.targetLocation.country;

    petition.status = status || petition.status;
    petition.expiresAt =
      expiresAt !== undefined ? expiresAt : petition.expiresAt;
    petition.isPublic =
      isPublic !== undefined ? isPublic : petition.isPublic;

    const updatedPetition = await petition.save();

    res.status(200).json({
      success: true,
      message: "Petition updated successfully",
      petition: updatedPetition
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update petition",
      error: error.message
    });
  }
};

// @desc    Delete petition
// @route   DELETE /api/petitions/:id
// @access  Private
const deletePetition = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      return res.status(404).json({
        success: false,
        message: "Petition not found"
      });
    }

    if (
      petition.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this petition"
      });
    }

    await Petition.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Petition deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete petition",
      error: error.message
    });
  }
};

module.exports = {
  createPetition,
  getPetitions,
  getPetitionById,
  signPetition,
  updatePetition,
  deletePetition
};