const express = require("express");
const Task = require("../models/Task");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the authenticated user
 * @access  Private
 */
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tasks.",
    });
  }
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 * @access  Private
 */
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error fetching task.",
    });
  }
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post("/", async (req, res) => {
  try {
    const { name, priority } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task name is required.",
      });
    }

    const validPriorities = ["High", "Medium", "Low"];
    const taskPriority = validPriorities.includes(priority) ? priority : "Medium";

    const task = await Task.create({
      user: req.user._id,
      name: name.trim(),
      priority: taskPriority,
      completed: false,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: task,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)[0]?.message || "Validation failed",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating task.",
    });
  }
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task (including toggle complete)
 * @access  Private
 */
router.put("/:id", async (req, res) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    const { name, priority, completed } = req.body;

    if (name !== undefined) task.name = name.trim();
    if (priority !== undefined) {
      const validPriorities = ["High", "Medium", "Low"];
      if (validPriorities.includes(priority)) task.priority = priority;
    }
    if (typeof completed === "boolean") task.completed = completed;

    await task.save();

    res.json({
      success: true,
      message: "Task updated successfully.",
      data: task,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)[0]?.message || "Validation failed",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating task.",
    });
  }
});

/**
 * @route   PATCH /api/tasks/:id/toggle
 * @desc    Toggle task completion status
 * @access  Private
 */
router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    task.completed = !task.completed;
    await task.save();

    res.json({
      success: true,
      message: "Task toggled successfully.",
      data: task,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error toggling task.",
    });
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting task.",
    });
  }
});

module.exports = router;
