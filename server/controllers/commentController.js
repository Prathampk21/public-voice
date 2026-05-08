const Comment = require("../models/Comment");
const Poll = require("../models/Poll");
const Petition = require("../models/Petition");

const checkTargetExists = async (targetType, targetId) => {
  if (targetType === "poll") {
    return await Poll.findById(targetId);
  }

  if (targetType === "petition") {
    return await Petition.findById(targetId);
  }

  return null;
};

// @desc    Create comment
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const { targetType, targetId, text, stance } = req.body;

    if (!targetType || !targetId || !text) {
      return res.status(400).json({
        success: false,
        message: "targetType, targetId and text are required"
      });
    }

    if (!["poll", "petition"].includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: "targetType must be poll or petition"
      });
    }

    const target = await checkTargetExists(targetType, targetId);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "Target poll or petition not found"
      });
    }

    const comment = await Comment.create({
      targetType,
      targetId,
      user: req.user._id,
      text,
      stance: stance || "neutral"
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "name email location"
    );

    const io = req.app.get("io");

    if (io) {
      io.emit("commentCreated", {
        targetType,
        targetId,
        comment: populatedComment
      });
    }

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: error.message
    });
  }
};

// @desc    Get comments by target
// @route   GET /api/comments?targetType=poll&targetId=ID
// @access  Public
const getComments = async (req, res) => {
  try {
    const { targetType, targetId } = req.query;

    if (!targetType || !targetId) {
      return res.status(400).json({
        success: false,
        message: "targetType and targetId are required"
      });
    }

    const comments = await Comment.find({
      targetType,
      targetId,
      isHidden: false
    })
      .populate("user", "name email location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message
    });
  }
};

// @desc    Upvote comment
// @route   POST /api/comments/:id/upvote
// @access  Private
const upvoteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    const alreadyUpvoted = comment.upvotes.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (alreadyUpvoted) {
      comment.upvotes = comment.upvotes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
      comment.upvoteCount = Math.max(0, comment.upvoteCount - 1);
    } else {
      comment.upvotes.push(req.user._id);
      comment.upvoteCount += 1;
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: alreadyUpvoted ? "Comment upvote removed" : "Comment upvoted",
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upvote comment",
      error: error.message
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment"
      });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      error: error.message
    });
  }
};

// @desc    Admin hide/unhide comment
// @route   PUT /api/comments/:id/toggle-hide
// @access  Admin
const toggleHideComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    comment.isHidden = !comment.isHidden;
    await comment.save();

    res.status(200).json({
      success: true,
      message: comment.isHidden
        ? "Comment hidden successfully"
        : "Comment visible successfully",
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update comment visibility",
      error: error.message
    });
  }
};

module.exports = {
  createComment,
  getComments,
  upvoteComment,
  deleteComment,
  toggleHideComment
};