const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bookmark = require("../models/bookmarkModel");

// Load environment variables
dotenv.config({ path: "./config.env" });

// Connect to MongoDB
const DB = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection successful!");
  });

// Read seed data from JSON file
const bookmarks = JSON.parse(
  fs.readFileSync(`${__dirname}/bookmarks.json`, "utf-8"),
);

// Import data into database
const importData = async () => {
  try {
    await Bookmark.create(bookmarks);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

// Delete all data from database
const deleteData = async () => {
  try {
    await Bookmark.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

// Run script based on CLI argument
// Usage:
// node dev-data/data/import-dev-data.js --import
// node dev-data/data/import-dev-data.js --delete
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
