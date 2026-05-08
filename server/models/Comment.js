const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ["poll", "petition"],
      required: true
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true
    },

    stance: {
      type: String,
      enum: ["neutral", "pro", "against"],
      default: "neutral"
    },

    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    upvoteCount: {
      type: Number,
      default: 0
    },

    isHidden: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Comment", commentSchema);