const express = require("express");
const Expense = require("../models/Expense");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses for the authenticated user
 * @access  Private
 */
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      success: true,
      count: expenses.length,
      total,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching expenses.",
    });
  }
});

/**
 * @route   GET /api/expenses/summary
 * @desc    Get expense summary (by month, by category)
 * @access  Private
 */
router.get("/summary", async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = month ? parseInt(month, 10) : now.getMonth() + 1;
    const targetYear = year ? parseInt(year, 10) : now.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: req.user._id,
      createdAt: { $gte: startDate, $lte: endDate },
    }).lean();

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        total,
        count: expenses.length,
        byCategory,
        month: targetMonth,
        year: targetYear,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching expense summary.",
    });
  }
});

/**
 * @route   GET /api/expenses/:id
 * @desc    Get a single expense by ID
 * @access  Private
 */
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    res.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error fetching expense.",
    });
  }
});

/**
 * @route   POST /api/expenses
 * @desc    Create a new expense
 * @access  Private
 */
router.post("/", async (req, res) => {
  try {
    const { name, amount, category } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Expense name is required.",
      });
    }

    if (amount === undefined || amount === null || isNaN(parseFloat(amount))) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required.",
      });
    }

    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0.",
      });
    }

    const validCategories = ["Food", "Bills", "Shopping", "Travel", "Miscellaneous"];
    const expenseCategory = validCategories.includes(category) ? category : "Miscellaneous";

    const expense = await Expense.create({
      user: req.user._id,
      name: name.trim(),
      amount: numAmount,
      category: expenseCategory,
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully.",
      data: expense,
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
      message: "Error creating expense.",
    });
  }
});

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update an expense
 * @access  Private
 */
router.put("/:id", async (req, res) => {
  try {
    let expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    const { name, amount, category } = req.body;

    if (name !== undefined) expense.name = name.trim();
    if (amount !== undefined) {
      const numAmount = parseFloat(amount);
      if (numAmount > 0) expense.amount = numAmount;
    }
    if (category !== undefined) {
      const validCategories = ["Food", "Bills", "Shopping", "Travel", "Miscellaneous"];
      if (validCategories.includes(category)) expense.category = category;
    }

    await expense.save();

    res.json({
      success: true,
      message: "Expense updated successfully.",
      data: expense,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
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
      message: "Error updating expense.",
    });
  }
});

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete an expense
 * @access  Private
 */
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    res.json({
      success: true,
      message: "Expense deleted successfully.",
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting expense.",
    });
  }
});

module.exports = router;
