const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables as early as possible
dotenv.config({ path: "./config.env" });

let server;
let isShutdown = false;

/**
 * Graceful shutdown function
 * - Prevents multiple shutdown calls
 * - Closes HTTP server first (stops accepting new requests)
 * - Then closes DB connection
 * - Finally exits the process
 */
const shutdown = async (exitCode = 0) => {
  if (isShutdown) return; // Prevent duplicate execution
  isShutdown = true;

  console.log("Shutting down...");

  try {
    // Close HTTP server (stop accepting new connections)
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log("HTTP server closed.");
    }

    // Close MongoDB connection if it exists
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("DB connection closed.");
    }
  } catch (err) {
    console.error("Error during shutdown:", err);
    exitCode = 1;
  }

  process.exit(exitCode);
};

/**
 * Handle synchronous errors that were not caught anywhere
 * These are considered fatal and may leave the app in an unstable state
 */
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);

  // If server already started, perform graceful shutdown
  if (server) {
    shutdown(1);
  } else {
    // If app hasn't started yet, just exit immediately
    process.exit(1);
  }
});

/**
 * Handle unhandled promise rejections
 * Usually caused by missing .catch() in async code
 */
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
  shutdown(1);
});

/**
 * Handle system termination signals (e.g., from hosting provider)
 * Allows graceful shutdown instead of abrupt termination
 */
process.on("SIGTERM", () => {
  console.log("SIGTERM received.");
  shutdown(0);
});

/**
 * Handle manual termination (Ctrl + C)
 */
process.on("SIGINT", () => {
  console.log("SIGINT received.");
  shutdown(0);
});

// Import Express app after setting up process-level handlers
const app = require("./app");

// Prepare MongoDB connection string
const DB = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD,
);

/**
 * Connect to MongoDB
 * Only start the server after successful DB connection
 */
mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection successful!");

    const port = process.env.PORT || 3000;

    // Start HTTP server
    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}...`);
    });
  })
  .catch((err) => {
    // If DB connection fails, shut down the process
    console.error("DB connection error:", err);
    shutdown(1);
  });
