const User = require("../models/User");
const Poll = require("../models/Poll");
const Petition = require("../models/Petition");
const Comment = require("../models/Comment");

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPolls = await Poll.countDocuments();
    const totalPetitions = await Petition.countDocuments();
    const totalComments = await Comment.countDocuments();

    const activePolls = await Poll.countDocuments({ status: "active" });
    const closedPolls = await Poll.countDocuments({ status: "closed" });

    const activePetitions = await Petition.countDocuments({ status: "active" });
    const underReviewPetitions = await Petition.countDocuments({
      status: "under_review"
    });
    const closedPetitions = await Petition.countDocuments({ status: "closed" });

    const totalVotesData = await Poll.aggregate([
      {
        $group: {
          _id: null,
          totalVotes: { $sum: "$totalVotes" }
        }
      }
    ]);

    const totalSignaturesData = await Petition.aggregate([
      {
        $group: {
          _id: null,
          totalSignatures: { $sum: "$currentSignatures" }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalPolls,
        totalPetitions,
        totalComments,
        activePolls,
        closedPolls,
        activePetitions,
        underReviewPetitions,
        closedPetitions,
        totalVotes: totalVotesData[0]?.totalVotes || 0,
        totalSignatures: totalSignaturesData[0]?.totalSignatures || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin stats",
      error: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

// @desc    Toggle user role
// @route   PUT /api/admin/users/:id/toggle-role
// @access  Admin
const toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role"
      });
    }

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account"
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message
    });
  }
};

// @desc    Get all content for moderation
// @route   GET /api/admin/content
// @access  Admin
const getModerationContent = async (req, res) => {
  try {
    const polls = await Poll.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const petitions = await Petition.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const comments = await Comment.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      content: {
        polls,
        petitions,
        comments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch moderation content",
      error: error.message
    });
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  toggleUserRole,
  deleteUser,
  getModerationContent
};