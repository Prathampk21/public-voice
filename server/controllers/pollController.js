const Poll = require("../models/Poll");
const User = require("../models/User");

// @desc    Create poll
// @route   POST /api/polls
// @access  Private
const createPoll = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      options,
      city,
      state,
      country,
      expiresAt,
      isPublic
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Poll title is required"
      });
    }

    if (!options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least two poll options are required"
      });
    }

    const formattedOptions = options.map((option) => ({
      text: typeof option === "string" ? option : option.text
    }));

    const poll = await Poll.create({
      title,
      description: description || "",
      category: category || "General",
      options: formattedOptions,
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
        "activityCount.pollsCreated": 1
      }
    });

    res.status(201).json({
      success: true,
      message: "Poll created successfully",
      poll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create poll",
      error: error.message
    });
  }
};

// @desc    Get all polls
// @route   GET /api/polls
// @access  Public
const getPolls = async (req, res) => {
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

    const polls = await Poll.find(filter)
      .populate("createdBy", "name email location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: polls.length,
      polls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch polls",
      error: error.message
    });
  }
};

// @desc    Get single poll
// @route   GET /api/polls/:id
// @access  Public
const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate(
      "createdBy",
      "name email location"
    );

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found"
      });
    }

    res.status(200).json({
      success: true,
      poll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch poll",
      error: error.message
    });
  }
};

// @desc    Vote on poll
// @route   POST /api/polls/:id/vote
// @access  Private
const votePoll = async (req, res) => {
  try {
    const { optionId } = req.body;

    if (!optionId) {
      return res.status(400).json({
        success: false,
        message: "Option ID is required"
      });
    }

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found"
      });
    }

    if (poll.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "This poll is closed"
      });
    }

    if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
      poll.status = "closed";
      await poll.save();

      return res.status(400).json({
        success: false,
        message: "This poll has expired"
      });
    }

    const alreadyVoted = poll.options.some((option) =>
      option.voters.some(
        (voterId) => voterId.toString() === req.user._id.toString()
      )
    );

    if (alreadyVoted) {
      return res.status(400).json({
        success: false,
        message: "You have already voted on this poll"
      });
    }

    const selectedOption = poll.options.id(optionId);

    if (!selectedOption) {
      return res.status(404).json({
        success: false,
        message: "Poll option not found"
      });
    }

    selectedOption.votes += 1;
    selectedOption.voters.push(req.user._id);
    poll.totalVotes += 1;

    await poll.save();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        "activityCount.votesGiven": 1
      }
    });

    const io = req.app.get("io");

    if (io) {
      io.emit("pollUpdated", {
        pollId: poll._id,
        totalVotes: poll.totalVotes,
        options: poll.options
      });
    }

    res.status(200).json({
      success: true,
      message: "Vote submitted successfully",
      poll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit vote",
      error: error.message
    });
  }
};

// @desc    Update poll
// @route   PUT /api/polls/:id
// @access  Private
const updatePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found"
      });
    }

    if (
      poll.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this poll"
      });
    }

    const {
      title,
      description,
      category,
      city,
      state,
      country,
      expiresAt,
      status,
      isPublic
    } = req.body;

    poll.title = title || poll.title;
    poll.description = description !== undefined ? description : poll.description;
    poll.category = category || poll.category;

    poll.targetLocation.city =
      city !== undefined ? city : poll.targetLocation.city;

    poll.targetLocation.state =
      state !== undefined ? state : poll.targetLocation.state;

    poll.targetLocation.country =
      country !== undefined ? country : poll.targetLocation.country;

    poll.expiresAt = expiresAt !== undefined ? expiresAt : poll.expiresAt;
    poll.status = status || poll.status;
    poll.isPublic = isPublic !== undefined ? isPublic : poll.isPublic;

    const updatedPoll = await poll.save();

    res.status(200).json({
      success: true,
      message: "Poll updated successfully",
      poll: updatedPoll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update poll",
      error: error.message
    });
  }
};

// @desc    Delete poll
// @route   DELETE /api/polls/:id
// @access  Private
const deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found"
      });
    }

    if (
      poll.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this poll"
      });
    }

    await Poll.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Poll deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete poll",
      error: error.message
    });
  }
};

module.exports = {
  createPoll,
  getPolls,
  getPollById,
  votePoll,
  updatePoll,
  deletePoll
};