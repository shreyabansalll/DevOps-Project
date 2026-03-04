const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      trim: true,
      default: "",
    },
    repoUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Project", projectSchema);
