const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Task name is required"],
      trim: true,
      maxlength: [200, "Task name cannot exceed 200 characters"],
    },
    priority: {
      type: String,
      enum: {
        values: ["High", "Medium", "Low"],
        message: "Priority must be High, Medium, or Low",
      },
      default: "Medium",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Task", taskSchema);
