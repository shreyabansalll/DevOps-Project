const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Expense name is required"],
      trim: true,
      maxlength: [100, "Expense name cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      enum: {
        values: ["Food", "Bills", "Shopping", "Travel", "Miscellaneous"],
        message: "Invalid category",
      },
      required: [true, "Category is required"],
    },
  },
  {
    timestamps: true,
  }
);

expenseSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Expense", expenseSchema);
