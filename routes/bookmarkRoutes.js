const express = require("express");
const bookmarkController = require("../controllers/bookmarkController");
const { checkEmptyBody } = require("../middlewares/validateRequest");

const router = express.Router();

/**
 * Bookmark collection routes
 * Handles operations for multiple bookmarks
 * - POST   /      → create a new bookmark
 * - GET    /      → retrieve all bookmarks (with query features)
 */
router
  .route("/")
  .post(checkEmptyBody, bookmarkController.createBookmark)
  .get(bookmarkController.getAllBookmarks);

/**
 * Single bookmark routes
 * Handles operations for a specific bookmark by ID
 * - GET    /:id   → retrieve a single bookmark
 * - PATCH  /:id   → update a bookmark (partial update)
 * - DELETE /:id   → delete a bookmark
 */
router
  .route("/:id")
  .get(bookmarkController.getBookmark)
  .patch(checkEmptyBody, bookmarkController.updateBookmark)
  .delete(bookmarkController.deleteBookmark);

module.exports = router;
