const express = require("express");
const Project = require("../models/Project");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/projects
 * @desc    Get all projects for the authenticated user
 * @access  Private
 */
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching projects.",
    });
  }
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get a single project by ID
 * @access  Private
 */
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error fetching project.",
    });
  }
});

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post("/", async (req, res) => {
  try {
    const { title, description, tags, liveUrl, repoUrl } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
    }

    const project = await Project.create({
      user: req.user._id,
      title: title.trim(),
      description: description.trim(),
      tags: Array.isArray(tags) ? tags : tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      liveUrl: liveUrl?.trim() || "",
      repoUrl: repoUrl?.trim() || "",
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: project,
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
      message: "Error creating project.",
    });
  }
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project
 * @access  Private
 */
router.put("/:id", async (req, res) => {
  try {
    let project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const { title, description, tags, liveUrl, repoUrl } = req.body;

    if (title !== undefined) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();
    if (tags !== undefined) {
      project.tags = Array.isArray(tags) ? tags : tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    }
    if (liveUrl !== undefined) project.liveUrl = liveUrl?.trim() || "";
    if (repoUrl !== undefined) project.repoUrl = repoUrl?.trim() || "";

    await project.save();

    res.json({
      success: true,
      message: "Project updated successfully.",
      data: project,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
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
      message: "Error updating project.",
    });
  }
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Private
 */
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    res.json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting project.",
    });
  }
});

module.exports = router;
