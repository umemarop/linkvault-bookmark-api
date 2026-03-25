const Bookmark = require("../models/bookmarkModel");
const APIFeatures = require("../utils/apiFeature");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Create a new bookmark
exports.createBookmark = catchAsync(async (req, res, next) => {
  const newBookmark = await Bookmark.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      bookmark: newBookmark,
    },
  });
});

// Get all bookmarks with advanced query features
exports.getAllBookmarks = catchAsync(async (req, res, next) => {
  // Apply filtering, searching, sorting, and field limiting
  const features = new APIFeatures(Bookmark.find(), req.query, Bookmark)
    .filter()
    .search()
    .sort()
    .limitFields();

  // Apply pagination separately (needs total count)
  await features.paginate();

  const bookmarks = await features.query;

  res.status(200).json({
    status: "success",
    results: bookmarks.length,
    pagination: features.paginationResult,
    data: {
      bookmarks,
    },
  });
});

// Get a single bookmark by ID
exports.getBookmark = catchAsync(async (req, res, next) => {
  const bookmark = await Bookmark.findById(req.params.id);

  // If no document found, forward an operational error
  if (!bookmark) {
    return next(new AppError("No bookmark found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      bookmark,
    },
  });
});

// Update a bookmark by ID
exports.updateBookmark = catchAsync(async (req, res, next) => {
  const bookmark = await Bookmark.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return updated document
    runValidators: true, // enforce schema validation on update
  });

  // Handle case where document does not exist
  if (!bookmark) {
    return next(new AppError("No bookmark found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      bookmark,
    },
  });
});

// Delete a bookmark by ID
exports.deleteBookmark = catchAsync(async (req, res, next) => {
  const bookmark = await Bookmark.findByIdAndDelete(req.params.id);

  // Handle case where document does not exist
  if (!bookmark) {
    return next(new AppError("No bookmark found with that ID", 404));
  }

  // 204 No Content for successful deletion
  res.status(204).send();
});
