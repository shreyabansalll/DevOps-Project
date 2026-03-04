require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Ensure required environment variables are available before proceeding
if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
  console.error(
    "FATAL: MONGO_URI is not defined. Please set MONGO_URI in your .env or environment."
  );
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// Route imports
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FlowBalance API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      projects: "/api/projects",
      tasks: "/api/tasks",
      expenses: "/api/expenses",
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/expenses", expenseRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Server error" : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API base URL: http://localhost:${PORT}/api`);
});
