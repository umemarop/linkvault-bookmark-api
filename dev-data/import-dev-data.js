const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bookmark = require("../models/bookmarkModel");

dotenv.config({ path: "./config.env" });

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

// Read JSON file
const bookmarks = JSON.parse(
  fs.readFileSync(`${__dirname}/bookmarks.json`, "utf-8"),
);

// Import data into DB
const importData = async () => {
  try {
    await Bookmark.create(bookmarks);
    console.log("data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Bookmark.deleteMany();
    console.log("data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
