const mongoose = require("mongoose");

const pollOptionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },

    votes: {
      type: Number,
      default: 0
    },

    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Poll title is required"],
      trim: true
    },

    description: {
      type: String,
      default: "",
      trim: true
    },

    category: {
      type: String,
      default: "General",
      trim: true
    },

    options: {
      type: [pollOptionSchema],
      validate: {
        validator: function (value) {
          return value.length >= 2;
        },
        message: "At least two options are required"
      }
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    targetLocation: {
      city: {
        type: String,
        default: ""
      },
      state: {
        type: String,
        default: ""
      },
      country: {
        type: String,
        default: "India"
      }
    },

    expiresAt: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active"
    },

    isPublic: {
      type: Boolean,
      default: true
    },

    totalVotes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Poll", pollSchema);