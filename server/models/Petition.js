const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true
    },

    comment: {
      type: String,
      default: "",
      trim: true
    },

    location: {
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

    signedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const petitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Petition title is required"],
      trim: true
    },

    description: {
      type: String,
      required: [true, "Petition description is required"],
      trim: true
    },

    category: {
      type: String,
      default: "General",
      trim: true
    },

    goal: {
      type: Number,
      required: [true, "Petition goal is required"],
      default: 100
    },

    currentSignatures: {
      type: Number,
      default: 0
    },

    signatures: [signatureSchema],

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

    status: {
      type: String,
      enum: ["active", "under_review", "closed"],
      default: "active"
    },

    isPublic: {
      type: Boolean,
      default: true
    },

    expiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Petition", petitionSchema);