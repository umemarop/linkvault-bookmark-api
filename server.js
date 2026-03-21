const mongoose = require("mongoose");
const dotenv = require("dotenv");

let server;
let isShutdown = false;

const shutdown = async (exitCode = 0) => {
  if (isShutdown) return;
  isShutdown = true;

  console.log("Shutting down...");

  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log("HTTP server closed.");
    }

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

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);

  if (server) {
    shutdown(1);
  } else {
    process.exit(1);
  }
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection successful!");

    const port = process.env.PORT || 8000;

    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}...`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });

process.on("SIGTERM", () => shutdown(0));
process.on("SIGINT", () => shutdown(0));

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
  shutdown(1);
});
